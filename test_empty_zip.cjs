async function run() {
  const { ZipArchive } = await import('archiver');
  const fs = require('fs');

  const output = fs.createWriteStream('test.zip');
  const archive = new ZipArchive({ zlib: { level: 0 } });

  archive.pipe(output);

  archive.finalize().then(() => console.log('Finished empty zip')).catch(e => console.error(e));
}
run();
