export interface FunctionParams {
    properties: {
        [key: string]: {
            type?: ParamType;
            description?: string;
        };
    };
    required?: string[];
}
export interface FunctionSchema {
    name: string;
    description?: string;
    parameters: {
        type: "object";
        properties: FunctionParams;
    };
}
/**
 * Is either a simple string like "number" or a more complex type { type: "array", items: { type: "number" } }
 */
type ParamType = undefined | string | {
    type: string;
    items: {
        type: ParamType;
    };
};
/**
 * Parses a JSDoc comment and returns the function description and parameter descriptions
 * @param jsdoc The JSDoc comment to parse
 */
export declare function parseJSDoc(comment: string): {
    funcDescription?: string;
    params: {
        [key: string]: string;
    };
};
/**
 * Parses a typescript file with acorn-typescript and returns a JSON schema for each function
 * @param code The typescript code to parse
 * @returns A JSON schema for each function
 */
export declare function parseTypeScript(code: string): FunctionSchema[];
export {};
