const http = require('http');

const data = JSON.stringify({
  eventName: 'test',
  photos: Array(20).fill({url: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&w=1080&fit=max', type: 'image'})
});

const start = Date.now();
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
  res.on('data', () => {});
  res.on('end', () => console.log('Finished 20 photos in', Date.now() - start, 'ms'));
});
req.write(data);
req.end();
