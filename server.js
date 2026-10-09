import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compiledServer = path.join(__dirname, 'dist', 'server.js');
if (fs.existsSync(compiledServer)) {
  await import('./dist/server.js');
} else {
  await import('./server.ts');
}
