const archiver = require('archiver');
const archive = archiver('zip', { zlib: { level: 0 } });
console.log(archive ? "Success" : "Failed");
