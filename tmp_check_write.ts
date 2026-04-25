import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const dbDefault = getFirestore(app);

async function check() {
    try {
        await addDoc(collection(dbDefault, 'test_default'), { time: Date.now() });
        console.log("Successfully wrote to default DB!");
    } catch(e: any) { 
        console.log("Default DB Write Error:", e.message);
    }
}
check();
