/**
 * First function is a bit of
 * a corner case for jsdoc parsing
 * @param jsdoc The JSDoc comment to parse
 */
function firstFunc(jsdoc: string) {
}

function noTypesOrJSDoc(_param) {
}

/**
 * Parses a JSDoc comment and returns the function description and parameter descriptions
 * @param jsdoc The JSDoc comment to parse
 */
function basicFunc(jsdoc: string): { funcDescription: string, params: { [key: string]: string } } {
    return {} as any;
}

/**
 * exported function
 * @param jsdoc The JSDoc comment to parse
 */
export function exportedFunc(jsdoc: string) {
}

function funcWithOptionalParam(firstParam: string, optional?: number) {
}

function funcWithArray(s:string, arrayParam: string[]) {
}