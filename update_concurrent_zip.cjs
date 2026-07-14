const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /let fetchedCount = 0;[\s\S]*?await archive\.finalize\(\);/;

const concurrentCode = `let fetchedCount = 0;
      
      const MAX_CONCURRENT = 5;
      let activePromises = [];
      let currentIndex = 0;
      
      const processNext = async () => {
        if (currentIndex >= parsedPhotos.length) return;
        const i = currentIndex++;
        const photo = parsedPhotos[i];
        
        try {
          if (photo && photo.url && photo.url.startsWith('http')) {
            const response = await fetch(photo.url);
            if (response.ok) {
              const contentType = response.headers.get('content-type') || '';
              let extension = photo.type === 'video' ? 'mp4' : 'jpg';
              if (contentType && !contentType.includes('octet-stream')) {
                const split = contentType.split('/');
                if (split.length > 1) {
                  extension = split[1];
                  if (extension === 'jpeg') extension = 'jpg';
                }
              }
              const prefix = photo.type === 'video' ? 'video' : 'photo';
              const fileName = \`\${prefix}-\${i + 1}.\${extension}\`;
              
              const arrayBuffer = await response.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              
              archive.append(buffer, { name: fileName });
              fetchedCount++;
            }
          }
        } catch (e) {
          console.error(\`Failed to fetch photo \${i} for zip:\`, e.message);
        }
        
        await processNext();
      };
      
      for (let i = 0; i < MAX_CONCURRENT; i++) {
        activePromises.push(processNext());
      }
      
      await Promise.all(activePromises);
      await archive.finalize();`;

content = content.replace(regex, concurrentCode);
fs.writeFileSync('server.ts', content, 'utf8');
console.log('Updated with concurrent fetches');
