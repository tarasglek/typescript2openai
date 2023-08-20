import * as acorn from "acorn";
import { tsPlugin } from "acorn-typescript";

export interface FunctionParams {
    properties: {
        [key: string]: {
            type: ParamType;
            description?: string;
        };
    };
    required?: string[];
}
export interface FunctionSchema {
    name: string;
    description?: string;
    parameters: FunctionParams
}

/**
 * Converts a typescript keyword to a JSON schema type
 * @param value The typescript keyword
 */
function jsonSchemaTypeFromKeyword(value: string): string {
    const match = value.match(/^TS(.*)Keyword$/);
    return match ? match[1].toLowerCase() : value;
}


/**
 * Is either a simple string like "number" or a more complex type { type: "array", items: { type: "number" } }
 */
type ParamType = string | { type: string, items: { type: ParamType } };

/**
 * Generates a JSON schema for function parameters
 * @param node The AST node for the function
 * @param paramDescriptions The descriptions for each parameter
 */
function generateParamJsonSchema(node: any, paramDescriptions: any): FunctionParams {
    const schema: any = { properties: {} };

    function getType(typeNode: any): ParamType {
        if (typeNode.type === 'TSArrayType') {
            return {
                "type": "array",
                "items": {
                    "type": getType(typeNode.elementType)
                }
            }
        } else {
            return jsonSchemaTypeFromKeyword(typeNode.type);
        }
    }

    node.params.forEach((param: any) => {
        let type = param.typeAnnotation ? getType(param.typeAnnotation.typeAnnotation) : 'object';
        schema.properties[param.name] = { type, description: paramDescriptions[param.name] };
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
export function parseJSDoc(comment: string): { funcDescription?: string, params: { [key: string]: string } } {
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
    let params: { [key: string]: string } = {};

    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('*')) {
            line = line.slice(1).trim();
            if (line.startsWith('@param')) {
                const paramParts = line.split(' ');
                const paramName = paramParts[1];
                const paramDescription = paramParts.slice(2).join(' ');
                params[paramName] = paramDescription;
            } else {
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
export function parseTypescript(code: string): FunctionSchema[] {
    const ast = acorn.Parser.extend(tsPlugin() as any).parse(code, {
        sourceType: "module",
        ecmaVersion: "latest",
    });

    function walk(anode: acorn.Node, callback: any, depth = 0) {
        const done = callback(anode, depth);
        if (done) {
            return;
        }
        const node = anode as any;
        for (const key in node) {
            if (node[key] && typeof node[key] === "object") {
                walk(node[key], callback, depth + 1);
            }
        }
    }
    let lastLocEnd = 0
    let retls: FunctionSchema[] = []
    walk(ast, (node: acorn.Node, depth: number) => {
        let abortWalk = false;
        if (node.type === "FunctionDeclaration" ||
            (node.type === "ExportNamedDeclaration" &&
                (node as any).declaration.type === "FunctionDeclaration")) {
            if (node.type === "ExportNamedDeclaration") {
                node = (node as any).declaration;
            }
            const node_loc_start = (node.loc?.start as any).index
            let description = undefined
            let paramDescriptions = {}
            let jsdoc = ''
            const node_id = (node as any).id
            if (node_loc_start !== undefined) {
                // print code between lastLocEnd and start
                jsdoc = code.substring(lastLocEnd, node_loc_start)
                let parsedJSDoc = parseJSDoc(jsdoc)
                description = parsedJSDoc.funcDescription
                paramDescriptions = parsedJSDoc.params
            }
            //   console.log(spaces + "FunctionDeclaration", node);
            let func: FunctionSchema = {
                name: node_id?.name as string || '',
                parameters: generateParamJsonSchema(node, paramDescriptions)
            };
            if (description) {
                func.description = description;
            }
            // (func as any).jsdoc = jsdoc
            retls.push(func)
            abortWalk = true;
        }
        if (node.loc && node.loc.end && node.type !== "Program") {
            // console.log(node.type, node.loc.end)
            lastLocEnd = (node.loc.end as any).index
        }
        return abortWalk;
    });
    return retls
}