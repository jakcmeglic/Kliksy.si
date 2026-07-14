var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/cronService.ts
var cronService_exports = {};
__export(cronService_exports, {
  checkAbandonedProfiles: () => checkAbandonedProfiles,
  initFirebase: () => initFirebase,
  sendSevenDaysFollowUpEmail: () => sendSevenDaysFollowUpEmail,
  sendTwoDaysFollowUpEmail: () => sendTwoDaysFollowUpEmail,
  startCronService: () => startCronService
});
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, query, where } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";
function initFirebase() {
  if (db) return db;
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(app, config.firestoreDatabaseId);
  }
  return db;
}
function startCronService() {
  console.log("--- startCronService triggered ---");
  initFirebase();
  if (!db) {
    console.log("Skipping cron service: Firebase not configured. Did not detect config or initialization failed.");
    return;
  }
  console.log("Firebase initialized. Setting up cron intervals...");
  setInterval(checkAbandonedProfiles, 5 * 60 * 1e3);
  setTimeout(() => {
    console.log("Running immediate cron check after startup...");
    checkAbandonedProfiles();
  }, 10 * 1e3);
}
async function checkAbandonedProfiles() {
  if (!db) return;
  try {
    const now = Date.now();
    const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1e3;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1e3;
    const cutoffDate = (/* @__PURE__ */ new Date("2026-05-29T00:00:00Z")).getTime();
    const usersSnap = await getDocs(collection(db, "users"));
    const users = usersSnap.docs.map((d) => ({ id: d.id, ref: d.ref, ...d.data() }));
    const candidates2Days = users.filter((u) => {
      let createdTime = 0;
      if (u.createdAt) {
        if (typeof u.createdAt.toMillis === "function") createdTime = u.createdAt.toMillis();
        else if (u.createdAt.seconds) createdTime = u.createdAt.seconds * 1e3;
        else if (typeof u.createdAt === "number") createdTime = u.createdAt;
        else createdTime = new Date(u.createdAt).getTime();
      }
      if (createdTime >= cutoffDate) {
        if (u.abandonedEmailSent) return false;
        if (!createdTime) return false;
        return createdTime <= twoDaysAgo && createdTime > sevenDaysAgo && createdTime >= cutoffDate;
      }
      return false;
    });
    for (const user of candidates2Days) {
      if (!user.email) continue;
      const eventsSnap = await getDocs(query(
        collection(db, "events"),
        where("ownerId", "==", user.id),
        where("paymentStatus", "==", "paid")
      ));
      if (eventsSnap.empty) {
        await sendTwoDaysFollowUpEmail(user.email);
        console.log(`Sent 2-day abandoned follow-up to ${user.email}`);
      }
      await updateDoc(user.ref, { abandonedEmailSent: true }).catch((e) => {
        console.error("Failed to update abandonedEmailSent flag:", e);
      });
    }
    const candidates7Days = users.filter((u) => {
      let createdTime = 0;
      if (u.createdAt) {
        if (typeof u.createdAt.toMillis === "function") createdTime = u.createdAt.toMillis();
        else if (u.createdAt.seconds) createdTime = u.createdAt.seconds * 1e3;
        else if (typeof u.createdAt === "number") createdTime = u.createdAt;
        else createdTime = new Date(u.createdAt).getTime();
      }
      if (createdTime >= cutoffDate) {
        if (u.abandonedTwoDaysEmailSent) return false;
        if (!createdTime) return false;
        return createdTime <= sevenDaysAgo && createdTime >= cutoffDate;
      }
      return false;
    });
    for (const user of candidates7Days) {
      if (!user.email) continue;
      const eventsSnap = await getDocs(query(
        collection(db, "events"),
        where("ownerId", "==", user.id),
        where("paymentStatus", "==", "paid")
      ));
      if (eventsSnap.empty) {
        await sendSevenDaysFollowUpEmail(user.email);
        console.log(`Sent 7-day abandoned follow-up to ${user.email}`);
      }
      await updateDoc(user.ref, { abandonedTwoDaysEmailSent: true }).catch((e) => {
        console.error("Failed to update abandonedTwoDaysEmailSent flag:", e);
      });
    }
  } catch (error) {
    console.error("Error in abandoned profile cron:", error);
  }
}
async function sendTwoDaysFollowUpEmail(email) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("No Resend API key to send follow up email.");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(resendApiKey);
  await resend.emails.send({
    from: "Kliksy <info@kliksy.si>",
    replyTo: "info@kliksy.si",
    to: email,
    subject: "Ali ste pozabili kaj dokon\u010Dati na Kliksy? \u{1F4F8}",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <p>Pozdravljeni!</p>
        <p>Opazili smo, da se \u017Ee nekaj \u010Dasa niste prijavili v svoj Kliksy ra\u010Dun in ustvarili svoje galerije za va\u0161 poseben dogodek.</p>
        <p>Zbiranje spominov \u0161e nikoli ni bilo tako enostavno. \u010Ce potrebujete kakr\u0161nokoli pomo\u010D, nas enostavno kontaktirajte.</p>
        <p>Pojdite nazaj na <a href="https://kliksy.si" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Kliksy</a> in nadaljujte, kjer ste ostali!</p>
        <br />
        <p>Va\u0161a Kliksy ekipa</p>
      </div>
    `
  });
}
async function sendSevenDaysFollowUpEmail(email) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("No Resend API key to send follow up email.");
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(resendApiKey);
  await resend.emails.send({
    from: "Kliksy <info@kliksy.si>",
    replyTo: "info@kliksy.si",
    to: email,
    subject: "\u0160e vedno ste pravo\u010Dasni! Re\u0161ite svoje spomine z nami \u23F1\uFE0F",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <p>\u017Divjo ponovno!</p>
        <p>Minil je \u017Ee en teden, odkar ste se registrirali na Kliksy. Ne dovolite, da va\u0161i spomini ostanejo skriti na telefonih va\u0161ih gostov!</p>
        <p>Ustvarjanje galerije vzame le nekaj trenutkov, va\u0161i gosti pa bodo z veseljem delili svoje fotografije preko QR kode \u2013 brez nalaganja aplikacije.</p>
        <p>Preverite, kako enostavno je, in dokon\u010Dajte svojo prvo galerijo na <a href="https://kliksy.si" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Kliksy</a>.</p>
        <p>\u010Ce imate dodatna vpra\u0161anja, z veseljem prisluhnemo.</p>
        <br />
        <p>Va\u0161a Kliksy ekipa</p>
      </div>
    `
  });
}
var db;
var init_cronService = __esm({
  "src/cronService.ts"() {
    db = null;
  }
});

// server.ts
import { ZipArchive } from "archiver";
import express from "express";
import Stripe from "stripe";
import path2 from "path";

// src/pdfService.ts
import PDFDocument from "pdfkit";
function generateInvoicePdfBuffer(invoiceData) {
  return new Promise((resolve, reject) => {
    try {
      const doc2 = new PDFDocument({ margin: 50 });
      const buffers = [];
      doc2.on("data", buffers.push.bind(buffers));
      doc2.on("end", () => {
        resolve(Buffer.concat(buffers));
      });
      const formattedDate = new Date(invoiceData.date).toLocaleDateString("sl-SI");
      doc2.fontSize(10);
      doc2.font("Helvetica-Bold").text(`Ra\u010Dun \u0161t.: ${invoiceData.invoiceNumber}`, 50, 50);
      doc2.font("Helvetica").text(`Datum izdaje: Tr\u017Ei\u010D, ${formattedDate}`, 50, 65);
      doc2.text(`Datum opr. storitve: ${formattedDate}`, 50, 80);
      doc2.text(`Rok pla\u010Dila: Pla\u010Dano ob nakupu`, 50, 95);
      doc2.font("Helvetica-Bold").text(`Spletna prodaja Jaka Meglic s.p.`, 300, 50, { align: "right" });
      doc2.font("Helvetica").text(`Zelenica 4`, 300, 65, { align: "right" });
      doc2.text(`4290 Tr\u017Ei\u010D`, 300, 80, { align: "right" });
      doc2.text(`Dav\u010Dna \u0161t.: 76794784`, 300, 95, { align: "right" });
      doc2.text(`IBAN \u0161t.: SI56040010103769716`, 300, 110, { align: "right" });
      doc2.text(`Mati\u010Dna \u0161t.: 9391207000`, 300, 125, { align: "right" });
      doc2.moveTo(50, 160).lineTo(550, 160).strokeColor("#e5e7eb").lineWidth(1).stroke();
      doc2.moveDown(4);
      doc2.font("Helvetica-Bold").text(invoiceData.customerName, 50, 180);
      doc2.font("Helvetica").text(invoiceData.customerAddress, 50, 195);
      if (invoiceData.isCompanyInvoice && invoiceData.customerTaxId) {
        doc2.text(`ID za DDV / Dav\u010Dna \u0161t.: ${invoiceData.customerTaxId}`, 50, 210);
      } else {
        doc2.text(invoiceData.email, 50, 210);
      }
      doc2.moveTo(50, 250).lineTo(550, 250).strokeColor("#e5e7eb").stroke();
      const tableTop = 270;
      doc2.font("Helvetica-Bold");
      doc2.text("Opis", 50, tableTop);
      doc2.text("Koli\u010Dina", 350, tableTop, { width: 50, align: "right" });
      doc2.text("Enota", 420, tableTop, { width: 50, align: "right" });
      doc2.text("Znesek", 480, tableTop, { width: 70, align: "right" });
      doc2.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor("#000000").stroke();
      const rowTop = tableTop + 30;
      doc2.font("Helvetica");
      doc2.text(`Spletna platforma Kliksy paket: ${invoiceData.plan}`, 50, rowTop);
      doc2.text(`1`, 350, rowTop, { width: 50, align: "right" });
      doc2.text(`${invoiceData.total.toFixed(2)} \u20AC`, 420, rowTop, { width: 50, align: "right" });
      doc2.text(`${invoiceData.total.toFixed(2)} \u20AC`, 480, rowTop, { width: 70, align: "right" });
      doc2.moveTo(350, rowTop + 20).lineTo(550, rowTop + 20).strokeColor("#e5e7eb").stroke();
      doc2.font("Helvetica-Bold");
      doc2.text(`Skupaj`, 400, rowTop + 30);
      doc2.text(`${invoiceData.total.toFixed(2)} \u20AC`, 480, rowTop + 30, { width: 70, align: "right" });
      doc2.moveTo(350, rowTop + 50).lineTo(550, rowTop + 50).strokeColor("#000000").stroke();
      doc2.text(`Za pla\u010Dilo`, 400, rowTop + 60);
      doc2.text(`${invoiceData.total.toFixed(2)} \u20AC`, 480, rowTop + 60, { width: 70, align: "right" });
      doc2.moveDown(4);
      doc2.font("Helvetica");
      doc2.text(`Ra\u010Dun je bil v celoti pla\u010Dan preko spleta ob nakupu.`, 50, rowTop + 120);
      doc2.moveDown(1);
      doc2.text(`DDV ni obra\u010Dunan na podlagi 1. odstavka 94. \u010Dlena Zakona o davku na dodano vrednost.`, 50, doc2.y);
      doc2.moveDown(2);
      doc2.text(`Elektronski podpis: Jaka Megli\u010D s.p.`, 350, doc2.y, { align: "right" });
      doc2.end();
    } catch (err) {
      reject(err);
    }
  });
}

// server.ts
init_cronService();
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
async function calculatePrice(plan, discountCode, deliveryMode, standsQuantity, printedQrQuantity, currency = "eur") {
  const isPln = currency === "pln";
  const plans = isPln ? {
    basic: 16900,
    plus: 21900,
    premium: 34900
  } : {
    basic: 3900,
    // in cents
    plus: 4900,
    premium: 7900
  };
  const originalPrice = plans[plan] || (isPln ? 21900 : 4900);
  let upsellPrice = 0;
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
    if (code === "test99") {
      return upsellPrice;
    }
  }
  return finalPrice;
}
async function startServer() {
  startCronService();
  const app = express();
  const PORT = Number(process.env.PORT) || 3e3;
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
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
  async function addContactToResend(email, firstName, lastName = "", audienceType = "prospects") {
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = audienceType === "buyers" ? process.env.RESEND_AUDIENCE_ID_BUYERS : process.env.RESEND_AUDIENCE_ID_PROSPECTS;
    if (!apiKey || !audienceId) return;
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.contacts.create({
        email,
        firstName,
        lastName,
        unsubscribed: false,
        audienceId
      });
      console.log(`Successfully added/updated contact ${email} in Resend audience ${audienceId}`);
      if (audienceType === "buyers" && process.env.RESEND_AUDIENCE_ID_PROSPECTS) {
        try {
          await resend.contacts.remove({
            email,
            audienceId: process.env.RESEND_AUDIENCE_ID_PROSPECTS
          });
          console.log(`Successfully removed contact ${email} from prospects audience.`);
        } catch (e) {
        }
      }
    } catch (e) {
      console.error(`Failed to add contact to Resend: ${e.message || String(e)}`);
    }
  }
  app.post("/api/send-welcome-email", async (req, res) => {
    const { email, displayName, lang } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const isHr = lang === "hr";
    const isPl = lang === "pl";
    const subjectContent = isPl ? "Witamy w Kliksy!" : isHr ? "Dobrodo\u0161li u Kliksy!" : "Dobrodo\u0161li pri Kliksy!";
    const textContent = isPl ? `Witamy w Kliksy!

Szanowny ${displayName || "Kliencie"},

Dzi\u0119kujemy za rejestracj\u0119 w Kliksy. Bardzo nam mi\u0142o, \u017Ce do\u0142\u0105czy\u0142e\u015B!

Dzi\u0119ki naszej aplikacji mo\u017Cesz \u0142atwo generowa\u0107 kody QR i zbiera\u0107 wszystkie zdj\u0119cia w jednym miejscu.

Je\u015Bli masz jakiekolwiek pytania, po prostu odpowiedz na t\u0119 wiadomo\u015B\u0107.

Pozdrawiamy,
Zesp\xF3\u0142 Kliksy` : isHr ? `Dobrodo\u0161li u Kliksy!

Po\u0161tovani ${displayName || ""},

Hvala vam \u0161to ste se registrirali u Kliksy. Drago nam je da ste nam se pridru\u017Eili!

S na\u0161om aplikacijom mo\u017Eete jednostavno stvoriti jedinstvene QR kodove za va\u0161e doga\u0111aje i prikupljati fotografije va\u0161ih gostiju na jednom mjestu.

Ako imate bilo kakvih pitanja, jednostavno odgovorite na ovaj e-mail.

Srda\u010Dan pozdrav,
Kliksy tim` : `Dobrodo\u0161li pri Kliksy!

Pozdravljeni ${displayName || ""},

Hvala, ker ste se registrirali pri Kliksy. Veseli smo, da ste se nam pridru\u017Eili!

Z na\u0161o aplikacijo lahko preprosto ustvarite unikatne QR kode za va\u0161e dogodke in zbirate fotografije va\u0161ih gostov na enem mestu.

\u010Ce imate kakr\u0161na koli vpra\u0161anja, nam preprosto odgovorite na ta email.

Lep pozdrav,
Ekipa Kliksy`;
    const htmlContent = isPl ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Witamy w Kliksy!</h1>
          <p>Szanowny ${displayName || "Kliencie"},</p>
          <p>Dzi\u0119kujemy za rejestracj\u0119 w Kliksy. Bardzo nam mi\u0142o, \u017Ce do\u0142\u0105czy\u0142e\u015B!</p>
          <p>Dzi\u0119ki naszej aplikacji mo\u017Cesz \u0142atwo generowa\u0107 kody QR i zbiera\u0107 wszystkie zdj\u0119cia w jednym miejscu.</p>
          <p>Je\u015Bli masz jakiekolwiek pytania, po prostu odpowiedz na t\u0119 wiadomo\u015B\u0107.</p>
          <br />
          <p>Pozdrawiamy,<br />Zesp\xF3\u0142 Kliksy</p>
        </div>
      ` : isHr ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Dobrodo\u0161li u Kliksy!</h1>
          <p>Po\u0161tovani ${displayName || ""},</p>
          <p>Hvala vam \u0161to ste se registrirali u Kliksy. Drago nam je da ste nam se pridru\u017Eili!</p>
          <p>S na\u0161om aplikacijom mo\u017Eete jednostavno stvoriti jedinstvene QR kodove za va\u0161e doga\u0111aje i prikupljati fotografije va\u0161ih gostiju na jednom mjestu.</p>
          <p>Ako imate bilo kakvih pitanja, jednostavno odgovorite na ovaj e-mail.</p>
          <br />
          <p>Srda\u010Dan pozdrav,<br />Kliksy tim</p>
        </div>
      ` : `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">Dobrodo\u0161li pri Kliksy!</h1>
          <p>Pozdravljeni ${displayName || ""},</p>
          <p>Hvala, ker ste se registrirali pri Kliksy. Veseli smo, da ste se nam pridru\u017Eili!</p>
          <p>Z na\u0161o aplikacijo lahko preprosto ustvarite unikatne QR kode za va\u0161e dogodke in zbirate fotografije va\u0161ih gostov na enem mestu.</p>
          <p>\u010Ce imate kakr\u0161na koli vpra\u0161anja, nam preprosto odgovorite na ta email.</p>
          <br />
          <p>Lep pozdrav,<br />Ekipa Kliksy</p>
        </div>
      `;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : void 0;
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey && (!smtpHost || !smtpUser || !smtpPass)) {
      console.warn("SMTP and Resend configuration missing. Skipping welcome email.");
      return res.json({ success: false, message: "Email not configured" });
    }
    try {
      if (resendApiKey) {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);
        const { data, error } = await resend.emails.send({
          from: "Kliksy Podpora <info@kliksy.si>",
          replyTo: "info@kliksy.si",
          to: email,
          subject: subjectContent,
          text: textContent,
          html: htmlContent
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
            pass: smtpPass
          }
        });
        const mailOptions = {
          from: `"Kliksy" <${smtpUser}>`,
          replyTo: `"Kliksy Podpora" <info@kliksy.si>`,
          to: email,
          subject: subjectContent,
          text: textContent,
          html: htmlContent
        };
        await transporter.sendMail(mailOptions);
      }
      await addContactToResend(email, displayName || "", "", "prospects");
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/send-event-created-email", async (req, res) => {
    const { email, eventName, lang } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const isHr = lang === "hr";
    const subjectContent = isHr ? "Va\u0161 doga\u0111aj na Kliksyju je uspje\u0161no stvoren!" : "Va\u0161 dogodek pri Kliksy je uspe\u0161no ustvarjen!";
    const textContent = isHr ? `Va\u0161 doga\u0111aj je stvoren!

Doga\u0111aj: ${eventName || "bez imena"}

Va\u0161 demo doga\u0111aj je uspje\u0161no stvoren. Sada ga mo\u017Eete po\u010Deti ure\u0111ivati i dijeliti sa svojim gostima.

Srda\u010Dan pozdrav,
Va\u0161 Kliksy tim` : `Va\u0161 dogodek je ustvarjen!

Dogodek: ${eventName || "brez imena"}

Va\u0161 demo dogodek je uspe\u0161no ustvarjen. Zdaj ga lahko pri\u010Dnete urejati in deliti s svojimi gosti.

Lep pozdrav,
Va\u0161a ekipa Kliksy`;
    const htmlContent = isHr ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #4f46e5;">Va\u0161 doga\u0111aj je stvoren!</h1>
          <p>Doga\u0111aj: <strong>${eventName || "bez imena"}</strong> smo uspje\u0161no pripremili.</p>
          <p>Va\u0161 demo doga\u0111aj je uspje\u0161no stvoren. Sada ga mo\u017Eete po\u010Deti ure\u0111ivati i dijeliti sa svojim gostima putem nadzorne plo\u010De.</p>
          <br />
          <p>Srda\u010Dan pozdrav,<br />Va\u0161 Kliksy tim</p>
        </div>
      ` : `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #4f46e5;">Va\u0161 dogodek je ustvarjen!</h1>
          <p>Dogodek: <strong>${eventName || "brez imena"}</strong> smo uspe\u0161no pripravili.</p>
          <p>Va\u0161 demo dogodek je uspe\u0161no ustvarjen. Zdaj ga lahko pri\u010Dnete urejati in deliti s svojimi gosti preko nadzorne plo\u0161\u010De.</p>
          <br />
          <p>Z lepimi pozdravi,<br />Va\u0161a ekipa Kliksy</p>
        </div>
      `;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : void 0;
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey && (!smtpHost || !smtpUser || !smtpPass)) {
      console.warn("SMTP and Resend configuration missing. Skipping event created email.");
      return res.json({ success: false, message: "Email not configured" });
    }
    try {
      if (resendApiKey) {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);
        const { data, error } = await resend.emails.send({
          from: "Kliksy Podpora <info@kliksy.si>",
          replyTo: "info@kliksy.si",
          to: email,
          subject: subjectContent,
          text: textContent,
          html: htmlContent
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
            pass: smtpPass
          }
        });
        const mailOptions = {
          from: `"Kliksy" <${smtpUser}>`,
          replyTo: `"Kliksy Podpora" <info@kliksy.si>`,
          to: email,
          subject: subjectContent,
          text: textContent,
          html: htmlContent
        };
        await transporter.sendMail(mailOptions);
      }
      res.json({ success: true });
    } catch (error) {
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
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : void 0;
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey && (!smtpHost || !smtpUser || !smtpPass)) {
      console.warn("SMTP and Resend configuration missing. Skipping order summary email.");
      return res.json({ success: false, message: "Email not configured" });
    }
    try {
      const isHr = lang === "hr";
      const hasExtras = standsQuantity > 0;
      const subjectContent = isHr ? "Sa\u017Eetak va\u0161e narud\u017Ebe na Kliksyju" : "Povzetek va\u0161ega naro\u010Dila pri Kliksy";
      let extrasHtml = "";
      if (hasExtras) {
        if (isHr) {
          extrasHtml = `
          <h3>Dodaci</h3>
          <ul>
            ${standsQuantity > 0 ? `<li>Podmeta\u010Di za stol: ${standsQuantity} komada</li>` : ""}
          </ul>
        `;
        } else {
          extrasHtml = `
          <h3>Dodatki</h3>
          <ul>
            ${standsQuantity > 0 ? `<li>Podstavki za mizo: ${standsQuantity} kosov</li>` : ""}
          </ul>
        `;
        }
      }
      const textContent = isHr ? `Uspje\u0161na narud\u017Eba!

Hvala na kupnji! Va\u0161 doga\u0111aj ${eventName || "bez imena"} smo uspje\u0161no pripremili.

Pojedinosti narud\u017Ebe:
Paket: ${plan ? plan.toUpperCase() : "Nepoznato"}
Ukupno pla\u0107eno: \u20AC${Number(amountPaid || 0).toFixed(2)}

Nadzornoj plo\u010Di i ure\u0111ivanju va\u0161eg doga\u0111aja mo\u017Eete pristupiti na na\u0161oj web stranici.

Srda\u010Dan pozdrav,
Va\u0161 Kliksy tim` : `Uspe\u0161no naro\u010Dilo!

Hvala za va\u0161 nakup! Va\u0161 dogodek ${eventName || "brez imena"} smo uspe\u0161no pripravili.

Podrobnosti naro\u010Dila:
Paket: ${plan ? plan.toUpperCase() : "Neznano"}
Skupaj pla\u010Dano: \u20AC${Number(amountPaid || 0).toFixed(2)}

Do nadzorne plo\u0161\u010De in urejanja va\u0161ega dogodka lahko dostopate na na\u0161i spletni strani.

Z lepimi pozdravi,
Va\u0161a ekipa Kliksy`;
      const htmlContent = isHr ? `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #4f46e5;">Uspje\u0161na narud\u017Eba!</h1>
          <p>Hvala na kupnji! Va\u0161 doga\u0111aj <strong>${eventName || "bez imena"}</strong> smo uspje\u0161no pripremili.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h2 style="margin-top: 0;">Pojedinosti narud\u017Ebe</h2>
            <p><strong>Paket:</strong> ${plan ? plan.toUpperCase() : "Nepoznato"}</p>
            ${extrasHtml}
            <hr style="border: 1px solid #e5e7eb; margin: 15px 0;"/>
            <p style="font-size: 1.1em;"><strong>Ukupno pla\u0107eno:</strong> \u20AC${Number(amountPaid || 0).toFixed(2)}</p>
          </div>
          
          <p>Nadzornoj plo\u010Di i ure\u0111ivanju va\u0161eg doga\u0111aja mo\u017Eete pristupiti na na\u0161oj web stranici.</p>
          <br />
          <p>Srda\u010Dan pozdrav,<br />Va\u0161 Kliksy tim</p>
        </div>
      ` : `
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
      `;
      if (resendApiKey) {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);
        const { data, error } = await resend.emails.send({
          from: "Kliksy Podpora <info@kliksy.si>",
          replyTo: "info@kliksy.si",
          to: email,
          bcc: "info@kliksy.si",
          subject: subjectContent,
          text: textContent,
          html: htmlContent
        });
        await resend.emails.send({
          from: "Kliksy Sistem <info@kliksy.si>",
          to: "info@kliksy.si",
          subject: `NOVO NARO\u010CILO: ${eventName || "Neznano"} - ${Number(amountPaid || 0).toFixed(2)}\u20AC`,
          text: `Dobili ste novo naro\u010Dilo!
Email: ${email}
Dogodek: ${eventName || "Neznano"}
Paket: ${plan}
Dodatki: ${standsQuantity > 0 ? standsQuantity + " podstavkov" : "Brez"}
Znesek: ${Number(amountPaid || 0).toFixed(2)}\u20AC`
        }).catch((err) => console.error("Admin notif error:", err));
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
            pass: smtpPass
          }
        });
        const mailOptions = {
          from: `"Kliksy" <${smtpUser}>`,
          replyTo: `"Kliksy Podpora" <info@kliksy.si>`,
          to: email,
          bcc: "info@kliksy.si",
          subject: subjectContent,
          text: textContent,
          html: htmlContent
        };
        const adminMailOptions = {
          from: `"Kliksy Sistem" <${smtpUser}>`,
          to: "info@kliksy.si",
          subject: `NOVO NARO\u010CILO: ${eventName || "Neznano"} - ${Number(amountPaid || 0).toFixed(2)}\u20AC`,
          text: `Dobili ste novo naro\u010Dilo!
Email: ${email}
Dogodek: ${eventName || "Neznano"}
Paket: ${plan}
Dodatki: ${standsQuantity > 0 ? standsQuantity + " podstavkov" : "Brez"}
Znesek: ${Number(amountPaid || 0).toFixed(2)}\u20AC`
        };
        await transporter.sendMail(mailOptions);
        await transporter.sendMail(adminMailOptions).catch((err) => console.error("Admin notif error:", err));
      }
      await addContactToResend(email, "", "", "buyers");
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending order summary email:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/download-invoice-pdf", async (req, res) => {
    try {
      const { invoiceData } = req.body;
      if (!invoiceData) {
        return res.status(400).json({ success: false, message: "Manjkajo podatki o ra\u010Dunu." });
      }
      const pdfBuffer = await generateInvoicePdfBuffer(invoiceData);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="Racun_${invoiceData.invoiceNumber}.pdf"`);
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error("Error creating invoice PDF:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
  app.post("/api/send-invoice-pdf", async (req, res) => {
    try {
      const { invoiceData, sendEmail } = req.body;
      if (!invoiceData || !invoiceData.email) {
        return res.status(400).json({ success: false, message: "Manjkajo podatki o ra\u010Dunu." });
      }
      const pdfBuffer = await generateInvoicePdfBuffer(invoiceData);
      if (sendEmail === false) {
        return res.json({ success: true, message: "Ra\u010Dun uspe\u0161no zgeneriran (ne poslan)." });
      }
      const { Resend } = await import("resend");
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.warn("Resend API klju\u010D manjka. Preskakujem po\u0161iljanje emaila.");
        return res.json({ success: true, message: "PDF zgeneriran, vendar email ni poslan (ni klju\u010Da)." });
      }
      const resend = new Resend(resendApiKey);
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
          <p>Pozdravljeni,</p>
          <p>V priponki vam po\u0161iljamo ra\u010Dun za naro\u010Deni Kliksy paket (${invoiceData.plan}).</p>
          <br />
          <p>Hvala za zaupanje in prijetno uporabo aplikacije!</p>
          <p>Va\u0161a Kliksy ekipa</p>
        </div>
      `;
      await resend.emails.send({
        from: "info@kliksy.si",
        replyTo: "info@kliksy.si",
        to: invoiceData.email,
        subject: `Ra\u010Dun ${invoiceData.invoiceNumber} - Kliksy`,
        html: emailHtml,
        attachments: [
          {
            filename: `Racun_${invoiceData.invoiceNumber}.pdf`,
            content: pdfBuffer
          }
        ]
      });
      res.json({ success: true, message: "Ra\u010Dun uspe\u0161no zgeneriran in poslan!" });
    } catch (error) {
      console.error("Error creating/sending invoice:", error);
      res.status(500).json({ success: false, message: error.message });
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
  app.get("/api/trigger-cron", async (req, res) => {
    try {
      const { checkAbandonedProfiles: checkAbandonedProfiles2 } = await Promise.resolve().then(() => (init_cronService(), cronService_exports));
      await checkAbandonedProfiles2();
      res.json({ success: true, message: "Cron check completed" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
  app.post("/api/create-upgrade-session", async (req, res) => {
    try {
      const { currentPlan, newPlan, eventId, successUrl, cancelUrl } = req.body;
      const plans = {
        osnovni: 3900,
        basic: 3900,
        plus: 4900,
        premium: 7900
      };
      const oldPrice = plans[currentPlan];
      const newPrice = plans[newPlan];
      if (!oldPrice || !newPrice || newPrice <= oldPrice) {
        return res.status(400).json({ error: "Invalid upgrade request" });
      }
      const amount = newPrice - oldPrice;
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        throw new Error("STRIPE_SECRET_KEY is not configured limit.");
      }
      const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Nadgradnja na ${newPlan.toUpperCase()}`,
                description: `Nadgradnja paketa iz ${currentPlan.toUpperCase()} na ${newPlan.toUpperCase()}`
              },
              unit_amount: amount
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: eventId,
        metadata: {
          upgradeToPlan: newPlan,
          isUpgrade: "true"
        }
      });
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe upgrade error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { plan, discountCode, standsQuantity, eventId, successUrl, cancelUrl, currency = "eur" } = req.body;
      const amount = await calculatePrice(plan, discountCode, "self_print", standsQuantity, 0, currency);
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
              currency,
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
      const { plan, discountCode, standsQuantity, currency = "eur" } = req.body;
      const amount = await calculatePrice(plan, discountCode, "self_print", standsQuantity, 0, currency);
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
        currency,
        payment_method_types: ["card"]
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/download-zip", async (req, res) => {
    try {
      const { photos, eventName } = req.body;
      let parsedPhotos = [];
      if (typeof photos === "string") {
        parsedPhotos = JSON.parse(photos);
      } else {
        parsedPhotos = parsedPhotos.concat(photos || []);
      }
      if (!parsedPhotos || !parsedPhotos.length) {
        return res.status(400).send("No photos provided");
      }
      const safeEventName = (eventName || "Dogodek").replace(/[^a-zA-Z0-9_-]/g, "_");
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", `attachment; filename="Kliksy-${safeEventName}.zip"`);
      const archive = new ZipArchive({
        zlib: { level: 0 }
        // No compression for speed and low CPU
      });
      archive.on("error", (err) => {
        console.error("Archiver error:", err);
        if (!res.headersSent) {
          res.status(500).send({ error: err.message });
        } else {
          res.end();
        }
      });
      archive.pipe(res);
      let fetchedCount = 0;
      for (let i = 0; i < parsedPhotos.length; i++) {
        const photo = parsedPhotos[i];
        try {
          if (photo && photo.url && photo.url.startsWith("http")) {
            const response = await fetch(photo.url);
            if (response.ok) {
              const contentType = response.headers.get("content-type") || "";
              let extension = photo.type === "video" ? "mp4" : "jpg";
              if (contentType && !contentType.includes("octet-stream")) {
                const split = contentType.split("/");
                if (split.length > 1) {
                  extension = split[1];
                  if (extension === "jpeg") extension = "jpg";
                }
              }
              const prefix = photo.type === "video" ? "video" : "photo";
              const fileName = `${prefix}-${i + 1}.${extension}`;
              const arrayBuffer = await response.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              archive.append(buffer, { name: fileName });
              fetchedCount++;
            }
          }
        } catch (e) {
          console.error(`Failed to fetch photo ${i} for zip:`, e.message);
        }
      }
      await archive.finalize();
    } catch (err) {
      console.error("Error in download-zip endpoint:", err);
      if (!res.headersSent) {
        res.status(500).send("Error generating zip");
      }
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
      res.set("Content-Type", response.headers.get("content-type") || "application/octet-stream");
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        res.set("Content-Length", contentLength);
      }
      if (response.body) {
        const readable = __require("stream").Readable.fromWeb(response.body);
        readable.pipe(res);
      } else {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.send(buffer);
      }
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
    const distPath = path2.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      setHeaders: (res, path3) => {
        if (path3.endsWith(".html")) {
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
      res.sendFile(path2.join(distPath, "index.html"));
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
