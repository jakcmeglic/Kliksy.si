const fs = require('fs');

function revert(lang) {
  let file = 'src/pages/Dashboard.tsx';
  if (lang === 'hr') file = 'src/pages/DashboardHr.tsx';
  if (lang === 'pl') file = 'src/pages/DashboardPl.tsx';
  
  let content = fs.readFileSync(file, 'utf8');
  
  // 1. Get missingUI from restore_dashboards.cjs logic
  let missingUI = `<div className="max-w-5xl mx-auto">
          {event.paymentStatus !== 'paid' && (
            <div className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">To je Demo predogled</h3>
                <p className="text-gray-600 text-sm max-w-xl">
                  Vaš dogodek je trenutno v demo načinu in omejen na maksimalno 5 slik. Za polno izkušnjo nadgradite paket.
                </p>
              </div>
              <button 
                onClick={() => navigate(\`/checkout/\${event.id}\`)} 
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Nadgradi zdaj
              </button>
            </div>
          )}

          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                      <stat.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                  <div className="w-[180px] h-[180px] relative" id="raw-qr-code-svg-container">
                    <QRCodeSVG
                      id="raw-qr-code-svg"
                      value={eventUrl}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-bold text-2xl text-gray-900 mb-2">QR koda dogodka</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto md:mx-0">
                    Natisnite jo in postavite na mize. Gostje jo skenirajo z aplikacijo kamere na telefonu.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      onClick={() => setIsQRModalOpen(true)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                      Natisni dizajne
                    </button>
                    <button
                      onClick={handleDownloadRawQR}
                      className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Prenesi samo kodo
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">Povezava do galerije</h3>
                <p className="text-gray-500 mb-6">Povezavo lahko pošljete tudi tistim, ki ne morejo skenirati kode.</p>
                <div className="flex bg-gray-50 p-2 border border-gray-200 rounded-xl max-w-md mx-auto">
                  <input type="text" readOnly value={eventUrl} className="bg-transparent flex-1 px-3 text-gray-600 outline-none truncate" />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(eventUrl);
                      alert("Povezava kopirana!");
                    }}
                    className="px-4 py-2 bg-white rounded-lg shadow-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
                  >
                    Kopiraj
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
            >
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                 <div>
                   <h3 className="font-bold text-xl text-gray-900">Vse slike dogodka</h3>
                   <p className="text-gray-500 text-sm">Gledate {photos.length} slik</p>
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

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {photos.map((photo, i) => (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.05 }}
                     key={photo.id} 
                     className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm cursor-pointer"
                     onClick={() => setSelectedImageIndex(i)}
                   >
                     <SmartImage
                        src={photo.url || photo.downloadURL || photo.imageUrl}
                        alt="Event photo"
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <div className="flex items-center justify-between">
                           <p className="text-white text-sm font-medium truncate max-w-[120px]">{photo.uploadedBy || 'Gost'}</p>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleToggleLike(photo.id);
                             }}
                             className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-colors flex items-center gap-1.5"
                           >
                             <Heart className={\`w-4 h-4 \${photo.likedBy?.includes(user?.uid) ? 'fill-white text-white' : 'text-white'}\`} />
                             {photo.likes > 0 && <span className="text-white text-xs font-medium">{photo.likes}</span>}
                           </button>
                        </div>
                     </div>
                     {isVideo(photo) && (
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center">
                           <Play className="w-5 h-5 text-white ml-1" />
                         </div>
                       </div>
                     )}
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         if(window.confirm('Ali ste prepričani, da želite izbrisati to sliko?')) {
                           deletePhoto(photo);
                         }
                       }}
                       className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </motion.div>
                 ))}
               </div>
               
               {photos.length === 0 && (
                 <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                     <ImageIcon className="w-10 h-10 text-gray-300" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Brez fotografij</h3>
                   <p className="text-gray-500">Trenutno še ni naloženih fotografij. Delite povezavo z gosti!</p>
                 </div>
               )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl"
            >
              <h3 className="font-bold tracking-tight text-xl mb-6 text-gray-900">Nastavitve dogodka</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Ime dogodka</label>
                  <input 
                    type="text" 
                    defaultValue={event.eventType === 'poroka' || !event.eventType ? \`\${event.partner1} & \${event.partner2}\` : event.eventName}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Datum</label>
                  <input 
                    type="date" 
                    defaultValue={event.date}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Pozdravno sporočilo za goste</label>
                  <textarea 
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Kdo lahko vidi slike v galeriji na telefonu gosta?</label>
                  <select 
                    value={guestViewSettings}
                    onChange={(e) => setGuestViewSettings(e.target.value as 'all' | 'own')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-gray-900 bg-white"
                  >
                    <option value="all">Vse slike</option>
                    <option value="own">Samo svoje slike</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">
                    Če izberete "Samo svoje slike", gostje v galeriji (ko skenirajo kodo) ne bodo videli slik drugih gostov, ampak samo tiste, ki so jih sami naložili.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={async () => {
                      setIsSavingSettings(true);
                      try {
                        const eventDocRef = doc(db, "events", event.id);
                        await updateDoc(eventDocRef, { welcomeMessage, guestViewSettings });
                        setEvent({ ...event, welcomeMessage, guestViewSettings });
                        alert('Spremembe so bile uspešno shranjene!');
                      } catch (err) {
                        console.error("Error saving settings:", err);
                        alert('Prišlo je do napake pri shranjevanju.');
                      } finally {
                        setIsSavingSettings(false);
                      }
                    }}
                    disabled={isSavingSettings}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 min-w-[180px]"
                  >
                    {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Shrani spremembe"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </div>`;

  if (lang === 'pl') {
      missingUI = missingUI.replaceAll('To je Demo predogled', 'To jest podgląd Demo')
          .replaceAll('Vaš dogodek je trenutno v demo načinu in omejen na maksimalno 5 slik. Za polno izkušnjo nadgradite paket.', 'Twoje wydarzenie jest w trybie demo i ograniczone do 5 zdjęć. Zaktualizuj pakiet, aby uzyskać pełne wrażenia.')
          .replaceAll('Nadgradi zdaj', 'Zaktualizuj teraz')
          .replaceAll('QR koda dogodka', 'Kod QR wydarzenia')
          .replaceAll('Natisnite jo in postavite na mize. Gostje jo skenirajo z aplikacijo kamere na telefonu.', 'Wydrukuj i połóż na stołach. Goście skanują go aplikacją aparatu na swoich telefonach.')
          .replaceAll('Natisni dizajne', 'Drukuj projekty')
          .replaceAll('Prenesi samo kodo', 'Pobierz tylko kod')
          .replaceAll('Povezava do galerije', 'Link do galerii')
          .replaceAll('Povezavo lahko pošljete tudi tistim, ki ne morejo skenirati kode.', 'Możesz wysłać link tym, którzy nie mogą zeskanować kodu.')
          .replaceAll('Kopiraj', 'Kopiuj')
          .replaceAll('Povezava kopirana!', 'Link skopiowany!')
          .replaceAll('Vse slike dogodka', 'Wszystkie zdjęcia wydarzenia')
          .replaceAll('Gledate ', 'Oglądasz ')
          .replaceAll(' slik', ' zdjęć')
          .replaceAll('Prenesi vse (ZIP)', 'Pobierz wszystko (ZIP)')
          .replaceAll('Brez fotografij', 'Brak zdjęć')
          .replaceAll('Trenutno še ni naloženih fotografij. Delite povezavo z gosti!', 'Brak zdjęć. Udostępnij kod QR gościom!')
          .replaceAll('Nastavitve dogodka', 'Ustawienia wydarzenia')
          .replaceAll('Ime dogodka', 'Nazwa wydarzenia')
          .replaceAll('Datum', 'Data')
          .replaceAll('Pozdravno sporočilo za goste', 'Wiadomość powitalna dla gości')
          .replaceAll('Spremembe so bile uspešno shranjene!', 'Zmiany zostały pomyślnie zapisane!')
          .replaceAll('Prišlo je do napake pri shranjevanju.', 'Wystąpił błąd podczas zapisywania.')
          .replaceAll('Shrani spremembe', 'Zapisz zmiany')
          .replaceAll('Kdo lahko vidi slike v galeriji na telefonu gosta?', 'Kto może zobaczyć zdjęcia w galerii na telefonie gościa?')
          .replaceAll('Vse slike', 'Wszystkie zdjęcia')
          .replaceAll('Samo svoje slike', 'Tylko własne zdjęcia')
          .replaceAll('Če izberete "Samo svoje slike", gostje v galeriji (ko skenirajo kodo) ne bodo videli slik drugih gostov, ampak samo tiste, ki so jih sami naložili.', 'Jeśli wybierzesz "Tylko własne zdjęcia", goście w galerii nie zobaczą zdjęć innych gości, a jedynie te, które sami dodali.')
          .replaceAll('Ali ste prepričani, da želite izbrisati to sliko?', 'Czy na pewno chcesz usunąć to zdjęcie?')
          .replaceAll('Gost', 'Gość');
          
      missingUI = missingUI.replaceAll('📸 Prenesi fotografije', '📸 Pobierz zdjęcia')
                           .replaceAll('🎥 Prenesi videe', '🎥 Pobierz filmy');
  } else if (lang === 'hr') {
      missingUI = missingUI.replaceAll('To je Demo predogled', 'Ovo je Demo pregled')
          .replaceAll('Vaš dogodek je trenutno v demo načinu in omejen na maksimalno 5 slik. Za polno izkušnjo nadgradite paket.', 'Vaš događaj je u demo načinu i ograničen na 5 slika. Za puno iskustvo nadogradite paket.')
          .replaceAll('Nadgradi zdaj', 'Nadogradi sada')
          .replaceAll('QR koda dogodka', 'QR kod događaja')
          .replaceAll('Natisnite jo in postavite na mize. Gostje jo skenirajo z aplikacijo kamere na telefonu.', 'Isprintajte ga i stavite na stolove. Gosti ga skeniraju aplikacijom kamere na svojim telefonima.')
          .replaceAll('Natisni dizajne', 'Ispiši dizajne')
          .replaceAll('Prenesi samo kodo', 'Preuzmi samo kod')
          .replaceAll('Povezava do galerije', 'Link do galerije')
          .replaceAll('Povezavo lahko pošljete tudi tistim, ki ne morejo skenirati kode.', 'Link možete poslati i onima koji ne mogu skenirati kod.')
          .replaceAll('Kopiraj', 'Kopiraj')
          .replaceAll('Povezava kopirana!', 'Link kopiran!')
          .replaceAll('Vse slike dogodka', 'Sve slike događaja')
          .replaceAll('Gledate ', 'Prikazuje se ')
          .replaceAll(' slik', ' slika')
          .replaceAll('Prenesi vse (ZIP)', 'Preuzmi sve (ZIP)')
          .replaceAll('Brez fotografij', 'Nema fotografija')
          .replaceAll('Trenutno še ni naloženih fotografij. Delite povezavo z gosti!', 'Još nema slika. Podijelite QR kod s gostima!')
          .replaceAll('Nastavitve dogodka', 'Postavke događaja')
          .replaceAll('Ime dogodka', 'Ime događaja')
          .replaceAll('Datum', 'Datum')
          .replaceAll('Pozdravno sporočilo za goste', 'Poruka dobrodošlice za goste')
          .replaceAll('Spremembe so bile uspešno shranjene!', 'Promjene su uspješno spremljene!')
          .replaceAll('Prišlo je do napake pri shranjevanju.', 'Došlo je do pogreške pri spremanju.')
          .replaceAll('Shrani spremembe', 'Spremi promjene')
          .replaceAll('Kdo lahko vidi slike v galeriji na telefonu gosta?', 'Tko može vidjeti slike u galeriji na telefonu gosta?')
          .replaceAll('Vse slike', 'Sve slike')
          .replaceAll('Samo svoje slike', 'Samo svoje slike')
          .replaceAll('Če izberete "Samo svoje slike", gostje v galeriji (ko skenirajo kodo) ne bodo videli slik drugih gostov, ampak samo tiste, ki so jih sami naložili.', 'Ako odaberete "Samo svoje slike", gosti u galeriji (kada skeniraju kod) neće vidjeti slike drugih gostiju, već samo one koje su sami uvezli.')
          .replaceAll('Ali ste prepričani, da želite izbrisati to sliko?', 'Jeste li sigurni da želite obrisati ovu sliku?')
          .replaceAll('Gost', 'Gost');
          
      missingUI = missingUI.replaceAll('📸 Prenesi fotografije', '📸 Preuzmi fotografije')
                           .replaceAll('🎥 Prenesi videe', '🎥 Preuzmi videe');
  }

  // Find the exact place to replace
  // In the file, we have:
  // <main className="flex-1 max-h-screen overflow-y-auto">
  //   <div className="max-w-7xl mx-auto p-4 md:p-8">
  //     {activeTab === 'gallery' && (
  // We need to replace EVERYTHING from <main className="flex-1 max-h-screen overflow-y-auto"> to </main>
  
  let mainRegex = /<main className="flex-1 max-h-screen overflow-y-auto">[\s\S]*?<\/main>/;
  if (!mainRegex.test(content)) {
    console.log("Could not find <main> in", file);
    return;
  }
  
  let newMain = `<main className="flex-1 max-h-screen overflow-y-auto p-4 md:p-8">
        ${missingUI}
      </main>`;
      
  content = content.replace(mainRegex, newMain);
  
  // Now we need to insert the Overview button into the sidebar.
  // Look for:
  // <nav className="mt-4 px-4 pb-4">
  //   <ul className="space-y-1.5">
  //     <li>
  //       <button
  //         onClick={() => setActiveTab('gallery')}
  let ovText = 'Nadzorna plošča';
  if (lang === 'hr') ovText = 'Nadzorna ploča';
  if (lang === 'pl') ovText = 'Panel główny';
  
  let ovButton = `<li>
              <button
                onClick={() => setActiveTab('overview')}
                className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition \${
                  activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }\`}
              >
                <LayoutGrid className="w-5 h-5" /> ${ovText}
              </button>
            </li>
            `;
            
  content = content.replace(/(<ul className="space-y-1\.5">\s*)/, `$1${ovButton}`);
  
  // Add LayoutGrid to imports if missing
  if (!content.includes('LayoutGrid')) {
    content = content.replace(/import \{([^}]+)\}\s+from\s+['"]lucide-react['"];/, (match, p1) => {
      let imports = p1.split(',').map(s => s.trim());
      if (!imports.includes('LayoutGrid')) {
        imports.push('LayoutGrid');
      }
      return `import { ${imports.join(', ')} } from "lucide-react";`;
    });
  }

  fs.writeFileSync(file, content);
  console.log("Restored", file);
}

revert('sl');
revert('hr');
revert('pl');
