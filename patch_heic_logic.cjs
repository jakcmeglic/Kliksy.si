const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  const oldCode = `              if (!isVideo) {
                try {
                  let fileForCompression = file;
                  
                  // Convert HEIC/HEIF to JPEG before compressing and uploading
                  if (
                    file.type === "image/heic" || 
                    file.type === "image/heif" || 
                    file.name.toLowerCase().endsWith(".heic") || 
                    file.name.toLowerCase().endsWith(".heif")
                  ) {
                    setIsConvertingHeic(true);
                    try {
                      
                      const convertedBlob = await heic2any({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.8
                      });
                      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                    
                    originalName = file.name.replace(/\\.heic$/i, ".jpg").replace(/\\.heif$/i, ".jpg");
                    fileForCompression = new File([blob], originalName, { type: "image/jpeg" });
                    uploadContentType = "image/jpeg";
                    } finally {
                      setIsConvertingHeic(false);
                    }
                  }
                  
                  const options = { maxSizeMB: 5, maxWidthOrHeight: 4000, useWebWorker: true };
                  fileToUpload = await imageCompression(fileForCompression, options);
                } catch (compressionError) {
                  // Fall back to original file if compression fails
                  console.error("Compression/Conversion error:", compressionError);
                }
              }`;

  const regex = /if \(!isVideo\) \{[\s\S]*?console\.error\("Compression\/Conversion error:", compressionError\);\s*\}\s*\}/;

  const newCode = `              if (!isVideo) {
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
                      const convertedBlob = await heic2any({
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

  content = content.replace(regex, newCode);
  fs.writeFileSync(file, content);
}

patch('src/pages/GuestView.tsx');
patch('src/pages/GuestViewHr.tsx');
patch('src/pages/GuestViewPl.tsx');
