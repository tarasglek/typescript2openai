// import async fs
import * as fs from 'fs/promises';
import { parseTypescript } from './parser';
/**
 * main function
 * @param args cmd args
 * @returns {Promise<void>}
 */
async function main(args: string[]) {
    const self = await fs.readFile(process.argv[1]).then(x => x.toString());
    parseTypescript(self)
}

if (require.main === module) {
  main(process.argv.slice(2));
}