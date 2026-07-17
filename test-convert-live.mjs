import heicConvert from 'heic-convert';

const url = "https://raw.githubusercontent.com/nokatech/heic-decode/main/images/0002.heic"; // some test heic
const res = await fetch(url);
const arrayBuffer = await res.arrayBuffer();
let buffer = Buffer.from(arrayBuffer);

try {
  buffer = await heicConvert({
    buffer: buffer,
    format: 'JPEG',
    quality: 0.5
  });
  console.log("Converted! Size:", buffer.length);
} catch (err) {
  console.error("heicConvert error:", err);
}
