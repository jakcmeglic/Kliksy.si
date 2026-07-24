const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add isVideo function if not exists
  if (!content.includes('const isVideo = (file: any) => {')) {
    content = content.replace(/(const \[allPhotos, setAllPhotos\] = useState<any\[\]>\(\[\]\);)/, 
      `$1\n  const isVideo = (file: any) => {\n    return file?.type === 'video' || file?.url?.includes('.mp4') || file?.downloadURL?.includes('.mp4') || file?.imageUrl?.includes('.mp4');\n  };\n`);
  }
  
  // Replace the video rendering in regular view
  const oldGrid = `{photo.type === 'video' ? (
                    <>
                      <video src={\`\${photo.url}#t=0.001\`} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                      <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full p-1">
                        <Play className="w-3 h-3 text-white fill-white" />
                      </div>
                    </>
                  ) : (
                    <SmartImage src={photo.url} alt="Wedding moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  )}`;

  const newGrid = `{isVideo(photo) ? (
                    <video
                      src={photo.url}
                      controls={false}
                      muted
                      playsInline
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                      onMouseLeave={e => { const v = (e.target as HTMLVideoElement); v.pause(); v.currentTime = 0; }}
                    />
                  ) : (
                    <SmartImage src={photo.url} alt="Wedding moment" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  )}`;
                  
  content = content.replace(oldGrid, newGrid);
  
  // Replace the video rendering in modal view (allPhotos map)
  const oldGrid2 = `{photo.type === 'video' ? (
                        <>
                          <video src={\`\${photo.url}#t=0.001\`} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full p-1 border border-white/10 shadow-sm pointer-events-none">
                            <Play className="w-3 h-3 text-white fill-white" />
                          </div>
                        </>
                      ) : (
                        <SmartImage src={photo.url} alt="Gallery item" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                      )}`;
                      
  const newGrid2 = `{isVideo(photo) ? (
                        <video
                          src={photo.url}
                          controls={false}
                          muted
                          playsInline
                          preload="metadata"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                          onMouseLeave={e => { const v = (e.target as HTMLVideoElement); v.pause(); v.currentTime = 0; }}
                        />
                      ) : (
                        <SmartImage src={photo.url} alt="Gallery item" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                      )}`;
                      
  content = content.replace(oldGrid2, newGrid2);
  
  // Replace video in full screen carousel (photo.type === 'video')
  const oldCarousel = `{photo.type === 'video' ? (
                        <video 
                          src={photo.url} 
                          className="w-full h-full object-contain" 
                          autoPlay={false} 
                          preload="metadata"
                          controls
                          muted 
                          loop 
                          playsInline 
                        />
                      ) : (
                        <SmartImage src={photo.url} alt="Gallery item" className="w-full h-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                      )}`;
                      
  const newCarousel = `{isVideo(photo) ? (
                        <video 
                          src={photo.url} 
                          className="w-full h-full object-contain" 
                          autoPlay={false} 
                          preload="metadata"
                          controls
                          muted 
                          loop 
                          playsInline 
                        />
                      ) : (
                        <SmartImage src={photo.url} alt="Gallery item" className="w-full h-full object-contain" referrerPolicy="no-referrer" loading="lazy" />
                      )}`;
                      
  content = content.replace(oldCarousel, newCarousel);
  
  fs.writeFileSync(file, content);
  console.log("Fixed", file);
}

fix('src/pages/GuestView.tsx');
fix('src/pages/GuestViewHr.tsx');
fix('src/pages/GuestViewPl.tsx');
