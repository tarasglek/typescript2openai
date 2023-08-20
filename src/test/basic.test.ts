import { afterAll, beforeAll, expect, test } from 'vitest'
import fs from 'fs/promises'
import { parseTypescript } from '..';

test('parse-index', async () => {
    const self = await fs.readFile('sample_typescript.ts').then(x => x.toString());
    const funcs = parseTypescript(self)
    // find .name == 'parseTypescript'
    const basicFunc = funcs.find(x => x.name == 'basicFunc')
    expect(basicFunc).toBeDefined()
    expect(basicFunc?.name).toBe('basicFunc')
    expect(basicFunc?.parameters).toBeDefined()
    expect(basicFunc?.parameters?.properties?.jsdoc?.type).toBe('string')
    expect(basicFunc?.parameters?.properties?.jsdoc?.description).toBe('The JSDoc comment to parse')
    expect(basicFunc?.parameters?.required?.[0]).toBe('jsdoc')
    console.log(JSON.stringify(basicFunc, null, 2))
    // const parsed = parseTypescript(self)
    // expect(parsed).
})