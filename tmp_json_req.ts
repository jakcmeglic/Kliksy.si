import fetch from "node-fetch";

async function run() {
  const cebelcaApiKey = process.env.CEBELCA_API_KEY;
  const t1 = await fetch("https://www.cebelca.biz/API", {
    method: "POST",
    headers: { 
        "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":x").toString("base64"),
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ req: [{ _r: "partner", _m: "select" }] })
  });
  console.log("JSON req POST /API:", await t1.text());
}
run();
