async function run() {
  const url = "https://firebasestorage.googleapis.com/v0/b/nova-305de.appspot.com/o/events%2FVB764iB8n2c27kC5v51q%2Fphotos%2F49222984.heic?alt=media&token=3d9b207f11-bd7b-4571-a53f-935a9171282f";
  console.log("fetching...");
  const res = await fetch(url);
  console.log("status", res.status);
  const arr = await res.arrayBuffer();
  console.log("size", arr.byteLength);
}
run().catch(console.error);
