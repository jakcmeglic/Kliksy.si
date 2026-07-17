const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace saveAs with manual a-tag download
  content = content.replace(/saveAs\(zipBlob, zipFilename\);/, `const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = zipFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);`);

  fs.writeFileSync(file, content);
}

patch('src/pages/Dashboard.tsx');
patch('src/pages/DashboardHr.tsx');
patch('src/pages/DashboardPl.tsx');
