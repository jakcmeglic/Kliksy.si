const fs = require('fs');
function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/plans\[plans\[formData\.plan\] \? formData\.plan \: 'basic'\]/g, 'plans[(formData.plan as "basic"|"plus"|"premium") || "basic"]');
  content = content.replace(/const safePlan = plans\[formData\.plan\] \? formData\.plan \: 'basic';\n\s*const originalPrice = plans\[safePlan\]\.price;/g, 'const originalPrice = plans[(formData.plan as "basic"|"plus"|"premium") || "basic"]?.price || 0;');
  fs.writeFileSync(file, content);
  console.log("Fixed", file);
}
fix('src/pages/CreateEvent.tsx');
fix('src/pages/CreateEventHr.tsx');
fix('src/pages/CreateEventPl.tsx');
