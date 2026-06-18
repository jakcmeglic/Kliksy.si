const fs = require('fs');

const filesToUpdate = [
  'server.ts',
  'src/pages/CreateEvent.tsx',
  'src/pages/CreateEventHr.tsx',
  'src/pages/CreateEventPl.tsx'
];

for (const file of filesToUpdate) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file === 'server.ts') {
    // server.ts logic
    content = content.replace(/\s*\} else if \(code === 'prvi50'\) \{\s*return Math\.round\(finalPrice \* 0\.5\);\s*\}/g, '');
    content = content.replace(/\s*\} else if \(code === 'pomlad30'\) \{\s*return Math\.round\(finalPrice \* 0\.7\);\s*\}/g, '');
  } else {
    // CreateEvent logic
    // Part 1: Validation logic
    // removing prvi50
    content = content.replace(/\s*if \(codeNormalized === 'prvi50'\) \{\n\s*setActiveDiscount\(\{\n\s*code: 'prvi50',\n\s*value: 50,\n\s*discountType: 'percentage',\n\s*appliesTo: 'total'\n\s*\}\);\n\s*setDiscountApplied\(true\);\n\s*setDiscountError\(''\);\n\s*return;\n\s*\}/g, '');
    content = content.replace(/\s*\} else if \(codeNormalized === 'prvi50'\) \{\n\s*setActiveDiscount\(\{\n\s*code: 'prvi50',\n\s*value: 50,\n\s*discountType: 'percentage',\n\s*appliesTo: 'total'\n\s*\}\);\n\s*setDiscountApplied\(true\);\n\s*setDiscountError\(''\);\n\s*return;\n\s*\}/g, '');
    
    // removing pomlad30
    content = content.replace(/\s*if \(codeNormalized === 'pomlad30'\) \{\n\s*setActiveDiscount\(\{\n\s*code: 'pomlad30',\n\s*value: 30,\n\s*discountType: 'percentage',\n\s*appliesTo: 'total'\n\s*\}\);\n\s*setDiscountApplied\(true\);\n\s*setDiscountError\(''\);\n\s*return;\n\s*\}/g, '');
    content = content.replace(/\s*\} else if \(codeNormalized === 'pomlad30'\) \{\n\s*setActiveDiscount\(\{\n\s*code: 'pomlad30',\n\s*value: 30,\n\s*discountType: 'percentage',\n\s*appliesTo: 'total'\n\s*\}\);\n\s*setDiscountApplied\(true\);\n\s*setDiscountError\(''\);\n\s*return;\n\s*\}/g, '');
    
    // Part 2: Calculation logic
    content = content.replace(/\s*\} else if \(discountCode\.toLowerCase\(\) === 'prvi50'\) \{\n\s*finalPrice = finalPrice \* 0\.5;\n\s*\}/g, '');
    content = content.replace(/\s*\} else if \(discountCode\.toLowerCase\(\) === 'pomlad30'\) \{\n\s*finalPrice = finalPrice \* 0\.7;\n\s*\}/g, '');
  }
  
  fs.writeFileSync(file, content, 'utf8');
}
