const http = require('http');

const data = JSON.stringify({
  eventName: 'test',
  photos: Array(2).fill({url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', type: 'image'})
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
  let body = Buffer.alloc(0);
  res.on('data', (chunk) => { body = Buffer.concat([body, chunk]); });
  res.on('end', () => console.log('Response string:', body.toString()));
});
req.write(data);
req.end();
