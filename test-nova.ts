import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const newConfig = { ...config, firestoreDatabaseId: "nova" };
const newApp = initializeApp(newConfig, "new");
const newDb = getFirestore(newApp, "nova");

async function testNova() {
  try {
    const snap = await getDocs(collection(newDb, "users"));
    console.log("Read success on nova, users count:", snap.size);
    try {
      await setDoc(doc(newDb, "users", "test1234"), { foo: "bar" });
      console.log("Write success on nova");
    } catch (we) {
      console.error("Write error on nova:", we);
    }
  } catch (e) {
    console.error("Read error on nova:", e);
  }
}
testNova().catch(console.error);
