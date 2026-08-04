const fs = require('fs');

function cleanEnd(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const badStr = '    </>\n      </>\n  );\n}';
  if (content.includes(badStr)) {
    content = content.replace(badStr, '    </>\n  );\n}');
    fs.writeFileSync(filePath, content);
    console.log("Cleaned up end of " + filePath);
  } else {
    // maybe one of the <> is without spaces
    const badStr2 = '</>\n      </>\n  );\n}';
    if (content.includes(badStr2)) {
      content = content.replace(badStr2, '</>\n  );\n}');
      fs.writeFileSync(filePath, content);
    }
  }
}

cleanEnd('src/pages/Landing.tsx');
cleanEnd('src/pages/LandingHr.tsx');
