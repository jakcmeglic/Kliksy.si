import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll } from 'firebase/storage';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const listRef = ref(storage, 'events/J2LseFfWhHATjsRRKp65/photos');
listAll(listRef).then((res) => {
  console.log("Files:", res.items.length);
  res.items.forEach((itemRef) => {
    console.log(itemRef.name);
  });
}).catch(console.error);
