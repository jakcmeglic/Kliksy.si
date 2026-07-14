// test_zip.ts
var import_archiver = require("archiver");
var archive = new import_archiver.ZipArchive({ zlib: { level: 0 } });
console.log(archive ? "Success" : "Failed");
