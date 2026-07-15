async function run() {
  const { ZipArchive } = await import('archiver');
  const fs = require('fs');

  const output = fs.createWriteStream('test_buffer.zip');
  const archive = new ZipArchive({ zlib: { level: 0 } });

  archive.pipe(output);
  archive.append(Buffer.from('hello world'), { name: 'hello.txt' });

  await archive.finalize();
  console.log('Finished buffer zip');
}
run();
