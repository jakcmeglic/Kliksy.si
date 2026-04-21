async function check() {
  const r = await fetch('http://0.0.0.0:3000/api/debug-cebelca-env');
  console.log(await r.json());
}
check();
