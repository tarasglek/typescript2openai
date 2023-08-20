import { afterAll, beforeAll, expect, test } from 'vitest'
import fs from 'fs/promises'
import { parseTypescript } from '.';

test('parse-index', async () => {
    const self = await fs.readFile('index.ts').then(x => x.toString());
    const funcs = parseTypescript(self)
    // console.log(JSON.stringify(funcs, null, 2))
    // find .name == 'parseTypescript'
    const parseJSDoc = funcs.find(x => x.name == 'parseJSDoc')
    expect(parseJSDoc).toBeDefined()
    expect(parseJSDoc?.name).toBe('parseJSDoc')
    expect(parseJSDoc?.parameters).toBeDefined()
    expect(parseJSDoc?.parameters?.properties?.jsdoc?.type).toBe('string')
    expect(parseJSDoc?.parameters?.properties?.jsdoc?.description).toBe('The JSDoc comment to parse')
    console.log(JSON.stringify(parseJSDoc, null, 2))
    // const parsed = parseTypescript(self)
    // expect(parsed).
})