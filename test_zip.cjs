const http = require('http');

const data = JSON.stringify({
  eventName: 'test',
  photos: Array(2).fill({url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg', type: 'image'})
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/download-zip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log('STATUS:', res.statusCode);
  let size = 0;
  res.on('data', (chunk) => { size += chunk.length; });
  res.on('end', () => console.log('Finished, size:', size));
});

req.write(data);
req.end();
