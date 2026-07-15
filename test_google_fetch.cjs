async function run() {
  const r = await fetch('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png');
  const b = await r.arrayBuffer();
  console.log("Size:", b.byteLength);
}
run();
