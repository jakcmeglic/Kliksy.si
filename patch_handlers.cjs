const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  const oldFunctionMatch = content.match(/  const handleDownloadAll = async \(\) => \{[\s\S]*?setIsDownloading\(false\);\n    \}\n  \};/);
  
  if (!oldFunctionMatch) {
    console.log("Could not find handleDownloadAll in", file);
    return;
  }
  
  const isVideoStr = `
  const isVideo = (file: any) => {
    const url = (file.url || '').toLowerCase();
    const type = (file.type || '').toLowerCase();
    return url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') || url.includes('.webm') || type.includes('video');
  };
  `;

  const newCode = `  const handleDownloadPhotos = async () => {
    const photoFiles = photos.filter(f => !isVideo(f));
    if (photoFiles.length === 0) return;
    
    setIsDownloading(true);
    setDownloadError('');
    try {
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      
      const PHOTO_BATCH_SIZE = 500;
      const batches = [];
      for (let i = 0; i < photoFiles.length; i += PHOTO_BATCH_SIZE) {
        batches.push(photoFiles.slice(i, i + PHOTO_BATCH_SIZE));
      }
      
      alert(\`Fotografij za prenos: \${photoFiles.length}. Prenos bo razdeljen v \${batches.length} ZIP datotekah.\`);
      
      let totalAdded = 0;
      
      for (let b = 0; b < batches.length; b++) {
        const zip = new JSZip();
        const batch = batches[b];
        
        setDownloadProgress(\`Pripravljam ZIP fotografij \${b + 1}/\${batches.length}...\`);
        
        for (let i = 0; i < batch.length; i++) {
          try {
            const photo = batch[i];
            const url = photo.url || photo.downloadURL || photo.imageUrl;
            const blob = await downloadImageAsBlob(url);
            
            if (blob.size > 0) {
              zip.file(\`photo-\${(b * PHOTO_BATCH_SIZE) + i + 1}.jpg\`, blob);
              totalAdded++;
            }
          } catch (err) {
            console.error('Photo failed:', err);
          }
          setDownloadProgress(\`Pripravljam ZIP fotografij \${b + 1}/\${batches.length}: \${i + 1}/\${batch.length}...\`);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, \`Kliksy-fotografije-\${b + 1}.zip\`);
        
        if (b < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      
      setDownloadProgress('');
      
      if (totalAdded === 0) {
        alert('Nobena fotografija ni bila dodana v ZIP. Preverite konzolo za napake.');
      }
    } catch (err: any) {
      console.error('ZIP error:', err);
      alert('Napaka pri prenosu: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadVideos = async () => {
    const videoFiles = photos.filter(f => isVideo(f));
    if (videoFiles.length === 0) return;

    setIsDownloading(true);
    setDownloadError('');
    try {
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      
      const VIDEO_BATCH_SIZE = 10;
      const batches = [];
      for (let i = 0; i < videoFiles.length; i += VIDEO_BATCH_SIZE) {
        batches.push(videoFiles.slice(i, i + VIDEO_BATCH_SIZE));
      }
      
      alert(\`Videov za prenos: \${videoFiles.length}. Prenos bo razdeljen v \${batches.length} ZIP datotekah.\`);
      
      let totalAdded = 0;
      
      for (let b = 0; b < batches.length; b++) {
        const zip = new JSZip();
        const batch = batches[b];
        
        setDownloadProgress(\`Pripravljam ZIP videov \${b + 1}/\${batches.length}...\`);
        
        for (let i = 0; i < batch.length; i++) {
          try {
            const video = batch[i];
            const url = video.url || video.downloadURL || video.imageUrl;
            
            // For videos, fetch it normally
            const response = await fetch(url, { mode: 'cors' });
            const blob = await response.blob();
            
            if (blob.size > 0) {
              zip.file(\`video-\${(b * VIDEO_BATCH_SIZE) + i + 1}.mp4\`, blob);
              totalAdded++;
            }
          } catch (err) {
            console.error('Video failed:', err);
          }
          setDownloadProgress(\`Pripravljam ZIP videov \${b + 1}/\${batches.length}: \${i + 1}/\${batch.length}...\`);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, \`Kliksy-videi-\${b + 1}.zip\`);
        
        if (b < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      
      setDownloadProgress('');
      
      if (totalAdded === 0) {
        alert('Noben video ni bil dodan v ZIP. Preverite konzolo za napake.');
      }
    } catch (err: any) {
      console.error('ZIP error:', err);
      alert('Napaka pri prenosu: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };`;

  content = content.replace(oldFunctionMatch[0], isVideoStr + newCode);
  fs.writeFileSync(file, content);
  console.log("Patched handlers in", file);
}

['src/pages/Dashboard.tsx', 'src/pages/DashboardHr.tsx', 'src/pages/DashboardPl.tsx'].forEach(patch);
