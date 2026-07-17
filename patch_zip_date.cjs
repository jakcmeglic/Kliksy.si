const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /const dateStr = new Date\(event\.eventDate\)\.toISOString\(\)\.split\('T'\)\[0\];/,
    "const dateStr = event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];"
  );
  fs.writeFileSync(file, content);
}

patch('src/pages/Dashboard.tsx');
patch('src/pages/DashboardHr.tsx');
patch('src/pages/DashboardPl.tsx');
