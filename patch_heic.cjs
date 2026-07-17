const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /const heic2anyFn = await loadHeic2Any\(\);\s*const convertedBlob = await heic2anyFn\(\{[\s\S]*?\}\);\s*const blob = Array\.isArray\(convertedBlob\) \? convertedBlob\[0\] : convertedBlob;/,
    `setIsConvertingHeic(true);
                    try {
                      const heic2anyFn = await loadHeic2Any();
                      const convertedBlob = await heic2anyFn({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.8
                      });
                      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;`
  );
  
  content = content.replace(
    /uploadContentType = "image\/jpeg";\s*\}/,
    `uploadContentType = "image/jpeg";
                    } finally {
                      setIsConvertingHeic(false);
                    }
                  }`
  );
  
  fs.writeFileSync(file, content);
}

patch('src/pages/GuestView.tsx');
patch('src/pages/GuestViewHr.tsx');
patch('src/pages/GuestViewPl.tsx');
