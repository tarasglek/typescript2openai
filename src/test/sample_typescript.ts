import * as acorn from "acorn";
import { tsPlugin } from "acorn-typescript";

export interface FunctionParams {
    properties: {
        [key: string]: {
            type: string;
            description: string;
        };
    };
    required: string[];
}
export interface FunctionSchema {
    name: string | undefined;
    description: string | undefined;
    parameters: FunctionParams
}

/**
 * Converts a typescript keyword to a JSON schema type
 * @param value The typescript keyword
 */
function jsonSchemaTypeFromKeyword(value: string): string | undefined {
    const match = value.match(/^TS(.*)Keyword$/);
    return match ? match[1].toLowerCase() : undefined;
}

/**
 * Generates a JSON schema for function parameters
 * @param node The AST node for the function
 * @param paramDescriptions The descriptions for each parameter
 */
function generateParamJsonSchema(node: any, paramDescriptions: any): FunctionParams {
    const schema: any = { properties: {}, required: [] };

    function getType(typeNode: any): any {
        if (typeNode.type === 'TSArrayType') {
            return getType(typeNode.elementType) + '[]';
        } else {
            return jsonSchemaTypeFromKeyword(typeNode.type);
        }
    }

    node.params.forEach((param: any) => {
        let type = param.typeAnnotation ? getType(param.typeAnnotation.typeAnnotation) : 'any';
        schema.properties[param.name] = { type, description: paramDescriptions[param.name] };
        if (!param.optional) {
            schema.required.push(param.name);
        }
    });
    return schema;
}

/**
 * Parses a JSDoc comment and returns the function description and parameter descriptions
 * @param jsdoc The JSDoc comment to parse
 */
function basicFunc(jsdoc: string): { funcDescription: string, params: { [key: string]: string } } {
    return {} as any;
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
            let description = undefined
            let paramDescriptions = {}
            let jsdoc = ''
            if (node.loc && lastLocEnd) {
                let start = node.loc.start
                // print code between lastLocEnd and start
                jsdoc = code.substring(lastLocEnd, (start as any).index)
                let parsedJSDoc = parseJSDoc(jsdoc)
                // console.log(jsdoc)
                // console.log((jsdoc))
                description = parsedJSDoc.funcDescription
                paramDescriptions = parsedJSDoc.params
            }
            //   console.log(spaces + "FunctionDeclaration", node);
            const node_id = (node as any).id
            let func: FunctionSchema = {
                name: node_id?.name as string | undefined,
                description: description || '',
                parameters: generateParamJsonSchema(node, paramDescriptions)
            };
            (func as any).jsdoc = jsdoc
            retls.push(func)
            abortWalk = true;
        }
        if (node.loc && node.loc.end) {
            lastLocEnd = (node.loc.end as any).index
        }
        return abortWalk;
    });
    return retls
}