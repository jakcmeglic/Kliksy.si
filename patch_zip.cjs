const fs = require('fs');

function patch(file, progressText, generatingText, errorText) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add imports if they don't exist
  if (!content.includes('import JSZip from')) {
    content = content.replace(/import {([^}]+)} from "react";/, 'import {$1} from "react";\nimport JSZip from "jszip";\nimport { saveAs } from "file-saver";');
  }

  // Replace handleDownloadAll
  const zipLogic = `const handleDownloadAll = async () => {
    if (photos.length === 0) return;
    setIsDownloading(true);
    setDownloadError('');
    setDownloadProgress('${progressText}'.replace('X', '0').replace('Y', photos.length.toString()));

    try {
      const eventNameStr = event.eventType === 'poroka' || !event.eventType ? \`\${event.partner1}-\${event.partner2}\` : event.eventName;
      const dateStr = new Date(event.eventDate).toISOString().split('T')[0];
      const zipFilename = \`Kliksy-\${eventNameStr}-\${dateStr}.zip\`;
      
      const zip = new JSZip();
      
      let successCount = 0;
      let totalCount = photos.length;

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        try {
          const fetchUrl = photo.url.includes('firebasestorage.googleapis.com') ? \`/api/proxy-image?url=\${encodeURIComponent(photo.url)}&raw=1\` : photo.url;
          const response = await fetch(fetchUrl);
          if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
          const blob = await response.blob();
          
          let extension = photo.type === 'video' ? 'mp4' : 'jpg';
          let filename = photo.url.split('?')[0].split('%2F').pop() || \`photo-\${i}.\${extension}\`;
          if (!filename.includes('.')) filename += \`.\${extension}\`;
          
          zip.file(filename, blob);
          successCount++;
          setDownloadProgress('${progressText}'.replace('X', successCount.toString()).replace('Y', totalCount.toString()));
        } catch (err) {
          console.error("Failed to fetch image for ZIP:", photo.url, err);
        }
      }
      
      setDownloadProgress('${generatingText}');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, zipFilename);
      
      setIsDownloading(false);
      setDownloadProgress('');
    } catch (error) {
      console.error("Error generating zip:", error);
      setDownloadError('${errorText}');
      setIsDownloading(false);
    }
  };`;
  
  content = content.replace(/const handleDownloadAll = async \(\) => \{[\s\S]*?^  \};/m, zipLogic);
  fs.writeFileSync(file, content);
}

patch('src/pages/Dashboard.tsx', 'Pripravljam ZIP... X/Y slik', 'Ustvarjam datoteko...', 'Prišlo je do napake pri prenosu. Poskusite znova.');
patch('src/pages/DashboardHr.tsx', 'Pripremam ZIP... X/Y slika', 'Stvaranje datoteke...', 'Došlo je do greške prilikom preuzimanja. Pokušajte ponovno.');
patch('src/pages/DashboardPl.tsx', 'Przygotowuję ZIP... X/Y zdjęć', 'Tworzenie pliku...', 'Wystąpił błąd podczas pobierania. Spróbuj ponownie.');

