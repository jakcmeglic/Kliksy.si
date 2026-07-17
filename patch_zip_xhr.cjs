const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  const helper = `const downloadImageAsBlob = (url: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error('Failed: ' + xhr.status));
      }
    };
    xhr.onerror = () => reject(new Error('XHR failed'));
    xhr.open('GET', url);
    xhr.send();
  });
};

  const handleDownloadAll`;

  content = content.replace(/const handleDownloadAll/, helper);

  content = content.replace(
    /const response = await fetch\(url, \{ mode: 'cors' \}\);\n\s*const blob = await response\.blob\(\);/,
    `const blob = await downloadImageAsBlob(url);`
  );

  fs.writeFileSync(file, content);
  console.log("Patched", file);
}

['src/pages/Dashboard.tsx', 'src/pages/DashboardHr.tsx', 'src/pages/DashboardPl.tsx'].forEach(patch);
