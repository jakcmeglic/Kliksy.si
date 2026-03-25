import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { plan, discountCode } = req.body;
      
      const plans = {
        basic: 2900, // in cents (29.00 EUR)
        plus: 4900,
        premium: 7900
      };

      let amount = plans[plan as keyof typeof plans] || 4900;

      if (discountCode?.toLowerCase() === 'test99') {
        amount = 0;
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
