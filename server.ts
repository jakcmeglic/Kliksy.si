import { ZipArchive } from 'archiver';
import express from "express";
import Stripe from "stripe";
import path from "path";
import { generateInvoicePdfBuffer } from "./src/pdfService.js";

// Globani handlerji za preprečevanje sesutja aplikacije (pomagajo pri stabilnosti na Hostingerju)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Pricing and Discount Helper
async function calculatePrice(plan: string, discountCode: string | undefined, deliveryMode: string, standsQuantity: number, printedQrQuantity: number, currency: string = 'eur') {
  const isPln = currency === 'pln';

  const plans = isPln ? {
    basic: 16900,
    plus: 21900,
    premium: 34900
  } : {
    basic: 3900, // in cents
    plus: 4900,
    premium: 7900
  };

  const originalPrice = plans[plan as keyof typeof plans] || (isPln ? 21900 : 4900);
  
  let upsellPrice = 0;
  // Always use self_print logic since home_delivery is removed
  if (isPln) {
    if (standsQuantity === 5) upsellPrice += 8900;
    else if (standsQuantity === 10) upsellPrice += 10900;
    else if (standsQuantity === 20) upsellPrice += 12900;
    else if (standsQuantity === 30) upsellPrice += 14900;
  } else {
    if (standsQuantity === 5) upsellPrice += 1999;
    else if (standsQuantity === 10) upsellPrice += 2499;
    else if (standsQuantity === 20) upsellPrice += 2999;
    else if (standsQuantity === 30) upsellPrice += 3499;
  }

  let finalPrice = originalPrice + upsellPrice;

  if (discountCode) {
    const code = discountCode.trim().toLowerCase();
    if (code === 'test99') {
      return upsellPrice;
    }
  }

  return finalPrice;
}

// Main server initialization
import { startCronService } from "./src/cronService.js";

async function startServer() {
  startCronService();
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

  app.get("/api/debug-cebelca-env", (req, res) => {
    res.json({
      hasCebelcaKey: !!process.env.CEBELCA_API_KEY,
      keyLength: process.env.CEBELCA_API_KEY ? process.env.CEBELCA_API_KEY.length : 0
    });
  });

  async function addContactToResend(email: string, firstName: string, lastName: string = '', audienceType: 'buyers' | 'prospects' = 'prospects') {
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = audienceType === 'buyers' 
      ? process.env.RESEND_AUDIENCE_ID_BUYERS 
      : process.env.RESEND_AUDIENCE_ID_PROSPECTS;

    if (!apiKey || !audienceId) return;

    try {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);
      await resend.contacts.create({
        email,
        firstName,
        lastName,
        unsubscribed: false,
        audienceId,
      });
      console.log(`Successfully added/updated contact ${email} in Resend audience ${audienceId}`);

      // If added to buyers, try to remove from prospects
      if (audienceType === 'buyers' && process.env.RESEND_AUDIENCE_ID_PROSPECTS) {
        try {
          await resend.contacts.remove({
            email,
            audienceId: process.env.RESEND_AUDIENCE_ID_PROSPECTS
          });
          console.log(`Successfully removed contact ${email} from prospects audience.`);
        } catch (e: any) {
          // Ignore if not in prospects
        }
      }
    } catch (e: any) {
      console.error(`Failed to add contact to Resend: ${e.message || String(e)}`);
    }
  }

  app.post("/api/send-welcome-email", async (req, res) => {
    const { email, displayName, lang } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const isHr = lang === 'hr';
    const isPl = lang === 'pl';
    const subjectContent = isPl ? "Witamy w Kliksy!" : isHr ? "Dobrodošli u Kliksy!" : "Dobrodošli pri Kliksy!";
    
    const textContent = isPl
      ? `Witamy w Kliksy!\n\nSzanowny ${displayName || 'Kliencie'},\n\nDziękujemy za rejestrację w Kliksy. Bardzo nam miło, że dołączyłeś!\n\nDzięki naszej aplikacji możesz łatwo generować kody QR i zbierać wszystkie zdjęcia w jednym miejscu.\n\nJeśli masz jakiekolwiek pytania, po prostu odpowiedz na tę wiadomość.\n\nPozdrawiamy,\nZespół Kliksy`
      : isHr 
      ? `Dobrodošli u Kliksy!\n\nPoštovani ${displayName || ''},\n\nHvala vam što ste se registrirali u Kliksy. Drago nam je da ste nam se pridružili!\n\nS našom aplikacijom možete jednostavno stvoriti jedinstvene QR kodove za vaše događaje i prikupljati fotografije vaših gostiju na jednom mjestu.\n\nAko imate bilo kakvih pitanja, jednostavno odgovorite na ovaj e-mail.\n\nSrdačan pozdrav,\nKliksy tim`
      : `Dobrodošli pri Kliksy!\n\nPozdravljeni ${displayName || ''},\n\nHvala, ker ste se registrirali pri Kliksy. Veseli smo, da ste se nam pridružili!\n\nZ našo aplikacijo lahko preprosto ustvarite unikatne QR kode za vaše dogodke in zbirate fotografije vaših gostov na enem mestu.\n\nČe imate kakršna koli vprašanja, nam preprosto odgovorite na ta email.\n\nLep pozdrav,\nEkipa Kliksy`;

    const htmlContent = isPl
      ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Witamy w Kliksy!</h1>
          <p>Szanowny ${displayName || 'Kliencie'},</p>
          <p>Dziękujemy za rejestrację w Kliksy. Bardzo nam miło, że dołączyłeś!</p>
          <p>Dzięki naszej aplikacji możesz łatwo generować kody QR i zbierać wszystkie zdjęcia w jednym miejscu.</p>
          <p>Jeśli masz jakiekolwiek pytania, po prostu odpowiedz na tę wiadomość.</p>
          <br />
          <p>Pozdrawiamy,<br />Zespół Kliksy</p>
        </div>
      `
      : isHr
      ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Dobrodošli u Kliksy!</h1>
          <p>Poštovani ${displayName || ''},</p>
          <p>Hvala vam što ste se registrirali u Kliksy. Drago nam je da ste nam se pridružili!</p>
          <p>S našom aplikacijom možete jednostavno stvoriti jedinstvene QR kodove za vaše događaje i prikupljati fotografije vaših gostiju na jednom mjestu.</p>
          <p>Ako imate bilo kakvih pitanja, jednostavno odgovorite na ovaj e-mail.</p>
          <br />
          <p>Srdačan pozdrav,<br />Kliksy tim</p>
        </div>
      `
      : `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Dobrodošli pri Kliksy!</h1>
          <p>Pozdravljeni ${displayName || ''},</p>
          <p>Hvala, ker ste se registrirali pri Kliksy. Veseli smo, da ste se nam pridružili!</p>
          <p>Z našo aplikacijo lahko preprosto ustvarite unikatne QR kode za vaše dogodke in zbirate fotografije vaših gostov na enem mestu.</p>
          <p>Če imate kakršna koli vprašanja, nam preprosto odgovorite na ta email.</p>
          <br />
          <p>Lep pozdrav,<br />Ekipa Kliksy</p>
        </div>
      `;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey && (!smtpHost || !smtpUser || !smtpPass)) {
      console.warn("SMTP and Resend configuration missing. Skipping welcome email.");
      return res.json({ success: false, message: "Email not configured" });
    }

    try {
      if (resendApiKey) {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);
        const { data, error } = await resend.emails.send({
          from: "Kliksy Podpora <info@kliksy.si>",
          replyTo: "info@kliksy.si",
          to: email,
          subject: subjectContent,
          text: textContent,
          html: htmlContent,
        });
        if (error) {
          console.error("Resend API Error:", error);
        }
      } else {
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
          subject: subjectContent,
          text: textContent,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
      }
      
      // Auto-add to audience if configured
      await addContactToResend(email, displayName || '', '', 'prospects');

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/send-event-created-email", async (req, res) => {
    const { email, eventName, lang } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const isHr = lang === 'hr';
    const subjectContent = isHr ? "Vaš događaj na Kliksyju je uspješno stvoren!" : "Vaš dogodek pri Kliksy je uspešno ustvarjen!";
    
    const textContent = isHr
      ? `Vaš događaj je stvoren!\n\nDogađaj: ${eventName || 'bez imena'}\n\nVaš demo događaj je uspješno stvoren. Sada ga možete početi uređivati i dijeliti sa svojim gostima.\n\nSrdačan pozdrav,\nVaš Kliksy tim`
      : `Vaš dogodek je ustvarjen!\n\nDogodek: ${eventName || 'brez imena'}\n\nVaš demo dogodek je uspešno ustvarjen. Zdaj ga lahko pričnete urejati in deliti s svojimi gosti.\n\nLep pozdrav,\nVaša ekipa Kliksy`;

    const htmlContent = isHr
      ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #4f46e5;">Vaš događaj je stvoren!</h1>
          <p>Događaj: <strong>${eventName || 'bez imena'}</strong> smo uspješno pripremili.</p>
          <p>Vaš demo događaj je uspješno stvoren. Sada ga možete početi uređivati i dijeliti sa svojim gostima putem nadzorne ploče.</p>
          <br />
          <p>Srdačan pozdrav,<br />Vaš Kliksy tim</p>
        </div>
      `
      : `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #4f46e5;">Vaš dogodek je ustvarjen!</h1>
          <p>Dogodek: <strong>${eventName || 'brez imena'}</strong> smo uspešno pripravili.</p>
          <p>Vaš demo dogodek je uspešno ustvarjen. Zdaj ga lahko pričnete urejati in deliti s svojimi gosti preko nadzorne plošče.</p>
          <br />
          <p>Z lepimi pozdravi,<br />Vaša ekipa Kliksy</p>
        </div>
      `;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey && (!smtpHost || !smtpUser || !smtpPass)) {
      console.warn("SMTP and Resend configuration missing. Skipping event created email.");
      return res.json({ success: false, message: "Email not configured" });
    }

    try {
      if (resendApiKey) {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);
        const { data, error } = await resend.emails.send({
          from: "Kliksy Podpora <info@kliksy.si>",
          replyTo: "info@kliksy.si",
          to: email,
          subject: subjectContent,
          text: textContent,
          html: htmlContent,
        });
        if (error) {
          console.error("Resend API Error:", error);
        }
      } else {
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
          subject: subjectContent,
          text: textContent,
          html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending event created email:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/send-order-summary", async (req, res) => {
    const { email, eventName, plan, amountPaid, standsQuantity, printedQrQuantity, deliveryMode, lang } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey && (!smtpHost || !smtpUser || !smtpPass)) {
      console.warn("SMTP and Resend configuration missing. Skipping order summary email.");
      return res.json({ success: false, message: "Email not configured" });
    }

    try {
      const isHr = lang === 'hr';
      const hasExtras = standsQuantity > 0;

    
    const subjectContent = isHr ? "Sažetak vaše narudžbe na Kliksyju" : "Povzetek vašega naročila pri Kliksy";
    
    let extrasHtml = '';
    if (hasExtras) {
      if (isHr) {
        extrasHtml = `
          <h3>Dodaci</h3>
          <ul>
            ${standsQuantity > 0 ? `<li>Podmetači za stol: ${standsQuantity} komada</li>` : ''}
          </ul>
        `;
      } else {
        extrasHtml = `
          <h3>Dodatki</h3>
          <ul>
            ${standsQuantity > 0 ? `<li>Podstavki za mizo: ${standsQuantity} kosov</li>` : ''}
          </ul>
        `;
      }
    }
    
    const textContent = isHr
      ? `Uspješna narudžba!\n\nHvala na kupnji! Vaš događaj ${eventName || 'bez imena'} smo uspješno pripremili.\n\nPojedinosti narudžbe:\nPaket: ${plan ? plan.toUpperCase() : 'Nepoznato'}\nUkupno plaćeno: €${Number(amountPaid || 0).toFixed(2)}\n\nNadzornoj ploči i uređivanju vašeg događaja možete pristupiti na našoj web stranici.\n\nSrdačan pozdrav,\nVaš Kliksy tim`
      : `Uspešno naročilo!\n\nHvala za vaš nakup! Vaš dogodek ${eventName || 'brez imena'} smo uspešno pripravili.\n\nPodrobnosti naročila:\nPaket: ${plan ? plan.toUpperCase() : 'Neznano'}\nSkupaj plačano: €${Number(amountPaid || 0).toFixed(2)}\n\nDo nadzorne plošče in urejanja vašega dogodka lahko dostopate na naši spletni strani.\n\nZ lepimi pozdravi,\nVaša ekipa Kliksy`;

    const htmlContent = isHr
      ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #4f46e5;">Uspješna narudžba!</h1>
          <p>Hvala na kupnji! Vaš događaj <strong>${eventName || 'bez imena'}</strong> smo uspješno pripremili.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Pojedinosti narudžbe</h2>
            <p><strong>Paket:</strong> ${plan ? plan.toUpperCase() : 'Nepoznato'}</p>
            ${extrasHtml}
            <hr style="border: 1px solid #e5e7eb; margin: 15px 0;"/>
            <p style="font-size: 1.1em;"><strong>Ukupno plaćeno:</strong> €${Number(amountPaid || 0).toFixed(2)}</p>
          </div>
          
          <p>Nadzornoj ploči i uređivanju vašeg događaja možete pristupiti na našoj web stranici.</p>
          <br />
          <p>Srdačan pozdrav,<br />Vaš Kliksy tim</p>
        </div>
      `
      : `
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
      `;

      if (resendApiKey) {
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);
        const { data, error } = await resend.emails.send({
          from: "Kliksy Podpora <info@kliksy.si>",
          replyTo: "info@kliksy.si",
          to: email,
          bcc: "info@kliksy.si",
          subject: subjectContent,
          text: textContent,
          html: htmlContent,
        });

        // Send explicit notification to admin
        await resend.emails.send({
          from: "Kliksy Sistem <info@kliksy.si>",
          to: "info@kliksy.si",
          subject: `NOVO NAROČILO: ${eventName || 'Neznano'} - ${Number(amountPaid || 0).toFixed(2)}€`,
          text: `Dobili ste novo naročilo!\nEmail: ${email}\nDogodek: ${eventName || 'Neznano'}\nPaket: ${plan}\nDodatki: ${standsQuantity > 0 ? standsQuantity + ' podstavkov' : 'Brez'}\nZnesek: ${Number(amountPaid || 0).toFixed(2)}€`,
        }).catch(err => console.error("Admin notif error:", err));

        if (error) {
          console.error("Resend API Error:", error);
        }
      } else {
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
          bcc: "info@kliksy.si",
          subject: subjectContent,
          text: textContent,
          html: htmlContent,
        };

        const adminMailOptions = {
          from: `"Kliksy Sistem" <${smtpUser}>`,
          to: "info@kliksy.si",
          subject: `NOVO NAROČILO: ${eventName || 'Neznano'} - ${Number(amountPaid || 0).toFixed(2)}€`,
          text: `Dobili ste novo naročilo!\nEmail: ${email}\nDogodek: ${eventName || 'Neznano'}\nPaket: ${plan}\nDodatki: ${standsQuantity > 0 ? standsQuantity + ' podstavkov' : 'Brez'}\nZnesek: ${Number(amountPaid || 0).toFixed(2)}€`,
        };

        await transporter.sendMail(mailOptions);
        await transporter.sendMail(adminMailOptions).catch(err => console.error("Admin notif error:", err));
      }
      
      // Auto-add to audience if configured
      await addContactToResend(email, '', '', 'buyers');

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending order summary email:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/download-invoice-pdf", async (req, res) => {
    try {
      const { invoiceData } = req.body;
      if (!invoiceData) {
        return res.status(400).json({ success: false, message: "Manjkajo podatki o računu." });
      }

      const pdfBuffer = await generateInvoicePdfBuffer(invoiceData);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Racun_${invoiceData.invoiceNumber}.pdf"`);
      res.send(Buffer.from(pdfBuffer));
    } catch (error: any) {
      console.error("Error creating invoice PDF:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/send-invoice-pdf", async (req, res) => {
    try {
      const { invoiceData, sendEmail } = req.body;
      if (!invoiceData || !invoiceData.email) {
        return res.status(400).json({ success: false, message: "Manjkajo podatki o računu." });
      }

      // Generate PDF to ensure the logic doesn't crash on this data
      const pdfBuffer = await generateInvoicePdfBuffer(invoiceData);

      if (sendEmail === false) {
        return res.json({ success: true, message: "Račun uspešno zgeneriran (ne poslan)." });
      }

      // Send email using Resend
      const { Resend } = await import('resend');
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (!resendApiKey) {
         console.warn("Resend API ključ manjka. Preskakujem pošiljanje emaila.");
         return res.json({ success: true, message: "PDF zgeneriran, vendar email ni poslan (ni ključa)." });
      }

      const resend = new Resend(resendApiKey);
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <p>Pozdravljeni,</p>
          <p>V priponki vam pošiljamo račun za naročeni Kliksy paket (${invoiceData.plan}).</p>
          <br />
          <p>Hvala za zaupanje in prijetno uporabo aplikacije!</p>
          <p>Vaša Kliksy ekipa</p>
        </div>
      `;

      await resend.emails.send({
        from: 'info@kliksy.si',
        replyTo: 'info@kliksy.si',
        to: invoiceData.email,
        subject: `Račun ${invoiceData.invoiceNumber} - Kliksy`,
        html: emailHtml,
        attachments: [
          {
            filename: `Racun_${invoiceData.invoiceNumber}.pdf`,
            content: pdfBuffer,
          }
        ]
      });

      res.json({ success: true, message: "Račun uspešno zgeneriran in poslan!" });
    } catch (error: any) {
      console.error("Error creating/sending invoice:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/create-cebelca-invoice", async (req, res) => {
    const { eventData, totalAmount } = req.body;
    
    // For safety, the API token should be stored in process.env.CEBELCA_API_KEY
    const cebelcaApiKey = process.env.CEBELCA_API_KEY;

    if (!cebelcaApiKey) {
      return res.status(400).json({ 
        success: false, 
        message: `Manjka Čebelca API ključ v nastavitvah. process.env.CEBELCA_API_KEY is ${typeof cebelcaApiKey}` 
      });
    }

    try {
      // 1. Create array of items for the invoice
      const items = [];
      const planName = eventData.plan ? eventData.plan.toUpperCase() : 'Neznano';
      
      // We push the base plan
      items.push({
        title: `Paket ${planName}`,
        qty: 1,
        mu: "kos",
        price: totalAmount, // For simplicity we put the whole total on the first line for now, or split it up if needed.
        vat: 22, // Set to 0 if not tax-liable!
        discount: 0
      });

      // API request to Cebelca (Standard Draft JSON API - Document creation)
      const invoicePayload: any[] = [
        {
          _r: "invoice-sent",
          _m: "insert-into",
          title: "Račun za spletno storitev Kliksy",
          date_sent: new Date().toISOString().split('T')[0],
          date_served: new Date().toISOString().split('T')[0],
          date_to_pay: new Date().toISOString().split('T')[0], // Paid immediately
          partner_name: eventData.isCompanyInvoice ? eventData.companyName : (eventData.deliveryName ? `${eventData.deliveryName} ${eventData.deliverySurname}` : eventData.email),
          partner_address: eventData.isCompanyInvoice ? eventData.companyAddress : (eventData.deliveryAddress || ""),
          partner_postal: eventData.isCompanyInvoice ? "" : (eventData.deliveryPostcode || ""),
          partner_city: eventData.isCompanyInvoice ? "" : (eventData.deliveryCity || ""),
          partner_vat: eventData.isCompanyInvoice ? eventData.companyTaxId : "",
          payment_method: "K", // K = kartica
          notes: "Plačano prek spleta (Stripe)."
        }
      ];

      // Add lines
      items.forEach(item => {
        invoicePayload.push({
          _r: "invoice-sent-b",
          _m: "insert-into",
          title: item.title,
          qty: item.qty as any,
          mu: item.mu,
          price: item.price as any,
          vat: item.vat as any,
          discount: item.discount as any
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
        // Cebelca API usually returns 400 for structure issues depending on user's exact account defaults
        console.warn("Cebelca responded with non-ok:", response.status, resultText);
        if (response.status === 401) {
             throw new Error("Neveljaven API ključ. Preverite ga v nastavitvah.");
        }
        // Throw general error for other cases
        // throw new Error("Napaka pri komunikaciji s Čebelco: " + response.status + " " + resultText);
      }

      res.json({ success: true, message: "Račun uspešno obdelan!" });
    } catch (error: any) {
      console.error("Cebelca Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/trigger-cron", async (req, res) => {
    try {
      // Temporarily import dynamically to avoid top-level issues if any
      const { checkAbandonedProfiles } = await import("./src/cronService.js");
      await checkAbandonedProfiles();
      res.json({ success: true, message: "Cron check completed" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API routes FIRST
  app.post("/api/create-upgrade-session", async (req, res) => {
    try {
      const { currentPlan, newPlan, eventId, successUrl, cancelUrl } = req.body;

      const plans = {
        osnovni: 3900,
        basic: 3900,
        plus: 4900,
        premium: 7900
      };

      const oldPrice = plans[currentPlan as keyof typeof plans];
      const newPrice = plans[newPlan as keyof typeof plans];

      if (!oldPrice || !newPrice || newPrice <= oldPrice) {
        return res.status(400).json({ error: "Invalid upgrade request" });
      }

      const amount = newPrice - oldPrice;

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured limit.");
      }

      const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' as any });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Nadgradnja na ${newPlan.toUpperCase()}`,
                description: `Nadgradnja paketa iz ${currentPlan.toUpperCase()} na ${newPlan.toUpperCase()}`,
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
        metadata: {
          upgradeToPlan: newPlan,
          isUpgrade: 'true'
        }
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe upgrade error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { plan, discountCode, standsQuantity, eventId, successUrl, cancelUrl, currency = 'eur' } = req.body;
      
      const amount = await calculatePrice(plan, discountCode, 'self_print', standsQuantity, 0, currency);

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
              currency: currency,
              product_data: {
                name: `Paket ${plan.toUpperCase()}`,
                description: `Dodatki: ${standsQuantity} stojal`,
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
      const { plan, discountCode, standsQuantity, currency = 'eur' } = req.body;
      
      const amount = await calculatePrice(plan, discountCode, 'self_print', standsQuantity, 0, currency);

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
        currency: currency,
        payment_method_types: ['card'],
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Simple proxy to bypass CORS for image downloading (e.g. ZIP packing)
  
  app.post("/api/download-zip", async (req, res) => {
    try {
      const { photos, eventName } = req.body;
      let parsedPhotos = [];
      if (typeof photos === 'string') {
        parsedPhotos = JSON.parse(photos);
      } else {
        parsedPhotos = parsedPhotos.concat(photos || []);
      }
      
      if (!parsedPhotos || !parsedPhotos.length) {
        return res.status(400).send("No photos provided");
      }

      const safeEventName = (eventName || 'Dogodek').replace(/[^a-zA-Z0-9_-]/g, '_');
      
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="Kliksy-${safeEventName}.zip"`);

      const archive = new ZipArchive({
        zlib: { level: 0 } // No compression for speed and low CPU
      });

      archive.on('error', (err) => {
        console.error("Archiver error:", err);
        if (!res.headersSent) {
          res.status(500).send({error: err.message});
        } else {
          res.end();
        }
      });

      archive.pipe(res);

      let fetchedCount = 0;
      
      const { Readable } = require('stream');
      
      let clientDisconnected = false;
      req.on('close', () => { clientDisconnected = true; });
      
      for (let i = 0; i < parsedPhotos.length; i++) {
        if (clientDisconnected) break;
        
        const photo = parsedPhotos[i];
        try {
          if (photo && photo.url && photo.url.startsWith('http')) {
            const response = await fetch(photo.url);
            if (response.ok && response.body) {
              const contentType = response.headers.get('content-type') || '';
              let extension = photo.type === 'video' ? 'mp4' : 'jpg';
              if (contentType && !contentType.includes('octet-stream')) {
                const split = contentType.split('/');
                if (split.length > 1) {
                  extension = split[1];
                  if (extension === 'jpeg') extension = 'jpg';
                }
              }
              const prefix = photo.type === 'video' ? 'video' : 'photo';
              const fileName = `${prefix}-${i + 1}.${extension}`;
              
              await new Promise((resolve) => {
                 const nodeStream = Readable.fromWeb(response.body);
                 nodeStream.on('end', resolve);
                 nodeStream.on('error', resolve);
                 
                 archive.append(nodeStream, { name: fileName });
              });
              fetchedCount++;
            }
          }
        } catch (e) {
          console.error(`Failed to fetch photo ${i} for zip:`, e.message);
        }
      }
      
      if (!clientDisconnected) {
        await archive.finalize();
      }
    } catch (err) {
      console.error("Error in download-zip endpoint:", err);
      if (!res.headersSent) {
        res.status(500).send("Error generating zip");
      }
    }
  });

  app.get("/api/proxy-image", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url || !url.includes("firebasestorage.googleapis.com")) {
        res.status(400).send("Invalid or missing url");
        return;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
        return;
      }
      
      res.set('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        res.set('Content-Length', contentLength);
      }
      
      if (response.body) {
        const readable = require('stream').Readable.fromWeb(response.body);
        readable.pipe(res);
      } else {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.send(buffer);
      }
    } catch (error: any) {
      console.error("Proxy error:", error);
      res.status(500).send("Proxy error: " + error.message);
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
