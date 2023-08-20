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

/**
 * Example of a function that takes an array and has an optional parameter
 * @param Marvel at how verbose these are to write manually
 * @param optional This one does not show up in required
 */
function funcWithArrayAndOptionalParam(firstParam: string[], optional?: number) {
}


function funcWithArray(s:any, arrayParam: string[]) {
}