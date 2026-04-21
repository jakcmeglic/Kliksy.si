import fetch from "node-fetch";

async function run() {
  const t3 = await fetch("https://www.cebelca.biz/API", {
    method: "POST",
    headers: { 
        "Authorization": "Basic " + Buffer.from("wrong:x").toString("base64"),
        "Content-Type": "application/json"
    },
    body: JSON.stringify([{ _r: "partner", _m: "select" }])
  });
  console.log("Wrong token POST /API", t3.status, await t3.text());
}
run();
