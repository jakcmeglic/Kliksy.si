import fetch from "node-fetch";

async function run() {
  const cebelcaApiKey = process.env.CEBELCA_API_KEY;
  console.log("CEBELCA_API_KEY", cebelcaApiKey);

  // Try API token as username, password x
  const t1 = await fetch("https://www.cebelca.biz/API-v1?_r=partner&_m=select", {
    method: "GET",
    headers: { "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":x").toString("base64") }
  });
  console.log("Token:x GET", t1.status, await t1.text());

  // Try API token alone
  const t2 = await fetch("https://www.cebelca.biz/API-v1?_r=partner&_m=select", {
    method: "GET",
    headers: { "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":").toString("base64") }
  });
  console.log("Token: GET", t2.status, await t2.text());
  
  // Try sending as json to /API
  const t3 = await fetch("https://www.cebelca.biz/API", {
    method: "POST",
    headers: { 
        "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":x").toString("base64"),
        "Content-Type": "application/json"
    },
    body: JSON.stringify([{ _r: "partner", _m: "select" }])
  });
  console.log("Token:x POST /API", t3.status, await t3.text());
}
run();
