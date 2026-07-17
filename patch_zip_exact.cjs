const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Find the start of handleDownloadAll
  const startIdx = content.indexOf('const handleDownloadAll = async () => {');
  if (startIdx === -1) return;

  // Find the end of handleDownloadAll (it ends right before `return (` or another function)
  // We can just replace the block.
  // The block ends around line 437 in Dashboard.tsx.
  
  const oldCodeRegex = /const handleDownloadAll = async \(\) => \{[\s\S]*?alert\("NAPAKA: " \+ \(error\.stack \|\| error\.message \|\| String\(error\)\)\);\n      setDownloadError\('Prišlo je do napake pri prenosu\. Poskusite znova\.'\);\n      setIsDownloading\(false\);\n    \}\n  \};/m;
  
  const newCode = `const handleDownloadAll = async () => {
    setIsDownloading(true);
    setDownloadError('');
    try {
      const JSZip = (await import('jszip')).default || await import('jszip');
      const { saveAs } = await import('file-saver');
      
      const zip = new (JSZip.default || JSZip)();
      let added = 0;
      
      console.log('Total photos:', photos.length);
      
      for (let i = 0; i < photos.length; i++) {
        try {
          const photo = photos[i];
          const url = photo.url || photo.downloadURL || photo.imageUrl;
          
          console.log('Fetching photo', i, url);
          
          const response = await fetch(url, { mode: 'cors' });
          const blob = await response.blob();
          
          console.log('Blob size:', blob.size, 'type:', blob.type);
          
          if (blob.size > 0) {
            zip.file(\`photo-\${i + 1}.jpg\`, blob);
            added++;
          }
          
          setDownloadProgress(\`Pripravljam ZIP... \${i + 1}/\${photos.length}\`);
        } catch (err) {
          console.error('Photo failed:', i, err);
        }
      }
      
      console.log('Photos added to ZIP:', added);
      
      if (added === 0) {
        alert('Nobena slika ni bila dodana v ZIP. Preverite konzolo za napake.');
        setIsDownloading(false);
        return;
      }
      
      setDownloadProgress('Ustvarjam datoteko...');
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'Kliksy-galerija.zip');
      setDownloadProgress('');
      
    } catch (err: any) {
      console.error('ZIP error:', err);
      alert('Napaka pri prenosu: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };`;

  if (content.match(oldCodeRegex)) {
    content = content.replace(oldCodeRegex, newCode);
    fs.writeFileSync(file, content);
    console.log("Patched", file);
  } else {
    console.log("Could not find regex match in", file);
  }
}

['src/pages/Dashboard.tsx', 'src/pages/DashboardHr.tsx', 'src/pages/DashboardPl.tsx'].forEach(patch);
