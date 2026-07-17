const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    /const JSZip = \(await import\('jszip'\)\)\.default \|\| await import\('jszip'\);\n\s*const \{ saveAs \} = await import\('file-saver'\);\n\s*const zip = new \(JSZip\.default \|\| JSZip\)\(\);/m,
    `const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      
      const zip = new JSZip();`
  );

  fs.writeFileSync(file, content);
  console.log("Patched", file);
}

['src/pages/Dashboard.tsx', 'src/pages/DashboardHr.tsx', 'src/pages/DashboardPl.tsx'].forEach(patch);
