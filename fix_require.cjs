const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes("import { Readable } from 'stream';")) {
  content = "import { Readable } from 'stream';\n" + content;
}

content = content.replace(/const \{ Readable \} = require\('stream'\);/g, '');
content = content.replace(/require\('stream'\)\.Readable/g, 'Readable');

fs.writeFileSync('server.ts', content, 'utf8');
console.log('Fixed stream require');
