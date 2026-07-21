const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace the entire handleDownloadAll function block
  const oldCodeRegex = /  const handleDownloadAll = async \(\) => \{[\s\S]*?setIsDownloading\(false\);\n    \}\n  \};/m;
  
  const newCode = `  const handleDownloadAll = async () => {
    setIsDownloading(true);
    setDownloadError('');
    try {
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      
      const BATCH_SIZE = 500;
      const batches = [];
      for (let i = 0; i < photos.length; i += BATCH_SIZE) {
        batches.push(photos.slice(i, i + BATCH_SIZE));
      }
      
      alert(\`Vaša galerija ima \${photos.length} slik. Prenos bo razdeljen v \${batches.length} ZIP datotekah.\`);
      
      let totalAdded = 0;
      
      for (let b = 0; b < batches.length; b++) {
        const zip = new JSZip();
        const batch = batches[b];
        
        setDownloadProgress(\`Pripravljam ZIP \${b + 1}/\${batches.length}...\`);
        
        for (let i = 0; i < batch.length; i++) {
          try {
            const photo = batch[i];
            const url = photo.url || photo.downloadURL || photo.imageUrl;
            const blob = await downloadImageAsBlob(url);
            
            if (blob.size > 0) {
              zip.file(\`photo-\${(b * BATCH_SIZE) + i + 1}.jpg\`, blob);
              totalAdded++;
            }
          } catch (err) {
            console.error('Photo failed:', err);
          }
          setDownloadProgress(\`ZIP \${b + 1}/\${batches.length}: \${i + 1}/\${batch.length} slik...\`);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, \`Kliksy-galerija-\${b + 1}.zip\`);
        
        if (b < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      
      setDownloadProgress('');
      
      if (totalAdded === 0) {
        alert('Nobena slika ni bila dodana v ZIP. Preverite konzolo za napake.');
      }
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
