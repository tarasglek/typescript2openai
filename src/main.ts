import fs from 'fs/promises'
import { parseTypeScript } from ".";

async function main(filename: string) {
    const ts_file = await fs.readFile(filename).then(x => x.toString());
    console.log(JSON.stringify(parseTypeScript(ts_file), null, 2))
}

if (require && require.main === module) {
    if (process.argv.length < 3) {
        console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <typescript/javascript file>`);
        process.exit(1);
    }
    main(process.argv[2]);
}