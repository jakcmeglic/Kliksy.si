import { ZipArchive } from 'archiver';
const archive = new ZipArchive({ zlib: { level: 0 }});
console.log(archive ? "Success" : "Failed");
