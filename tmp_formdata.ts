import fetch from "node-fetch";
import FormData from "form-data";

async function run() {
  const cebelcaApiKey = process.env.CEBELCA_API_KEY;
  const invoicePayload = [ { "_r": "partner", "_m": "select" } ];
  
  const form = new FormData();
  form.append("req", JSON.stringify(invoicePayload));

  const t3 = await fetch("https://www.cebelca.biz/API", {
    method: "POST",
    headers: { 
        "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":x").toString("base64"),
    },
    body: form
  });
  console.log("TS POST FormData:", t3.status, await t3.text());
}
run();
