// server.ts
import express from "express";
import Stripe from "stripe";
import path from "path";
async function calculatePrice(plan, discountCode, deliveryMode, standsQuantity, printedQrQuantity) {
  const plans = {
    basic: 3900,
    // in cents
    plus: 4900,
    premium: 7900
  };
  const originalPrice = plans[plan] || 4900;
  let upsellPrice = 0;
  if (standsQuantity === 5) upsellPrice += 1999;
  else if (standsQuantity === 10) upsellPrice += 2499;
  else if (standsQuantity === 20) upsellPrice += 2999;
  else if (standsQuantity === 30) upsellPrice += 3499;
  let finalPrice = originalPrice + upsellPrice;
  if (discountCode) {
    const code = discountCode.trim().toLowerCase();
    if (code === "test99") {
      return upsellPrice;
    } else if (code === "prvi50") {
      return Math.round(finalPrice * 0.5);
    } else if (code === "pomlad30") {
      return Math.round(finalPrice * 0.7);
    }
  }
  return finalPrice;
}
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  app.use(express.json());
  const requestLogs = [];
  app.use((req, res, next) => {
    const logEntry = `[REQUEST] ${req.method} ${req.url} (Host: ${req.headers.host})`;
    if (req.url.startsWith("/api")) {
      console.log(logEntry);
    }
    requestLogs.push(logEntry);
    if (requestLogs.length > 100) requestLogs.shift();
    next();
  });
  app.get("/api/logs", (req, res) => {
    res.json(requestLogs);
  });
  app.get("/api/debug-cebelca-env", (req, res) => {
    res.json({
      hasCebelcaKey: !!process.env.CEBELCA_API_KEY,
      keyLength: process.env.CEBELCA_API_KEY ? process.env.CEBELCA_API_KEY.length : 0
    });
  });
  app.post("/api/send-welcome-email", async (req, res) => {
    const { email, displayName } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn("SMTP configuration missing. Skipping welcome email.");
      return res.json({ success: false, message: "SMTP not configured" });
    }
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      const mailOptions = {
        from: `"Kliksy" <${smtpUser}>`,
        replyTo: `"Kliksy Podpora" <info@kliksy.si>`,
        to: email,
        subject: "Dobrodo\u0161li pri Kliksy!",
        text: `Dobrodo\u0161li pri Kliksy!

Pozdravljeni ${displayName || ""},

Hvala, ker ste se registrirali pri Kliksy. Veseli smo, da ste se nam pridru\u017Eili!

Z na\u0161o aplikacijo lahko preprosto ustvarite unikatne QR kode za va\u0161e dogodke in zbirate fotografije va\u0161ih gostov na enem mestu.

\u010Ce imate kakr\u0161na koli vpra\u0161anja, nam preprosto odgovorite na ta email.

Lep pozdrav,
Ekipa Kliksy`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Dobrodo\u0161li pri Kliksy!</h1>
            <p>Pozdravljeni ${displayName || ""},</p>
            <p>Hvala, ker ste se registrirali pri Kliksy. Veseli smo, da ste se nam pridru\u017Eili!</p>
            <p>Z na\u0161o aplikacijo lahko preprosto ustvarite unikatne QR kode za va\u0161e dogodke in zbirate fotografije va\u0161ih gostov na enem mestu.</p>
            <p>\u010Ce imate kakr\u0161na koli vpra\u0161anja, nam preprosto odgovorite na ta email.</p>
            <br />
            <p>Lep pozdrav,<br />Ekipa Kliksy</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/send-order-summary", async (req, res) => {
    const { email, eventName, plan, amountPaid, standsQuantity, printedQrQuantity, deliveryMode } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.warn("SMTP configuration missing. Skipping order summary email.");
      return res.json({ success: false, message: "SMTP not configured" });
    }
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      const hasExtras = standsQuantity > 0;
      let extrasHtml = "";
      if (hasExtras) {
        extrasHtml = `
          <h3>Dodatki</h3>
          <ul>
            ${standsQuantity > 0 ? `<li>Podstavki za mizo: ${standsQuantity} kosov</li>` : ""}
          </ul>
        `;
      }
      const mailOptions = {
        from: `"Kliksy" <${smtpUser}>`,
        replyTo: `"Kliksy Podpora" <info@kliksy.si>`,
        to: email,
        subject: "Povzetek va\u0161ega naro\u010Dila pri Kliksy",
        text: `Uspe\u0161no naro\u010Dilo!

Hvala za va\u0161 nakup! Va\u0161 dogodek ${eventName || "brez imena"} smo uspe\u0161no pripravili.

Podrobnosti naro\u010Dila:
Paket: ${plan ? plan.toUpperCase() : "Neznano"}
Skupaj pla\u010Dano: \u20AC${Number(amountPaid || 0).toFixed(2)}

Do nadzorne plo\u0161\u010De in urejanja va\u0161ega dogodka lahko dostopate na na\u0161i spletni strani.

Z lepimi pozdravi,
Va\u0161a ekipa Kliksy`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #4f46e5;">Uspe\u0161no naro\u010Dilo!</h1>
            <p>Hvala za va\u0161 nakup! Va\u0161 dogodek <strong>${eventName || "brez imena"}</strong> smo uspe\u0161no pripravili.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Podrobnosti naro\u010Dila</h2>
              <p><strong>Paket:</strong> ${plan ? plan.toUpperCase() : "Neznano"}</p>
              ${extrasHtml}
              <hr style="border: 1px solid #e5e7eb; margin: 15px 0;"/>
              <p style="font-size: 1.1em;"><strong>Skupaj pla\u010Dano:</strong> \u20AC${Number(amountPaid || 0).toFixed(2)}</p>
            </div>
            
            <p>Do nadzorne plo\u0161\u010De in urejanja va\u0161ega dogodka lahko dostopate na na\u0161i spletni strani.</p>
            <br />
            <p>Z lepimi pozdravi,<br />Va\u0161a ekipa Kliksy</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending order summary email:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/create-cebelca-invoice", async (req, res) => {
    const { eventData, totalAmount } = req.body;
    const cebelcaApiKey = process.env.CEBELCA_API_KEY;
    if (!cebelcaApiKey) {
      return res.status(400).json({
        success: false,
        message: `Manjka \u010Cebelca API klju\u010D v nastavitvah. process.env.CEBELCA_API_KEY is ${typeof cebelcaApiKey}`
      });
    }
    try {
      const items = [];
      const planName = eventData.plan ? eventData.plan.toUpperCase() : "Neznano";
      items.push({
        title: `Paket ${planName}`,
        qty: 1,
        mu: "kos",
        price: totalAmount,
        // For simplicity we put the whole total on the first line for now, or split it up if needed.
        vat: 22,
        // Set to 0 if not tax-liable!
        discount: 0
      });
      const invoicePayload = [
        {
          _r: "invoice-sent",
          _m: "insert-into",
          title: "Ra\u010Dun za spletno storitev Kliksy",
          date_sent: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          date_served: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          date_to_pay: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          // Paid immediately
          partner_name: eventData.isCompanyInvoice ? eventData.companyName : eventData.deliveryName ? `${eventData.deliveryName} ${eventData.deliverySurname}` : eventData.email,
          partner_address: eventData.isCompanyInvoice ? eventData.companyAddress : eventData.deliveryAddress || "",
          partner_postal: eventData.isCompanyInvoice ? "" : eventData.deliveryPostcode || "",
          partner_city: eventData.isCompanyInvoice ? "" : eventData.deliveryCity || "",
          partner_vat: eventData.isCompanyInvoice ? eventData.companyTaxId : "",
          payment_method: "K",
          // K = kartica
          notes: "Pla\u010Dano prek spleta (Stripe)."
        }
      ];
      items.forEach((item) => {
        invoicePayload.push({
          _r: "invoice-sent-b",
          _m: "insert-into",
          title: item.title,
          qty: item.qty,
          mu: item.mu,
          price: item.price,
          vat: item.vat,
          discount: item.discount
        });
      });
      const params = new URLSearchParams();
      params.append("req", JSON.stringify(invoicePayload));
      const response = await fetch("https://www.cebelca.biz/API", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(cebelcaApiKey + ":x").toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });
      const resultText = await response.text();
      if (!response.ok) {
        console.warn("Cebelca responded with non-ok:", response.status, resultText);
        if (response.status === 401) {
          throw new Error("Neveljaven API klju\u010D. Preverite ga v nastavitvah.");
        }
      }
      res.json({ success: true, message: "Ra\u010Dun uspe\u0161no obdelan!" });
    } catch (error) {
      console.error("Cebelca Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { plan, discountCode, standsQuantity, eventId, successUrl, cancelUrl } = req.body;
      const amount = await calculatePrice(plan, discountCode, "self_print", standsQuantity, 0);
      if (amount === 0) {
        return res.json({ url: successUrl, free: true });
      }
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured on the server. Please add it to your environment variables.");
      }
      const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Paket ${plan.toUpperCase()}`,
                description: `Dodatki: ${standsQuantity} stojal`
              },
              unit_amount: amount
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: eventId
      });
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { plan, discountCode, standsQuantity } = req.body;
      const amount = await calculatePrice(plan, discountCode, "self_print", standsQuantity, 0);
      if (amount === 0) {
        return res.json({ clientSecret: null, free: true });
      }
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured on the server. Please add it to your environment variables.");
      }
      const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "eur",
        payment_method_types: ["card"]
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.get("/api/proxy-image", async (req, res) => {
    try {
      const url = req.query.url;
      if (!url || !url.includes("firebasestorage.googleapis.com")) {
        res.status(400).send("Invalid or missing url");
        return;
      }
      const response = await fetch(url);
      if (!response.ok) {
        res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
        return;
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.set("Content-Type", response.headers.get("content-type") || "application/octet-stream");
      res.set("Content-Length", buffer.length.toString());
      res.send(buffer);
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).send("Proxy error: " + error.message);
    }
  });
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      setHeaders: (res, path2) => {
        if (path2.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  app.use((err, req, res, next) => {
    console.error("Global error handler caught:", err);
    if (req.url.startsWith("/api")) {
      res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    } else {
      next(err);
    }
  });
}
startServer();
