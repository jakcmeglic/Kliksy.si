import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const dbDefault = getFirestore(app);
const dbNamed = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function check() {
    try {
        const snap = await getDocs(query(collection(dbDefault, 'events'), limit(1)));
        console.log("Default DB size:", snap.size);
    } catch(e) { console.log("Default Error:", e.message) }

    try {
        const snap2 = await getDocs(query(collection(dbNamed, 'events'), limit(1)));
        console.log("Named DB size:", snap2.size);
    } catch(e) { console.log("Named Error:", e.message) }
}

check();
