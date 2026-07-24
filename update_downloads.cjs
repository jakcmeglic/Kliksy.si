const fs = require('fs');

function updateFile(file, lang) {
  let content = fs.readFileSync(file, 'utf8');

  let preverjam = 'Preverjam velikosti videov...';
  let alert1 = 'Videov za prenos: ${videoFiles.length}. Prenos bo razdeljen v ${batches.length} ZIP datotekah (500-700MB vsaka).';
  let prip1 = 'Pripravljam ZIP videov ${b + 1}/${batches.length}...';
  let prip2 = 'Pripravljam ZIP videov ${b + 1}/${batches.length}: ${i + 1}/${batch.length} videov...';
  let noAdded = 'Noben video ni bil dodan v ZIP. Preverite konzolo za napake.';
  let napaka = 'Napaka pri prenosu: ';
  
  if (lang === 'hr') {
    preverjam = 'Provjeravam veličine videa...';
    alert1 = 'Videa za preuzimanje: ${videoFiles.length}. Preuzimanje će biti podijeljeno u ${batches.length} ZIP datoteka (500-700MB svaka).';
    prip1 = 'Pripremam ZIP videa ${b + 1}/${batches.length}...';
    prip2 = 'Pripremam ZIP videa ${b + 1}/${batches.length}: ${i + 1}/${batch.length} videa...';
    noAdded = 'Nijedan video nije dodan u ZIP. Provjerite konzolu za greške.';
    napaka = 'Greška pri preuzimanju: ';
  } else if (lang === 'pl') {
    preverjam = 'Sprawdzanie rozmiarów wideo...';
    alert1 = 'Wideo do pobrania: ${videoFiles.length}. Pobieranie zostanie podzielone na ${batches.length} plików ZIP (500-700MB każdy).';
    prip1 = 'Przygotowywanie pliku ZIP z wideo ${b + 1}/${batches.length}...';
    prip2 = 'Przygotowywanie pliku ZIP z wideo ${b + 1}/${batches.length}: ${i + 1}/${batch.length} wideo...';
    noAdded = 'Żadne wideo nie zostało dodane do ZIP. Sprawdź konsolę pod kątem błędów.';
    napaka = 'Błąd podczas pobierania: ';
  }

  const newFunction = `  const getFileSize = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      const size = response.headers.get('content-length');
      return size ? parseInt(size) : 50 * 1024 * 1024; // default 50MB if unknown
    } catch {
      return 50 * 1024 * 1024; // default 50MB on error
    }
  };

  const MAX_BATCH_SIZE = 600 * 1024 * 1024; // 600MB target

  const buildVideoBatches = async (videoFiles: any[]) => {
    const batches = [];
    let currentBatch = [];
    let currentSize = 0;

    for (const video of videoFiles) {
      const url = video.url || video.downloadURL || video.imageUrl;
      const fileSize = await getFileSize(url);

      if (currentSize + fileSize > MAX_BATCH_SIZE && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [video];
        currentSize = fileSize;
      } else {
        currentBatch.push(video);
        currentSize += fileSize;
      }
    }

    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  };

  const handleDownloadVideos = async () => {
    const videoFiles = photos.filter(f => isVideo(f));
    if (videoFiles.length === 0) return;

    setIsDownloading(true);
    setDownloadError('');
    setDownloadProgress('${preverjam}');

    try {
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      
      const batches = await buildVideoBatches(videoFiles);
      
      alert(\`${alert1}\`);
      
      let totalAdded = 0;
      let globalIndex = 0;
      
      for (let b = 0; b < batches.length; b++) {
        const zip = new JSZip();
        const batch = batches[b];
        
        setDownloadProgress(\`${prip1}\`);
        
        for (let i = 0; i < batch.length; i++) {
          try {
            const video = batch[i];
            const url = video.url || video.downloadURL || video.imageUrl;
            
            // For videos, fetch it normally
            const response = await fetch(url, { mode: 'cors' });
            const blob = await response.blob();
            
            if (blob.size > 0) {
              zip.file(\`video-\${globalIndex + 1}.mp4\`, blob);
              totalAdded++;
              globalIndex++;
            }
          } catch (err) {
            console.error('Video failed:', err);
            globalIndex++;
          }
          setDownloadProgress(\`${prip2}\`);
        }
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, \`Kliksy-videi-\${b + 1}.zip\`);
        
        if (b < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      
      setDownloadProgress('');
      
      if (totalAdded === 0) {
        alert('${noAdded}');
      }
    } catch (err: any) {
      console.error('ZIP error:', err);
      alert('${napaka}' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };`;

  // Find where handleDownloadVideos starts and ends
  const startIndex = content.indexOf('  const handleDownloadVideos = async () => {');
  let endIndex = content.indexOf('  return (', startIndex);
  if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find boundaries in", file);
    return;
  }
  
  const originalFunction = content.substring(startIndex, endIndex);
  content = content.replace(originalFunction, newFunction + '\n\n');
  fs.writeFileSync(file, content);
  console.log("Updated", file);
}

updateFile('src/pages/Dashboard.tsx', 'sl');
updateFile('src/pages/DashboardHr.tsx', 'hr');
updateFile('src/pages/DashboardPl.tsx', 'pl');
