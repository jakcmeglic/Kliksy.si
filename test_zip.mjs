import { ZipArchive } from 'archiver';
import fs from 'fs';
const archive = new ZipArchive({ zlib: { level: 0 } });
const output = fs.createWriteStream('test.zip');
archive.pipe(output);
archive.append('hello world', { name: 'hello.txt' });
archive.finalize();
output.on('close', () => console.log('Done, size:', archive.pointer()));
