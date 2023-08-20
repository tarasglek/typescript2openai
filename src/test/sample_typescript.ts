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


function funcWithArray(s: any, arrayParam: string[]) {
}
// TODO: add test for this
/**
 * 4. The function itself, must be async. It should accept an Object
 * matching the schema defined in parameters and should return a Promise
 * to a string or any other JavaScript object.
 *
 * If you return a non-string, it will be displayed as JSON.
 *
 * If you return a string, you can format it as a Markdown code block
 * so that it gets displayed correctly.  For example:
 *
 * return "```html
" + result + "```";
*/
export default async function (data) {
    return data.value;
}

/**
* Echo back
* @param s The text to echo
*/
function echo(s: string) {
    return s;
}
/**
 * This function executes clickhouse queries
 * @param value Valid Clickhouse SQL query
 */
function runClickhouseQuery(value: string) {
    console.log(value)
    return fetch("https://play.clickhouse.com/?user=play", {
        method: "POST",
        body: `${value} FORMAT Markdown`,
    }).then(x => x.text());
}
