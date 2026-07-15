async function run() {
  const { ZipArchive } = await import('archiver');
  const archive = new ZipArchive({ zlib: { level: 0 } });
  
  archive.on('data', () => {});
  archive.on('end', () => console.log('Finished'));
  
  const arrayBuffer = new ArrayBuffer(6000);
  archive.append(Buffer.from(arrayBuffer), { name: 'test.txt' });
  
  await archive.finalize();
}
run();
