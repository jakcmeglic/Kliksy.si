const fs = require('fs');

function restoreTabs(file, isPl, isHr) {
  let content = fs.readFileSync(file, 'utf8');

  // Strip anything between <div className="max-w-5xl mx-auto"> and QRModal
  const replaceRegex = new RegExp(`<div className="max-w-5xl mx-auto">[\\s\\S]*?<QRModal`);

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
                 <button
                   onClick={handleDownloadAll}
                   disabled={isDownloading || photos.length === 0}
                   className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                 >
                   {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                   Prenesi vse (ZIP)
                 </button>
               </div>
               
               {downloadError && (
                 <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                   {downloadError}
                 </div>
               )}

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {photos.map((photo, i) => (
                   <motion.div
                     key={photo.id}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.05 }}
                     className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative cursor-pointer group"
                     onClick={() => setSelectedImageIndex(i)}
                   >
                     {photo.type === 'video' ? (
                        <>
                          <video src={\`\${photo.url}#t=0.001\`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" muted playsInline preload="metadata" />
                          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full p-2">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </>
                     ) : (
                        <img 
                          src={photo.url} 
                          alt="Moment" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy" 
                        />
                     )}
                     <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full pointer-events-none">
                        <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                        <span className="text-white text-xs font-bold">{photo.likes || 0}</span>
                     </div>
                   </motion.div>
                 ))}
                 
                 {photos.length === 0 && (
                   <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-3xl border border-gray-100 border-dashed">
                     Še ni slik. Delite QR kodo z gosti!
                   </div>
                 )}
               </div>
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
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="guestViewSettings" 
                        value="all" 
                        checked={guestViewSettings === 'all'} 
                        onChange={() => setGuestViewSettings('all')}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">Vse slike</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="guestViewSettings" 
                        value="own" 
                        checked={guestViewSettings === 'own'} 
                        onChange={() => setGuestViewSettings('own')}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">Samo svoje slike</span>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Če izberete "Samo svoje slike", gostje v galeriji (ko skenirajo kodo) ne bodo videli slik drugih gostov, ampak samo tiste, ki so jih sami naložili.</p>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={async () => {
                      if (!event) return;
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

        </div>
      </main>

      <QRModal`;

  if (isPl) {
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
          .replaceAll('Še ni slik. Delite QR kodo z gosti!', 'Brak zdjęć. Udostępnij kod QR gościom!')
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
          .replaceAll('Če izberete "Samo svoje slike", gostje v galeriji (ko skenirajo kodo) ne bodo videli slik drugih gostov, ampak samo tiste, ki so jih sami naložili.', 'Jeśli wybierzesz "Tylko własne zdjęcia", goście w galerii nie zobaczą zdjęć innych gości, a jedynie te, które sami dodali.');
  } else if (isHr) {
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
          .replaceAll('Še ni slik. Delite QR kodo z gosti!', 'Još nema slika. Podijelite QR kod s gostima!')
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
          .replaceAll('Če izberete "Samo svoje slike", gostje v galeriji (ko skenirajo kodo) ne bodo videli slik drugih gostov, ampak samo tiste, ki so jih sami naložili.', 'Ako odaberete "Samo svoje slike", gosti u galeriji (kada skeniraju kod) neće vidjeti slike drugih gostiju, već samo one koje su sami uvezli.');
  }

  content = content.replace(replaceRegex, missingUI);

  fs.writeFileSync(file, content, 'utf8');
}

restoreTabs('src/pages/DashboardPl.tsx', true, false);
