const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  const oldCode = `      const eventNameStr = event.eventType === 'poroka' || !event.eventType ? \`\${event.partner1}-\${event.partner2}\` : event.eventName;
      const dateStr = event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const zipFilename = \`Kliksy-\${eventNameStr}-\${dateStr}.zip\`;
      
      const zip = new (JSZip.default || JSZip)();`;

  const newCode = `      const eventNameStr = event.eventType === 'poroka' || !event.eventType ? \`\${event.partner1}-\${event.partner2}\` : event.eventName;
      let dateStr = new Date().toISOString().split('T')[0];
      try {
        if (event.date) dateStr = new Date(event.date).toISOString().split('T')[0];
      } catch(e) {}
      const zipFilename = \`Kliksy-\${eventNameStr}-\${dateStr}.zip\`;
      
      const zip = typeof JSZip === 'function' ? new JSZip() : new (JSZip as any).default();`;

  content = content.replace(oldCode, newCode);

  content = content.replace(/setIsDownloading\(false\);\n      setDownloadProgress\(''\);\n    \} catch \(error\) \{[\s\S]*?setIsDownloading\(false\);\n    \}/, `setIsDownloading(false);
      setDownloadProgress('');
    } catch (error: any) {
      console.error("Error generating zip:", error);
      alert("NAPAKA: " + (error.stack || error.message || String(error)));
      setDownloadError('Prišlo je do napake pri prenosu. Poskusite znova.');
      setIsDownloading(false);
    }`);

  // Also replace manual download with saveAs back
  content = content.replace(/const zipUrl = URL\.createObjectURL\(zipBlob\);[\s\S]*?URL\.revokeObjectURL\(zipUrl\);/, `saveAs(zipBlob, zipFilename);`);

  fs.writeFileSync(file, content);
}

patch('src/pages/Dashboard.tsx');
patch('src/pages/DashboardHr.tsx');
patch('src/pages/DashboardPl.tsx');
