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

      if (discountCode?.toLowerCase() === 'test99') {
        amount = 0;
      }

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

      amount += upsellAmount;

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

      if (discountCode?.toLowerCase() === 'test99') {
        amount = 0;
      }

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

      amount += upsellAmount;

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
        automatic_payment_methods: {
          enabled: true,
        },
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
