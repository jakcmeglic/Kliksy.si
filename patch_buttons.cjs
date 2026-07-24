const fs = require('fs');

function patch(file) {
  let content = fs.readFileSync(file, 'utf8');

  const oldButtonRegex = /<button[\s\S]*?onClick=\{handleDownloadAll\}[\s\S]*?<\/button>/m;
  
  if (!oldButtonRegex.test(content)) {
    console.log("Could not find button block in", file);
    return;
  }
  
  const newButtonCode = `<div className="flex flex-wrap items-center gap-3">
                   {photos.filter(f => !isVideo(f)).length > 0 && (
                     <button
                       onClick={handleDownloadPhotos}
                       disabled={isDownloading}
                       className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                     >
                       {isDownloading ? (
                         <div className="flex items-center gap-2">
                           <Loader2 className="w-5 h-5 animate-spin" />
                           <span className="text-sm">{downloadProgress}</span>
                         </div>
                       ) : <Download className="w-5 h-5" />}
                       📸 Prenesi fotografije ({photos.filter(f => !isVideo(f)).length})
                     </button>
                   )}
                   {photos.filter(f => isVideo(f)).length > 0 && (
                     <button
                       onClick={handleDownloadVideos}
                       disabled={isDownloading}
                       className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                     >
                       {isDownloading ? (
                         <div className="flex items-center gap-2">
                           <Loader2 className="w-5 h-5 animate-spin" />
                           <span className="text-sm">{downloadProgress}</span>
                         </div>
                       ) : <Download className="w-5 h-5" />}
                       🎥 Prenesi videe ({photos.filter(f => isVideo(f)).length})
                     </button>
                   )}
                 </div>`;

  content = content.replace(oldButtonRegex, newButtonCode);
  fs.writeFileSync(file, content);
  console.log("Patched buttons in", file);
}

['src/pages/Dashboard.tsx', 'src/pages/DashboardHr.tsx', 'src/pages/DashboardPl.tsx'].forEach(patch);
