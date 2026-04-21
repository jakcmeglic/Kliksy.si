import fetch from "node-fetch";

async function run() {
  const cebelcaApiKey = process.env.CEBELCA_API_KEY;
  const t3 = await fetch("https://www.cebelca.biz/API?_r=partner&_m=select", {
    method: "POST",
    headers: { 
        "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":x").toString("base64"),
    }
  });
  console.log("POST /API?_r...:", t3.status, await t3.text());
}
run();
