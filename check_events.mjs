import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query } from 'firebase/firestore';
import fs from 'fs';

const rawConfig = fs.readFileSync('firebase-applet-config.json', 'utf8');
const firebaseConfig = JSON.parse(rawConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const eventsSnap = await getDocs(query(collection(db, 'events')));
  const events = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const usersSnap = await getDocs(query(collection(db, 'users')));
  const users = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

  const now = new Date();
  // We want today based on Europe time or currently server time?
  const todayStr = '2026-06-21'; // from local time

  let todayEvents = [];
  
  events.forEach(e => {
    let ts = 0;
    if (e.createdAt && e.createdAt.seconds) {
      ts = e.createdAt.seconds * 1000;
    } else if (e.createdAt && e.createdAt.toMillis) {
      ts = e.createdAt.toMillis();
    }
    const d = new Date(ts);
    if (ts > 0 && d.toISOString().startsWith('2026-06-21')) {
      todayEvents.push(e);
    }
  });

  console.log(`Total events today: ${todayEvents.length}`);
  const uniqueUsers = new Set(todayEvents.map(e => e.ownerId));
  console.log(`Unique users who created events today: ${uniqueUsers.size}`);
  
  console.log(`Abandoned carts total users: ${users.length - new Set(events.filter(e => e.paymentStatus === 'paid').map(e => e.ownerId)).size} roughly (ignoring exact logic)`);
}

check().then(() => process.exit(0)).catch(console.error);
