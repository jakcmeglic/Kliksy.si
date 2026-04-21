async function check() {
  const cebelcaApiKey = process.env.CEBELCA_API_KEY;
  const invoicePayload = [
    {
      _r: "partner",
      _m: "select",
    }
  ];

  const params = new URLSearchParams();
  params.append("req", JSON.stringify(invoicePayload));

  const response = await fetch("https://www.cebelca.biz/API-v1", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":x").toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  console.log("Status:", response.status);
  console.log("Body:", await response.text());
}
check();
