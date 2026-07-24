const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{([^}]+)\}\s+from\s+['"]lucide-react['"];/, (match, p1) => {
    let imports = p1.split(',').map(s => s.trim());
    if (!imports.includes('LayoutGrid')) {
      imports.push('LayoutGrid');
    }
    return `import { ${imports.join(', ')} } from "lucide-react";`;
  });
  fs.writeFileSync(file, content);
}

fix('src/pages/Dashboard.tsx');
fix('src/pages/DashboardHr.tsx');
fix('src/pages/DashboardPl.tsx');
