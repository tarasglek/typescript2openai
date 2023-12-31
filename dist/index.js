import * as acorn from "acorn";
import { tsPlugin } from "acorn-typescript";
/**
 * Converts a typescript keyword to a JSON schema type
 * @param value The typescript keyword
 */
function jsonSchemaTypeFromKeyword(value) {
    const match = value.match(/^TS(.*)Keyword$/);
    let ts_type = match ? match[1].toLowerCase() : value;
    if (ts_type === 'any') {
        return undefined;
    }
    return ts_type;
}
/**
 * Generates a JSON schema for function parameters
 * @param node The AST node for the function
 * @param paramDescriptions The descriptions for each parameter
 */
function generateParamJsonSchema(node, paramDescriptions) {
    const schema = {
        type: "object",
        properties: {}
    };
    function getType(typeNode) {
        if (typeNode.type === 'TSArrayType') {
            return {
                "type": "array",
                "items": {
                    "type": getType(typeNode.elementType)
                }
            };
        }
        else {
            return jsonSchemaTypeFromKeyword(typeNode.type);
        }
    }
    node.params.forEach((param) => {
        let param_type = param.typeAnnotation ? getType(param.typeAnnotation.typeAnnotation) : undefined;
        let param_description = paramDescriptions[param.name];
        let entry = { ...(param_type ? { type: param_type } : {}), ...(param_description ? { description: param_description } : {}) };
        schema.properties[param.name] = entry;
        if (!param.optional) {
            if (!schema.required) {
                schema.required = [];
            }
            schema.required.push(param.name);
        }
    });
    return schema;
}
/**
 * Parses a JSDoc comment and returns the function description and parameter descriptions
 * @param jsdoc The JSDoc comment to parse
 */
export function parseJSDoc(comment) {
    const matches = comment.match(/\/\*\*([\s\S]*?)\*\//g);
    if (!matches) {
        return { funcDescription: undefined, params: {} };
    }
    const lastMatch = matches.pop();
    if (!lastMatch) {
        return { funcDescription: undefined, params: {} };
    }
    const commentContent = lastMatch.match(/\/\*\*([\s\S]*?)\*\//);
    if (!commentContent || commentContent.length < 2) {
        return { funcDescription: undefined, params: {} };
    }
    const lines = commentContent[1].split('\n');
    let funcDescription = '';
    let params = {};
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('*')) {
            line = line.slice(1).trim();
            if (line.startsWith('@param')) {
                const paramParts = line.split(' ');
                const paramName = paramParts[1];
                const paramDescription = paramParts.slice(2).join(' ');
                params[paramName] = paramDescription;
            }
            else {
                funcDescription += line + '\n';
            }
        }
    }
    return {
        funcDescription: funcDescription.trim(),
        params: params
    };
}
/**
 * Parses a typescript file with acorn-typescript and returns a JSON schema for each function
 * @param code The typescript code to parse
 * @returns A JSON schema for each function
 */
export function parseTypeScript(code) {
    const ast = acorn.Parser.extend(tsPlugin()).parse(code, {
        sourceType: "module",
        ecmaVersion: "latest",
    });
    function walk(anode, callback, depth = 0) {
        const done = callback(anode, depth);
        if (done) {
            return;
        }
        const node = anode;
        for (const key in node) {
            if (node[key] && typeof node[key] === "object") {
                walk(node[key], callback, depth + 1);
            }
        }
    }
    let lastLocEnd = 0;
    let retls = [];
    walk(ast, (node, depth) => {
        let abortWalk = false;
        if (node.type === "FunctionDeclaration" ||
            (node.type === "ExportNamedDeclaration" &&
                node.declaration.type === "FunctionDeclaration")) {
            if (node.type === "ExportNamedDeclaration") {
                node = node.declaration;
            }
            const node_loc_start = (node.loc?.start).index;
            let description = undefined;
            let paramDescriptions = {};
            let jsdoc = '';
            const node_id = node.id;
            if (node_loc_start !== undefined) {
                // print code between lastLocEnd and start
                jsdoc = code.substring(lastLocEnd, node_loc_start);
                let parsedJSDoc = parseJSDoc(jsdoc);
                description = parsedJSDoc.funcDescription;
                paramDescriptions = parsedJSDoc.params;
            }
            //   console.log(spaces + "FunctionDeclaration", node);
            let func = {
                name: node_id?.name || '',
                ...(description ? { description: description } : {}),
                parameters: generateParamJsonSchema(node, paramDescriptions)
            };
            // (func as any).jsdoc = jsdoc
            retls.push(func);
            abortWalk = true;
        }
        if (node.loc && node.loc.end && node.type !== "Program") {
            // console.log(node.type, node.loc.end)
            lastLocEnd = node.loc.end.index;
        }
        return abortWalk;
    });
    return retls;
}
