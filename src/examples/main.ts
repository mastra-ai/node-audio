import fs from "fs";
import path from "path";

const __dir = path.resolve(process.cwd(), path.dirname('src/examples'));

async function main() {
  let executed = false;
  const files = await fs.promises.readdir(__dir, { recursive: true });
  const example = process.argv[2];  

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