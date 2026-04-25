import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

// Old db config
const oldConfig = {
  ...config,
  firestoreDatabaseId: "ai-studio-713663ea-168a-4eb9-acdc-3b111a51393a"
};

// New db config
const newConfig = {
  ...config,
  firestoreDatabaseId: "nova"
};

const oldApp = initializeApp(oldConfig, "old");
const newApp = initializeApp(newConfig, "new");

const oldDb = getFirestore(oldApp, oldConfig.firestoreDatabaseId);
const newDb = getFirestore(newApp, newConfig.firestoreDatabaseId);

async function migrate() {
  console.log("Starting migration...");
  
  // Migrate Promo Codes
  console.log("Migrating promoCodes...");
  const promosSnap = await getDocs(collection(oldDb, "promoCodes"));
  for (const promoDoc of promosSnap.docs) {
    await setDoc(doc(newDb, "promoCodes", promoDoc.id), promoDoc.data());
  }
  console.log(`Migrated ${promosSnap.size} promo codes.`);

  // Migrate Users
  console.log("Migrating users...");
  const usersSnap = await getDocs(collection(oldDb, "users"));
  for (const userDoc of usersSnap.docs) {
    await setDoc(doc(newDb, "users", userDoc.id), userDoc.data());
  }
  console.log(`Migrated ${usersSnap.size} users.`);

  // Migrate Events and Photos
  console.log("Migrating events...");
  const eventsSnap = await getDocs(collection(oldDb, "events"));
  for (const eventDoc of eventsSnap.docs) {
    await setDoc(doc(newDb, "events", eventDoc.id), eventDoc.data());
    
    // Migrating photos for this event
    const photosSnap = await getDocs(collection(oldDb, "events", eventDoc.id, "photos"));
    for (const photoDoc of photosSnap.docs) {
      await setDoc(doc(newDb, "events", eventDoc.id, "photos", photoDoc.id), photoDoc.data());
    }
    console.log(`  - Migrated event ${eventDoc.id} with ${photosSnap.size} photos.`);
  }
  console.log(`Migrated ${eventsSnap.size} events total.`);
  
  console.log("Migration complete!");
}

migrate().catch(console.error);
