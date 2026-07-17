const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Add imports
  if (!content.includes("import JSZip from 'jszip';")) {
    content = content.replace(
      /import \{ motion \} from "framer-motion";/,
      `import { motion } from "framer-motion";\nimport JSZip from 'jszip';\nimport { saveAs } from 'file-saver';`
    );
  }

  // Remove zip = typeof JSZip === 'function' ? ...
  content = content.replace(
    /const zip = typeof JSZip === 'function' \? new JSZip\(\) : new \(JSZip as any\)\.default\(\);/g,
    `const zip = new JSZip();`
  );
  
  content = content.replace(
    /const zip = new \(JSZip\.default \|\| JSZip\)\(\);/g,
    `const zip = new JSZip();`
  );

  fs.writeFileSync(file, content);
}

patch('src/pages/Dashboard.tsx');
patch('src/pages/DashboardHr.tsx');
patch('src/pages/DashboardPl.tsx');
