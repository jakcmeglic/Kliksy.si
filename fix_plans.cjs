const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find setFormData in loadEvent
  content = content.replace(
    /plan: data\.plan \|\| initialPlan,/g,
    `plan: (data.plan === 'osnovni' ? 'basic' : data.plan === 'napredni' ? 'plus' : data.plan) || initialPlan,`
  );

  // Also fix the plans object access just to be safe
  content = content.replace(
    /const originalPrice = plans\[formData\.plan\]\.price;/g,
    `const safePlan = plans[formData.plan] ? formData.plan : 'basic';\n  const originalPrice = plans[safePlan].price;`
  );
  
  // Replace references of formData.plan to safePlan in plans mapping if any
  // But wait, there are other places where plans[formData.plan] is used!
  content = content.replace(
    /plans\[formData\.plan\]\./g,
    `plans[plans[formData.plan] ? formData.plan : 'basic'].`
  );

  fs.writeFileSync(file, content);
  console.log("Fixed", file);
}

fix('src/pages/CreateEvent.tsx');
fix('src/pages/CreateEventHr.tsx');
fix('src/pages/CreateEventPl.tsx');
