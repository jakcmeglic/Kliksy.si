import * as fs from 'fs';
let server = fs.readFileSync('server.ts', 'utf8');

server = server.replace(/await resend\.emails\.send\(\{([\s\S]*?)\}\);/g, `const { data, error } = await resend.emails.send({$1});\n        if (error) {\n          console.error("Resend API Error:", error);\n        }`);

fs.writeFileSync('server.ts', server);
console.log("Replaced!");
