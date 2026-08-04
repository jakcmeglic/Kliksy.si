const fs = require('fs');

function cleanEnd(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.endsWith('    </>\n  );\n}')) {
    content = content.replace('    </>\n  );\n}', '');
    fs.writeFileSync(filePath, content);
    console.log("Cleaned up end of " + filePath);
  }
}

cleanEnd('src/pages/Landing.tsx');
cleanEnd('src/pages/LandingHr.tsx');
