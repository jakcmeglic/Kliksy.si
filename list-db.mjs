import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import fs from 'fs';

const configStr = fs.readFileSync('src/firebase.ts', 'utf8');
const configMatch = configStr.match(/const firebaseConfig = ({[\s\S]*?});/);
if (!configMatch) throw new Error("config not found");

const firebaseConfig = eval('(' + configMatch[1] + ')');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const snap = await getDocs(collection(db, 'events', 'VB764iB8n2c27kC5v51q', 'photos'));
snap.forEach(doc => {
  console.log(doc.id, doc.data().url);
});
