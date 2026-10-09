const fs = require('fs');
function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/plans\[\(formData\.plan as "basic"\|"plus"\|"premium"\) \|\| "basic"\]\.name/g, 'plans[(formData.plan as "basic"|"plus"|"premium") || "basic"]?.name || "Basic"');
  fs.writeFileSync(file, content);
  console.log("Fixed", file);
}
fix('src/pages/CreateEvent.tsx');
fix('src/pages/CreateEventHr.tsx');
fix('src/pages/CreateEventPl.tsx');
