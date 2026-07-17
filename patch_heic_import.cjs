const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('import heic2any from')) {
    content = content.replace(/import {([^}]+)} from "react";/, 'import {$1} from "react";\nimport heic2any from "heic2any";');
  }

  content = content.replace(/const heic2anyFn = await loadHeic2Any\(\);/, '');
  content = content.replace(/await heic2anyFn\(\{/, 'await heic2any({');

  fs.writeFileSync(file, content);
}

patch('src/pages/GuestView.tsx');
patch('src/pages/GuestViewHr.tsx');
patch('src/pages/GuestViewPl.tsx');
