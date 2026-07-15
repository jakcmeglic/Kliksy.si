async function run() {
  const express = require('express');
  const { ZipArchive } = await import('archiver');
  const app = express();
  
  app.get('/test', async (req, res) => {
    try {
      const archive = new ZipArchive({ zlib: { level: 0 } });
      archive.pipe(res);
      archive.append(Buffer.alloc(6000, 'A'), { name: 'test.txt' });
      await archive.finalize();
      console.log('Finalized');
    } catch(e) {
      console.error(e);
    }
  });
  
  const server = app.listen(3001, () => {
    const http = require('http');
    http.get('http://localhost:3001/test', (res) => {
      let size = 0;
      res.on('data', chunk => size += chunk.length);
      res.on('end', () => {
        console.log('Client received', size);
        server.close();
      });
    });
  });
}
run();
