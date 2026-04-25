import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

try {
  initializeApp({
    projectId: config.projectId,
  });
  console.log("Admin init successful");
  
  const db = getFirestore();
  db.settings({ databaseId: config.firestoreDatabaseId });
  
  // Try to read promoCodes
  db.collection('promoCodes').get().then(snap => {
    console.log("Found promos:", snap.size);
  }).catch(e => {
    console.error("Read error:", e.message);
  });
  
} catch (e) {
  console.error("Init error:", e);
}
