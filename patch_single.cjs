const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(
    /const proxyUrl = `\/api\/proxy-image\?url=\$\{encodeURIComponent\(url\)\}`;[\s\S]*?response = await fetch\(proxyUrl\);/,
    `response = await fetch(url, { mode: 'cors' });`
  );
  // Also we might need to change it to not throw on proxy failure but standard failure:
  content = content.replace(/if \(!response\.ok && !url\.startsWith\('data:'\)\) throw new Error\("Proxy fetch failed"\);/, 'if (!response.ok && !url.startsWith(\'data:\')) throw new Error("Fetch failed");');

  fs.writeFileSync(file, content);
  console.log("Patched", file);
}

['src/pages/Dashboard.tsx', 'src/pages/DashboardHr.tsx', 'src/pages/DashboardPl.tsx'].forEach(patch);
