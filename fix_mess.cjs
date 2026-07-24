const fs = require('fs');

function restore(file, lang) {
  let content = fs.readFileSync(file, 'utf8');

  const brokenRegex = /\{event\.paymentStatus === 'paid' && event\.plan !== 'premium' && \([\s\S]*?\{downloadError && \([\s\S]*?<\/div>\n\s*\)\}\n/m;
  
  if (!brokenRegex.test(content)) {
    console.log("Could not find broken block in", file);
    return;
  }
  
  let texts = {
    upgradePkg: 'Nadgradi paket',
    preview: 'Predogled',
    gallery: 'Galerija',
    qr: 'QR Koda',
    settings: 'Nastavitve',
    upgrade: 'Nadgradi',
    logout: 'Odjavi se',
    allPhotosTitle: 'Vse slike dogodka',
    viewingPhotos: 'Gledate ${photos.length} slik'
  };

  if (lang === 'hr') {
    texts = {
      upgradePkg: 'Nadogradi paket',
      preview: 'Pregled',
      gallery: 'Galerija',
      qr: 'QR Kod',
      settings: 'Postavke',
      upgrade: 'Nadogradi',
      logout: 'Odjava',
      allPhotosTitle: 'Sve slike događaja',
      viewingPhotos: 'Prikazuje se ${photos.length} slika'
    };
  } else if (lang === 'pl') {
    texts = {
      upgradePkg: 'Ulepsz pakiet',
      preview: 'Podgląd',
      gallery: 'Galeria',
      qr: 'Kod QR',
      settings: 'Ustawienia',
      upgrade: 'Ulepsz',
      logout: 'Wyloguj się',
      allPhotosTitle: 'Wszystkie zdjęcia wydarzenia',
      viewingPhotos: 'Oglądasz ${photos.length} zdjęć'
    };
  }

  const restored = `{event.paymentStatus === 'paid' && event.plan !== 'premium' && (
                  <button onClick={() => navigate('/upgrade')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                    ${texts.upgradePkg} <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => window.open(\`/\${event.id}\`, '_blank')} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition">
              <ExternalLink className="w-4 h-4" /> ${texts.preview}
            </button>
          </div>
        </div>

        <nav className="mt-4 px-4 pb-4">
          <ul className="space-y-1.5">
            <li>
              <button
                onClick={() => setActiveTab('gallery')}
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition \${
                  activeTab === 'gallery' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }\`}
              >
                <ImageIcon className="w-5 h-5" /> ${texts.gallery} ({photos.length})
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('qr')}
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition \${
                  activeTab === 'qr' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }\`}
              >
                <QrCode className="w-5 h-5" /> ${texts.qr}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition \${
                  activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }\`}
              >
                <Settings className="w-5 h-5" /> ${texts.settings}
              </button>
            </li>
            {event.paymentStatus !== 'paid' && (
              <li>
                <button
                  onClick={() => navigate('/upgrade')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition shadow-sm mt-4"
                >
                  <span className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" /> ${texts.upgrade} 
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              </li>
            )}
          </ul>
        </nav>
        
        <div className="mt-auto p-6">
          <button
            onClick={() => auth.signOut()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition"
          >
            <LogOut className="w-4 h-4" /> ${texts.logout}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {activeTab === 'gallery' && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
            >
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <div>
                   <h3 className="font-bold text-xl text-gray-900">${texts.allPhotosTitle}</h3>
                   <p className="text-gray-500 text-sm">\`${texts.viewingPhotos}\`</p>
                 </div>
                 <div className="flex flex-wrap items-center gap-3">
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
                 </div>
               </div>
               
               {downloadError && (
                 <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                   {downloadError}
                 </div>
               )}
`;

  content = content.replace(brokenRegex, restored);
  fs.writeFileSync(file, content);
  console.log("Restored UI in", file);
}

restore('src/pages/Dashboard.tsx', 'sl');
restore('src/pages/DashboardHr.tsx', 'hr');
restore('src/pages/DashboardPl.tsx', 'pl');
