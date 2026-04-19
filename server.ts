import express from "express";
import Stripe from "stripe";
import path from "path";

// Main server initialization
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const requestLogs: string[] = [];

  // Log incoming requests
  app.use((req, res, next) => {
    const logEntry = `[REQUEST] ${req.method} ${req.url} (Host: ${req.headers.host})`;
    if (req.url.startsWith('/api')) {
      console.log(logEntry);
    }
    requestLogs.push(logEntry);
    if (requestLogs.length > 100) requestLogs.shift();
    next();
  });

  app.get("/api/logs", (req, res) => {
    res.json(requestLogs);
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
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"Kliksy" <${smtpUser}>`,
        replyTo: `"Kliksy Podpora" <info@kliksy.si>`,
        to: email,
        subject: "Dobrodošli pri Kliksy!",
        text: `Dobrodošli pri Kliksy!\n\nPozdravljeni ${displayName || ''},\n\nHvala, ker ste se registrirali pri Kliksy. Veseli smo, da ste se nam pridružili!\n\nZ našo aplikacijo lahko preprosto ustvarite unikatne QR kode za vaše dogodke in zbirate fotografije vaših gostov na enem mestu.\n\nČe imate kakršna koli vprašanja, nam preprosto odgovorite na ta email.\n\nLep pozdrav,\nEkipa Kliksy`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Dobrodošli pri Kliksy!</h1>
            <p>Pozdravljeni ${displayName || ''},</p>
            <p>Hvala, ker ste se registrirali pri Kliksy. Veseli smo, da ste se nam pridružili!</p>
            <p>Z našo aplikacijo lahko preprosto ustvarite unikatne QR kode za vaše dogodke in zbirate fotografije vaših gostov na enem mestu.</p>
            <p>Če imate kakršna koli vprašanja, nam preprosto odgovorite na ta email.</p>
            <br />
            <p>Lep pozdrav,<br />Ekipa Kliksy</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error: any) {
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
          pass: smtpPass,
        },
      });

      const hasExtras = deliveryMode === 'home_delivery' || standsQuantity > 0;
      let extrasHtml = '';
      if (hasExtras) {
        extrasHtml = `
          <h3>Dodatki</h3>
          <ul>
            ${deliveryMode === 'home_delivery' && printedQrQuantity > 0 ? `<li>Natisnjene QR kode: ${printedQrQuantity} kosov</li>` : ''}
            ${standsQuantity > 0 ? `<li>Podstavki za mizo: ${standsQuantity} kosov</li>` : ''}
          </ul>
        `;
      }

      const mailOptions = {
        from: `"Kliksy" <${smtpUser}>`,
        replyTo: `"Kliksy Podpora" <info@kliksy.si>`,
        to: email,
        subject: "Povzetek vašega naročila pri Kliksy",
        text: `Uspešno naročilo!\n\nHvala za vaš nakup! Vaš dogodek ${eventName || 'brez imena'} smo uspešno pripravili.\n\nPodrobnosti naročila:\nPaket: ${plan ? plan.toUpperCase() : 'Neznano'}\nSkupaj plačano: €${Number(amountPaid || 0).toFixed(2)}\n\nDo nadzorne plošče in urejanja vašega dogodka lahko dostopate na naši spletni strani.\n\nZ lepimi pozdravi,\nVaša ekipa Kliksy`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #4f46e5;">Uspešno naročilo!</h1>
            <p>Hvala za vaš nakup! Vaš dogodek <strong>${eventName || 'brez imena'}</strong> smo uspešno pripravili.</p>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Podrobnosti naročila</h2>
              <p><strong>Paket:</strong> ${plan ? plan.toUpperCase() : 'Neznano'}</p>
              ${extrasHtml}
              <hr style="border: 1px solid #e5e7eb; margin: 15px 0;"/>
              <p style="font-size: 1.1em;"><strong>Skupaj plačano:</strong> €${Number(amountPaid || 0).toFixed(2)}</p>
            </div>
            
            <p>Do nadzorne plošče in urejanja vašega dogodka lahko dostopate na naši spletni strani.</p>
            <br />
            <p>Z lepimi pozdravi,<br />Vaša ekipa Kliksy</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending order summary email:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API routes FIRST
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { plan, discountCode, deliveryMode, standsQuantity, printedQrQuantity, eventId, successUrl, cancelUrl } = req.body;
      
      const plans = {
        basic: 3900, // in cents (39.00 EUR)
        plus: 4900,
        premium: 7900
      };

      let amount = plans[plan as keyof typeof plans] || 4900;

      let upsellAmount = 0;
      if (deliveryMode === 'home_delivery') {
        if (printedQrQuantity === 5) upsellAmount += 1999;
        else if (printedQrQuantity === 10) upsellAmount += 2999;
        else if (printedQrQuantity === 20) upsellAmount += 3999;
        else if (printedQrQuantity === 30) upsellAmount += 4999;
        else upsellAmount += 1999;

        if (standsQuantity === 5) upsellAmount += 499;
        else if (standsQuantity === 10) upsellAmount += 999;
        else if (standsQuantity === 20) upsellAmount += 1299;
        else if (standsQuantity === 30) upsellAmount += 1499;
      } else {
        if (standsQuantity === 5) upsellAmount += 1999;
        else if (standsQuantity === 10) upsellAmount += 2499;
        else if (standsQuantity === 20) upsellAmount += 2999;
        else if (standsQuantity === 30) upsellAmount += 3499;
      }

      if (discountCode?.trim().toLowerCase() === 'test99') {
        amount = upsellAmount;
      } else if (discountCode?.trim().toLowerCase() === 'prvi50') {
        amount = Math.round((amount + upsellAmount) * 0.5);
      } else {
        amount += upsellAmount;
      }

      if (amount === 0) {
        return res.json({ url: successUrl, free: true });
      }

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured on the server. Please add it to your environment variables.");
      }

      const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' as any });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Paket ${plan.toUpperCase()}`,
                description: `Dodatki: ${standsQuantity} stojal${deliveryMode === 'home_delivery' ? `, ${printedQrQuantity} natisnjenih QR kod` : ''}`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: eventId,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { plan, discountCode, deliveryMode, standsQuantity, printedQrQuantity } = req.body;
      
      const plans = {
        basic: 3900, // in cents (39.00 EUR)
        plus: 4900,
        premium: 7900
      };

      let amount = plans[plan as keyof typeof plans] || 4900;

      let upsellAmount = 0;
      if (deliveryMode === 'home_delivery') {
        if (printedQrQuantity === 5) upsellAmount += 1999;
        else if (printedQrQuantity === 10) upsellAmount += 2999;
        else if (printedQrQuantity === 20) upsellAmount += 3999;
        else if (printedQrQuantity === 30) upsellAmount += 4999;
        else upsellAmount += 1999;

        if (standsQuantity === 5) upsellAmount += 499;
        else if (standsQuantity === 10) upsellAmount += 999;
        else if (standsQuantity === 20) upsellAmount += 1299;
        else if (standsQuantity === 30) upsellAmount += 1499;
      } else {
        if (standsQuantity === 5) upsellAmount += 1999;
        else if (standsQuantity === 10) upsellAmount += 2499;
        else if (standsQuantity === 20) upsellAmount += 2999;
        else if (standsQuantity === 30) upsellAmount += 3499;
      }

      if (discountCode?.trim().toLowerCase() === 'test99') {
        amount = upsellAmount;
      } else if (discountCode?.trim().toLowerCase() === 'prvi50') {
        amount = Math.round((amount + upsellAmount) * 0.5);
      } else {
        amount += upsellAmount;
      }

      if (amount === 0) {
        return res.json({ clientSecret: null, free: true });
      }

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured on the server. Please add it to your environment variables.");
      }

      const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' as any });

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "eur",
        payment_method_types: ['card'],
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Catch-all for /api/* to prevent falling through to Vite SPA fallback
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static assets with long cache
    app.use(express.static(distPath, {
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          // Don't cache HTML files
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else {
          // Cache other static assets for 1 year
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));

    // Fallback for SPA routing - never cache index.html
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global error handler caught:", err);
    if (req.url.startsWith('/api')) {
      res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
    } else {
      next(err);
    }
  });
}

startServer();
