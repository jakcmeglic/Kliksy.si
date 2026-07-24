const fs = require('fs');

function fixDashboard(file) {
  let content = fs.readFileSync(file, 'utf8');
  let replaced = content.replace(/<SmartImage\s+src=\{photo\.url\s*\|\|\s*photo\.downloadURL\s*\|\|\s*photo\.imageUrl\}\s+alt="Event photo"\s+className="w-full h-full object-cover transition duration-500 group-hover:scale-110"\s+\/>\s*<div className="absolute inset-0 bg-gradient-to-t from-black\/60 via-black\/0 to-black\/0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">/s,
  `{isVideo(photo) ? (
                        <video
                          src={photo.url || photo.downloadURL || photo.imageUrl}
                          controls={false}
                          muted
                          playsInline
                          preload="metadata"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          className="transition duration-500 group-hover:scale-110"
                          onMouseEnter={e => e.target.play()}
                          onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
                        />
                     ) : (
                        <SmartImage
                           src={photo.url || photo.downloadURL || photo.imageUrl}
                           alt="Event photo"
                           className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                        />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">`);
  // Note: we should remove the existing {isVideo(photo) && ...} overlay below if they want just the video tag.
  // Actually, they said "For video files, render a video element with poster/thumbnail instead of an img tag".
  // The play icon overlay might still be wanted, but they didn't say to remove it. Let's leave it.
  
  if (replaced !== content) {
    fs.writeFileSync(file, replaced);
    console.log("Fixed dashboard grid in", file);
  } else {
    console.log("Failed to fix dashboard grid in", file);
  }
}

fixDashboard('src/pages/Dashboard.tsx');
fixDashboard('src/pages/DashboardHr.tsx');
fixDashboard('src/pages/DashboardPl.tsx');
