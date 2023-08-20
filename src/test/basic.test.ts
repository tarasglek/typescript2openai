import { afterAll, beforeAll, expect, test } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import { parseJSDoc, parseTypescript } from '..';

test('parse-jsdoc', () => {
    const comment = `
/**
 * line 1
 * line 2
 * @param wDesc some description
 * @param paramWithoutDescription
 */`
    const parsed = parseJSDoc(comment)
    expect(parsed.funcDescription).toBe("line 1\nline 2")
    const params = parsed.params
    expect(params).toBeDefined()
    expect(params?.wDesc).toBe("some description")
    expect(params?.paramWithoutDescription).toBe("")

    const noDoc = parseJSDoc('')
    expect(noDoc.funcDescription).toBeUndefined()
})

test('parse-ts', async () => {
    // sample_typescript.ts is in same dir as this test file
    const self = await fs.readFile(path.join(__dirname, 'sample_typescript.ts')).then(x => x.toString());
    const funcs = parseTypescript(self)

    function findFunc(name: string, log = false) {
        let ret = funcs.find(x => x.name == name)
        expect(ret).toBeDefined()
        if (log) {
            console.log(JSON.stringify(ret, null, 2))
        }
        return ret
    }

    expect(findFunc('firstFunc')).toEqual({
        "name": "firstFunc",
        "parameters": {
            "properties": {
                "jsdoc": {
                    "type": "string",
                    "description": "The JSDoc comment to parse"
                }
            },
            "required": [
                "jsdoc"
            ]
        },
        "description": "First function is a bit of\na corner case for jsdoc parsing"
    })

    expect(findFunc('basicFunc')).toEqual({
        "name": "basicFunc",
        "parameters": {
            "properties": {
                "jsdoc": {
                    "type": "string",
                    "description": "The JSDoc comment to parse"
                }
            },
            "required": [
                "jsdoc"
            ]
        },
        "description": "Parses a JSDoc comment and returns the function description and parameter descriptions"
    })

    expect(findFunc('exportedFunc')).toEqual({
        "name": "exportedFunc",
        "parameters": {
            "properties": {
                "jsdoc": {
                    "type": "string",
                    "description": "The JSDoc comment to parse"
                }
            },
            "required": [
                "jsdoc"
            ]
        },
        "description": "exported function"
    })

    expect(findFunc('noTypesOrJSDoc')).toEqual({
        "name": "noTypesOrJSDoc",
        "parameters": {
            "properties": {
                "_param": {
                    "type": "object"
                }
            },
            "required": [
                "_param"
            ]
        }
    })

    expect(findFunc("funcWithArrayAndOptionalParam", true)).toEqual({
        "name": "funcWithArrayAndOptionalParam",
        "description": "Example of a function that takes an array and has an optional parameter",
        "parameters": {
            "properties": {
                "firstParam": {
                    "type": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "optional": {
                    "type": "number",
                    "description": "This one does not show up in required"
                }
            },
            "required": [
                "firstParam"
            ]
        }
    })

    expect(findFunc("funcWithArray")).toEqual({
        "name": "funcWithArray",
        "parameters": {
            "properties": {
                "s": {
                    "type": "string"
                },
                "arrayParam": {
                    "type": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                }
            },
            "required": [
                "s",
                "arrayParam"
            ]
        }
    })
})