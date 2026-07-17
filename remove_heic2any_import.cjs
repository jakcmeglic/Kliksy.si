const fs = require('fs');
function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import heic2any from "heic2any";\n/g, '');
  fs.writeFileSync(file, content);
}
patch('src/pages/GuestView.tsx');
patch('src/pages/GuestViewHr.tsx');
patch('src/pages/GuestViewPl.tsx');
