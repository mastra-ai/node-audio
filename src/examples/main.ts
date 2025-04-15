import fs from "fs";
import path from "path";

const __dir = path.resolve(process.cwd(), 'src/examples');

console.log(__dir);

async function main() {
  let executed = false;
  const files = await fs.promises.readdir(__dir, { recursive: true });
  const example = process.argv[2]; 

  const examples = files.filter(file => file.includes('main.ts')).filter(file => file !== 'main.ts');
  const exampleNames = examples.map(example => path.basename(example.replace('main.ts', '')));

  if (!example) {
    console.log('Please provide an example name to run');
    console.log(exampleNames);
    return;
  }

  for (const file of files) {
    if (file.includes(`${example}/main.ts`)) {
      executed = true;
      console.log(`Executing ${file}`);
      if (typeof require !== 'undefined') {
        // CommonJS
        require(path.join(__dir, file));
      } else {
        // ESM
        await import(path.join(__dir, file));
      }
    }
  }

  if (!executed) {
    console.log(`Example ${example} not found`);
  }
}

main();