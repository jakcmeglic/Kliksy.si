const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const zip = new JSZip\(\);/g, 'const zip = new (JSZip.default || JSZip)();');
  fs.writeFileSync(file, content);
}

patch('src/pages/Dashboard.tsx');
patch('src/pages/DashboardHr.tsx');
patch('src/pages/DashboardPl.tsx');
