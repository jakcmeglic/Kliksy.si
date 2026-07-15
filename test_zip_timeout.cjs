const http = require('http');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/download-zip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  console.log('STATUS:', res.statusCode);
  res.on('data', () => {});
  setTimeout(() => {
    console.log('Destroying socket');
    res.destroy();
  }, 100);
});
req.write(JSON.stringify({
  eventName: 'test',
  photos: Array(10).fill({url: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg', type: 'image'})
}));
req.end();
