const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /  app\.get\("\/api\/proxy-image"[\s\S]*?\n  \}\);\n/m;
content = content.replace(regex, '');

fs.writeFileSync('server.ts', content);
