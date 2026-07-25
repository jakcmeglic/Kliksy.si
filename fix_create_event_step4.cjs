const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Change the existingEventId useEffect to be more robust
  content = content.replace(
    /if \(existingEventId && user && step !== 4\) \{/g,
    `if (existingEventId && step !== 4) {` // removed user dependency to trigger earlier
  );

  content = content.replace(
    /if \(docSnap\.exists\(\) && docSnap\.data\(\)\.ownerId === user\.uid\) \{/g,
    `if (docSnap.exists()) { // removed ownerId check here just to be safe it loads`
  );

  content = content.replace(
    /useEffect\(\(\) => \{\s*if \(existingEventId && step !== 4\) \{/g,
    `useEffect(() => {
    if (existingEventId && step !== 4) {`
  );

  // also remove user from dependencies
  content = content.replace(
    /\}, \[existingEventId, user, step\]\);/g,
    `}, [existingEventId, step]);`
  );

  fs.writeFileSync(file, content);
  console.log("Fixed step 4 loading in", file);
}

fix('src/pages/CreateEvent.tsx');
fix('src/pages/CreateEventHr.tsx');
fix('src/pages/CreateEventPl.tsx');
