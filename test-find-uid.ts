import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function findUser() {
  const userRef = doc(db, 'users', 'mlO0j2wtz7NNl9IF6lhGY1yVp133');
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    console.log("User doc:", snap.data());
  } else {
    console.log("No user doc found for mlO0j2wtz7NNl9IF6lhGY1yVp133");
  }
}

findUser().then(() => process.exit(0)).catch(console.error);
