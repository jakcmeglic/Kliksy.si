import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const oldConfig = { ...config, firestoreDatabaseId: "ai-studio-713663ea-168a-4eb9-acdc-3b111a51393a" };
const oldApp = initializeApp(oldConfig, "old");
const oldDb = getFirestore(oldApp, "ai-studio-713663ea-168a-4eb9-acdc-3b111a51393a");

async function testOld() {
  try {
    const snap = await getDocs(collection(oldDb, "users"));
    console.log("Read success on old, users count:", snap.size);
  } catch (e) {
    console.error("Read error on old:", e);
  }
}
testOld().catch(console.error);
