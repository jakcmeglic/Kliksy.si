const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /let fetchedCount = 0;[\s\S]*?await archive\.finalize\(\);/;

const streamCode = `let fetchedCount = 0;
      
      const { Readable } = require('stream');
      
      let clientDisconnected = false;
      req.on('close', () => { clientDisconnected = true; });
      
      for (let i = 0; i < parsedPhotos.length; i++) {
        if (clientDisconnected) break;
        
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
                 
                 archive.append(nodeStream, { name: fileName });
              });
              fetchedCount++;
            }
          }
        } catch (e) {
          console.error(\`Failed to fetch photo \${i} for zip:\`, e.message);
        }
      }
      
      if (!clientDisconnected) {
        await archive.finalize();
      }`;

content = content.replace(regex, streamCode);
fs.writeFileSync('server.ts', content, 'utf8');
console.log('Updated with proper break on disconnect');
