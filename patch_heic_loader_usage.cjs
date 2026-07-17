const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  const oldCode = `                    setIsConvertingHeic(true);
                    try {
                      const convertedBlob = await heic2any({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.8
                      });
                      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;`;

  const newCode = `                    setIsConvertingHeic(true);
                    try {
                      const heic2anyFn = await loadHeic2Any();
                      const convertedBlob = await heic2anyFn({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.8
                      });
                      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;`;

  content = content.replace(oldCode, newCode);
  fs.writeFileSync(file, content);
}

patch('src/pages/GuestView.tsx');
patch('src/pages/GuestViewHr.tsx');
patch('src/pages/GuestViewPl.tsx');
