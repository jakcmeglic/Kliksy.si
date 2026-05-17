import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

let db: any = null;

function initFirebase() {
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
  initFirebase();
  if (!db) {
    console.log('Skipping cron service: Firebase not configured.');
    return;
  }
  
  // Run check every 5 minutes
  setInterval(checkAbandonedProfiles, 5 * 60 * 1000);
  
  // Also run once on startup, after a short delay
  setTimeout(checkAbandonedProfiles, 10 * 1000);
}

async function checkAbandonedProfiles() {
  if (!db) return;
  try {
    const now = Date.now();
    const twoHoursAgo = now - (2 * 60 * 60 * 1000);
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    const fortyEightHoursAgo = now - (48 * 60 * 60 * 1000);
    const seventyTwoHoursAgo = now - (72 * 60 * 60 * 1000);

    const usersSnap = await getDocs(collection(db, 'users'));
    const users = usersSnap.docs.map(d => ({ id: d.id, ref: d.ref, ...d.data() })) as any[];

    // Check for 2-hour abandoned profiles
    const candidates2h = users.filter((u: any) => {
      if (u.abandonedEmailSent) return false;
      if (!u.createdAt) return false;
      
      const createdTime = u.createdAt instanceof Timestamp ? u.createdAt.toMillis() : u.createdAt;
      // Between 2 hours and 24 hours ago
      // meaning: created at least 2 hours ago, but not older than 24 hours
      return createdTime <= twoHoursAgo && createdTime >= twentyFourHoursAgo;
    });

    for (const user of candidates2h) {
      if (!user.email) continue;

      const eventsSnap = await getDocs(query(
        collection(db, 'events'),
        where('ownerId', '==', user.id),
        where('paymentStatus', '==', 'paid')
      ));

      if (eventsSnap.empty) {
        await sendFollowUpEmail(user.email);
        console.log(`Sent 2h abandoned follow-up to ${user.email}`);
      } else {
        console.log(`Skipped 2h follow-up for ${user.email} (has paid events)`);
      }

      await updateDoc(user.ref, { abandonedEmailSent: true }).catch((e) => {
        console.error("Failed to update abandonedEmailSent flag:", e);
      });
    }

    // Check for 48-hour abandoned profiles
    const candidates48h = users.filter((u: any) => {
      if (u.abandonedTwoDaysEmailSent) return false;
      if (!u.createdAt) return false;
      
      const createdTime = u.createdAt instanceof Timestamp ? u.createdAt.toMillis() : u.createdAt;
      // Between 48 hours and 72 hours ago
      // meaning: created at least 48 hours ago, but not older than 72 hours
      return createdTime <= fortyEightHoursAgo && createdTime >= seventyTwoHoursAgo;
    });

    for (const user of candidates48h) {
      if (!user.email) continue;

      const eventsSnap = await getDocs(query(
        collection(db, 'events'),
        where('ownerId', '==', user.id),
        where('paymentStatus', '==', 'paid')
      ));

      if (eventsSnap.empty) {
        await sendTwoDaysFollowUpEmail(user.email);
        console.log(`Sent 48h abandoned follow-up to ${user.email}`);
      } else {
        console.log(`Skipped 48h follow-up for ${user.email} (has paid events)`);
      }

      await updateDoc(user.ref, { abandonedTwoDaysEmailSent: true }).catch((e) => {
        console.error("Failed to update abandonedTwoDaysEmailSent flag:", e);
      });
    }

  } catch (error) {
    console.error('Error in abandoned profile cron:', error);
  }
}

export async function sendFollowUpEmail(email: string) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("No Resend API key to send follow up email.");
    return;
  }
  
  const { Resend } = await import('resend');
  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: "Kliksy Podpora <info@kliksy.si>",
    replyTo: "info@kliksy.si",
    to: email,
    subject: "Kako vam lahko pomagamo?",
    text: `Živjo 😊\n\nOpazili smo, da ste si na Kliksy ustvarili profil oziroma začeli ustvarjati dogodek, vendar ga še niste zaključili.\n\nKer smo še nova slovenska platforma, nam vsak feedback res veliko pomeni 😊\nZato nas zanima, se je morda kje zataknilo ali pa vam manjka kakšna informacija?\n\nZ veseljem pomagamo pri:\n• izbiri paketa\n• pripravi QR kode\n• razlagi, kako vse skupaj deluje\n• ali kateremkoli drugem vprašanju 😊\n\nNa voljo smo vam in z veseljem pomagamo 💛\n\nLep pozdrav,\nJaka iz Kliksy.si`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <p>Živjo 😊</p>
        <p>Opazili smo, da ste si na Kliksy ustvarili profil oziroma začeli ustvarjati dogodek, vendar ga še niste zaključili.</p>
        <p>Ker smo še nova slovenska platforma, nam vsak feedback res veliko pomeni 😊<br />
        Zato nas zanima, se je morda kje zataknilo ali pa vam manjka kakšna informacija?</p>
        <p>Z veseljem pomagamo pri:<br />
        • izbiri paketa<br />
        • pripravi QR kode<br />
        • razlagi, kako vse skupaj deluje<br />
        • ali kateremkoli drugem vprašanju 😊</p>
        <p>Na voljo smo vam in z veseljem pomagamo 💛</p>
        <p>Lep pozdrav,<br />Jaka iz Kliksy.si</p>
      </div>
    `,
  });
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
    from: "Kliksy Podpora <info@kliksy.si>",
    replyTo: "info@kliksy.si",
    to: email,
    subject: "Ste uspeli preizkusiti svoj demo dogodek? 😊",
    text: `Živjo 😊\n\nPred nekaj dnevi ste si na Kliksy.si ustvarili profil, vendar svojega dogodka še niste dokončali.\n\nZa vas smo pripravili demo galerijo, kjer lahko preizkusite, kako bo Kliksy izgledal na vašem dogodku. Dodate lahko nekaj testnih slik in vidite celotno izkušnjo 😊\n\nVeliko uporabnikov šele takrat zares dobi občutek, kako lepo je imeti vse spontane trenutke zbrane na enem mestu 💛\n\nČe imate kakršnokoli vprašanje ali pa se je kje zataknilo, nam brez zadržkov odgovorite na ta mail. Z veseljem pomagamo 😊\n\nLep pozdrav,\nJaka\nKliksy.si`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <p>Živjo 😊</p>
        <p>Pred nekaj dnevi ste si na Kliksy.si ustvarili profil, vendar svojega dogodka še niste dokončali.</p>
        <p>Za vas smo pripravili demo galerijo, kjer lahko preizkusite, kako bo Kliksy izgledal na vašem dogodku. Dodate lahko nekaj testnih slik in vidite celotno izkušnjo 😊</p>
        <p>Veliko uporabnikov šele takrat zares dobi občutek, kako lepo je imeti vse spontane trenutke zbrane na enem mestu 💛</p>
        <p>Če imate kakršnokoli vprašanje ali pa se je kje zataknilo, nam brez zadržkov odgovorite na ta mail. Z veseljem pomagamo 😊</p>
        <p>Lep pozdrav,<br />Jaka<br />Kliksy.si</p>
      </div>
    `,
  });
}
