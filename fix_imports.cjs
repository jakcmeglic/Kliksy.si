const fs = require('fs');

function addImports(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the lucide-react import
  const lucideRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];/;
  const match = content.match(lucideRegex);
  
  if (match) {
    let imports = match[1].split(',').map(s => s.trim());
    const needed = ['QrCode', 'Sparkles', 'ChevronRight'];
    
    needed.forEach(n => {
      if (!imports.includes(n)) {
        imports.push(n);
      }
    });
    
    const newImport = `import { ${imports.join(', ')} } from "lucide-react";`;
    content = content.replace(lucideRegex, newImport);
    fs.writeFileSync(file, content);
    console.log("Fixed imports in", file);
  }
}

['src/pages/Dashboard.tsx', 'src/pages/DashboardHr.tsx', 'src/pages/DashboardPl.tsx'].forEach(addImports);
