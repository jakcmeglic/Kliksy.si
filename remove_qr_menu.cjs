const fs = require('fs');

function removeQrMenu(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the QR code list item
  const regex = /<li>\s*<button\s*onClick=\{\(\) => setActiveTab\('qr'\)\}[\s\S]*?<\/li>/;
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content);
    console.log(`Removed QR menu from ${file}`);
  } else {
    console.log(`Could not find QR menu in ${file}`);
  }
}

removeQrMenu('src/pages/Dashboard.tsx');
removeQrMenu('src/pages/DashboardHr.tsx');
removeQrMenu('src/pages/DashboardPl.tsx');
