import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function findUserOrEvent() {
  console.log("Searching for events with email leastebe@gmail.com...");
  const eventsRef = collection(db, 'events');
  const q = query(eventsRef, where('email', '==', 'leastebe@gmail.com'));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log("No events found with that direct email.");
    // Let's just fetch recent events
    const recentQ = query(eventsRef);
    const recentSnap = await getDocs(recentQ);
    let found = false;
    recentSnap.forEach(doc => {
      const data = doc.data();
      const dataStr = JSON.stringify(data).toLowerCase();
      if (dataStr.includes('leastebe')) {
        console.log("Found in event:", doc.id, data);
        found = true;
      }
    });
    if (!found) console.log("Did not find leastebe inside any recent events.");
  } else {
    snapshot.forEach(doc => {
      console.log("Found event:", doc.id, doc.data());
    });
  }
}

findUserOrEvent().then(() => process.exit(0)).catch(console.error);
