const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /let fetchedCount = 0;[\s\S]*?await archive\.finalize\(\);/;

const streamCode = `let fetchedCount = 0;
      
      const { Readable } = require('stream');
      
      for (let i = 0; i < parsedPhotos.length; i++) {
        const photo = parsedPhotos[i];
        try {
          if (photo && photo.url && photo.url.startsWith('http')) {
            const response = await fetch(photo.url);
            if (response.ok && response.body) {
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
              
              await new Promise((resolve) => {
                 const nodeStream = Readable.fromWeb(response.body);
                 nodeStream.on('end', resolve);
                 nodeStream.on('error', resolve);
                 
                 // If the client aborts the request, we should abort the fetch
                 req.on('close', resolve);
                 
                 archive.append(nodeStream, { name: fileName });
              });
              fetchedCount++;
            }
          }
        } catch (e) {
          console.error(\`Failed to fetch photo \${i} for zip:\`, e.message);
        }
      }
      
      await archive.finalize();`;

content = content.replace(regex, streamCode);
fs.writeFileSync('server.ts', content, 'utf8');
console.log('Updated with proper streaming backpressure');
