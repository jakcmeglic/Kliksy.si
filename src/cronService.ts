import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

let db: any = null;

export function initFirebase() {
  if (db) return db;
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getFirestore(app, config.firestoreDatabaseId);
  }
  return db;
}

export function startCronService() {
  console.log('--- startCronService triggered ---');
  initFirebase();
  if (!db) {
    console.log('Skipping cron service: Firebase not configured. Did not detect config or initialization failed.');
    return;
  }
  
  console.log('Firebase initialized. Setting up cron intervals...');
  
  // Run check every 5 minutes
  setInterval(checkAbandonedProfiles, 5 * 60 * 1000);
  
  // Also run once on startup, after a short delay
  setTimeout(() => {
    console.log('Running immediate cron check after startup...');
    checkAbandonedProfiles();
  }, 10 * 1000);
}

export async function checkAbandonedProfiles() {
  if (!db) return;
  try {
    const now = Date.now();
    const twoDaysAgo = now - (2 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Explicit cutoff: May 29th, 2026 (as requested)
    const cutoffDate = new Date('2026-05-29T00:00:00Z').getTime();

    const usersSnap = await getDocs(collection(db, 'users'));
    const users = usersSnap.docs.map(d => ({ id: d.id, ref: d.ref, ...d.data() })) as any[];

    // Check for 2-day abandoned profiles
    const candidates2Days = users.filter((u: any) => {
      let createdTime = 0;
      if (u.createdAt) {
        if (typeof u.createdAt.toMillis === 'function') createdTime = u.createdAt.toMillis();
        else if (u.createdAt.seconds) createdTime = u.createdAt.seconds * 1000;
        else if (typeof u.createdAt === 'number') createdTime = u.createdAt;
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
        collection(db, 'events'),
        where('ownerId', '==', user.id),
        where('paymentStatus', '==', 'paid')
      ));

      if (eventsSnap.empty) {
        await sendTwoDaysFollowUpEmail(user.email);
        console.log(`Sent 2-day abandoned follow-up to ${user.email}`);
      }

      await updateDoc(user.ref, { abandonedEmailSent: true }).catch((e) => {
        console.error("Failed to update abandonedEmailSent flag:", e);
      });
    }

    // Check for 7-day abandoned profiles
    const candidates7Days = users.filter((u: any) => {
      let createdTime = 0;
      if (u.createdAt) {
        if (typeof u.createdAt.toMillis === 'function') createdTime = u.createdAt.toMillis();
        else if (u.createdAt.seconds) createdTime = u.createdAt.seconds * 1000;
        else if (typeof u.createdAt === 'number') createdTime = u.createdAt;
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
        collection(db, 'events'),
        where('ownerId', '==', user.id),
        where('paymentStatus', '==', 'paid')
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
    console.error('Error in abandoned profile cron:', error);
  }
}

export async function sendTwoDaysFollowUpEmail(email: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("No Resend API key to send follow up email.");
    return;
  }
  
  const { Resend } = await import('resend');
  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: "Kliksy <info@kliksy.si>",
    replyTo: "info@kliksy.si",
    to: email,
    subject: "Ali ste pozabili kaj dokončati na Kliksy? 📸",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <p>Pozdravljeni!</p>
        <p>Opazili smo, da se že nekaj časa niste prijavili v svoj Kliksy račun in ustvarili svoje galerije za vaš poseben dogodek.</p>
        <p>Zbiranje spominov še nikoli ni bilo tako enostavno. Če potrebujete kakršnokoli pomoč, nas enostavno kontaktirajte.</p>
        <p>Pojdite nazaj na <a href="https://kliksy.si" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Kliksy</a> in nadaljujte, kjer ste ostali!</p>
        <br />
        <p>Vaša Kliksy ekipa</p>
      </div>
    `,
  });
}

export async function sendSevenDaysFollowUpEmail(email: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("No Resend API key to send follow up email.");
    return;
  }
  
  const { Resend } = await import('resend');
  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: "Kliksy <info@kliksy.si>",
    replyTo: "info@kliksy.si",
    to: email,
    subject: "Še vedno ste pravočasni! Rešite svoje spomine z nami ⏱️",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <p>Živjo ponovno!</p>
        <p>Minil je že en teden, odkar ste se registrirali na Kliksy. Ne dovolite, da vaši spomini ostanejo skriti na telefonih vaših gostov!</p>
        <p>Ustvarjanje galerije vzame le nekaj trenutkov, vaši gosti pa bodo z veseljem delili svoje fotografije preko QR kode – brez nalaganja aplikacije.</p>
        <p>Preverite, kako enostavno je, in dokončajte svojo prvo galerijo na <a href="https://kliksy.si" style="color: #4f46e5; text-decoration: none; font-weight: bold;">Kliksy</a>.</p>
        <p>Če imate dodatna vprašanja, z veseljem prisluhnemo.</p>
        <br />
        <p>Vaša Kliksy ekipa</p>
      </div>
    `,
  });
}
