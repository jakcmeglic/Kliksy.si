import fetch from "node-fetch";

async function run() {
  const cebelcaApiKey = process.env.CEBELCA_API_KEY;
  const invoicePayload = [ { _r: "partner", _m: "select" } ];
  const params = new URLSearchParams();
  params.append("req", JSON.stringify(invoicePayload));

  const t3 = await fetch("https://www.cebelca.biz/API", {
    method: "POST",
    headers: { 
        "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":x").toString("base64"),
    },
    body: params
  });
  console.log("URL params POST /API status:", t3.status);
  console.log("Response text:", await t3.text());
}
run();
