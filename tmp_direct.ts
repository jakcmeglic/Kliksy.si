import fetch from "node-fetch";

async function run() {
  const t1 = await fetch("https://app.cebelca.biz/api/v1/invoice", {
    method: "GET",
  });
  console.log(t1.status, await t1.text());
}
run();
