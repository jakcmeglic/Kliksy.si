const http = require('http');

const data = JSON.stringify({
  eventName: 'test',
  photos: Array(5).fill({url: 'https://via.placeholder.com/150', type: 'image'})
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/download-zip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let size = 0;
  res.on('data', (chunk) => { size += chunk.length; });
  res.on('end', () => console.log('Finished 5 placeholder photos in', size, 'bytes'));
});
req.write(data);
req.end();
