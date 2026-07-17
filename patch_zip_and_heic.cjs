const fs = require('fs');

function patchDashboard(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  const oldCode = `      for (let i = 0; i < photos.length; i++) {
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
          setDownloadProgress('Pripravljam ZIP... X/Y slik'.replace('X', successCount.toString()).replace('Y', totalCount.toString()));
        } catch (err) {
          console.error("Failed to fetch image for ZIP:", photo.url, err);
        }
      }`;

  const newCode = `      console.log('Photos to zip:', photos.length, photos);
      
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        try {
          let freshUrl = photo.url;
          
          if (photo.url.includes('firebasestorage.googleapis.com')) {
             try {
                const decoded = decodeURIComponent(photo.url);
                const match = decoded.match(/\\/o\\/(.*?)\\?/);
                if (match && match[1]) {
                   const storagePath = match[1];
                   const storageRef = ref(storage, storagePath);
                   const directUrl = await import('firebase/storage').then(m => m.getDownloadURL(storageRef));
                   // Proxy the fresh URL to bypass CORS
                   freshUrl = \`/api/proxy-image?url=\${encodeURIComponent(directUrl)}&raw=1\`;
                } else {
                   freshUrl = \`/api/proxy-image?url=\${encodeURIComponent(photo.url)}&raw=1\`;
                }
             } catch (e) {
                console.error("Failed to get fresh url, falling back to original:", e);
                freshUrl = \`/api/proxy-image?url=\${encodeURIComponent(photo.url)}&raw=1\`;
             }
          }
          
          const response = await fetch(freshUrl);
          if (!response.ok) throw new Error(\`Fetch failed! status: \${response.status}\`);
          const blob = await response.blob();
          
          let extension = photo.type === 'video' ? 'mp4' : 'jpg';
          let filename = photo.url.split('?')[0].split('%2F').pop() || \`photo-\${i}.\${extension}\`;
          if (!filename.includes('.')) filename += \`.\${extension}\`;
          
          zip.file(filename, blob);
          successCount++;
          setDownloadProgress('Pripravljam ZIP... X/Y slik'.replace('X', successCount.toString()).replace('Y', totalCount.toString()));
        } catch (err) {
          console.error("Failed to add photo:", err, photo.url);
        }
      }
      
      console.log('Successfully added to ZIP:', successCount);`;

  if (content.includes("for (let i = 0; i < photos.length; i++) {")) {
     content = content.replace(oldCode, newCode);
     fs.writeFileSync(file, content);
     console.log("Patched", file);
  }
}

function patchGuestView(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  const oldCode = `                            if (!isVideo) {
                let fileForCompression = file;
                try {
                  if (
                    file.type === "image/heic" || 
                    file.type === "image/heif" || 
                    file.name.toLowerCase().endsWith(".heic") || 
                    file.name.toLowerCase().endsWith(".heif")
                  ) {
                    setIsConvertingHeic(true);
                    try {
                      const heic2anyFn = await loadHeic2Any();
                      const convertedBlob = await heic2anyFn({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.8
                      });
                      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                      
                      originalName = file.name.replace(/\\.heic$/i, ".jpg").replace(/\\.heif$/i, ".jpg");
                      fileForCompression = new File([blob], originalName, { type: "image/jpeg" });
                      uploadContentType = "image/jpeg";
                      fileToUpload = fileForCompression; // ensure fallback uses this
                    } catch (heicErr) {
                      console.error("HEIC conversion failed:", heicErr);
                    } finally {
                      setIsConvertingHeic(false);
                    }
                  }
                  
                  const options = { maxSizeMB: 5, maxWidthOrHeight: 4000, useWebWorker: true };
                  fileToUpload = await imageCompression(fileForCompression, options);
                } catch (compressionError) {
                  console.error("Compression error:", compressionError);
                  fileToUpload = fileForCompression; // Fall back to converted jpeg if compression fails
                }
              }`;

  const newCode = `              if (!isVideo) {
                const isHeic = file.type === "image/heic" || 
                               file.type === "image/heif" || 
                               file.name.toLowerCase().endsWith(".heic") || 
                               file.name.toLowerCase().endsWith(".heif");
                if (isHeic) {
                  setIsConvertingHeic(true);
                  try {
                    const heic2anyFn = await loadHeic2Any();
                    const convertedBlob = await heic2anyFn({
                      blob: file,
                      toType: "image/jpeg",
                      quality: 0.7
                    });
                    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                    
                    originalName = file.name.replace(/\\.heic$/i, ".jpg").replace(/\\.heif$/i, ".jpg");
                    fileToUpload = new File([blob], originalName, { type: "image/jpeg" });
                    uploadContentType = "image/jpeg";
                  } catch (heicErr) {
                    console.error("HEIC conversion failed:", heicErr);
                    // Fallback to original if conversion fails
                    fileToUpload = file;
                  } finally {
                    setIsConvertingHeic(false);
                  }
                } else {
                  try {
                    const options = { maxSizeMB: 5, maxWidthOrHeight: 4000, useWebWorker: true };
                    fileToUpload = await imageCompression(file, options);
                  } catch (compressionError) {
                    console.error("Compression error:", compressionError);
                    fileToUpload = file;
                  }
                }
              }`;

  if (content.includes("if (!isVideo) {")) {
     content = content.replace(oldCode, newCode);
     fs.writeFileSync(file, content);
     console.log("Patched GuestView", file);
  }
}

['src/pages/Dashboard.tsx', 'src/pages/DashboardHr.tsx', 'src/pages/DashboardPl.tsx'].forEach(patchDashboard);
['src/pages/GuestView.tsx', 'src/pages/GuestViewHr.tsx', 'src/pages/GuestViewPl.tsx'].forEach(patchGuestView);
