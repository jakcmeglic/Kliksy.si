const fs = require('fs');

function modifyDashboard(file, isPl, isHr) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add state variable
  content = content.replace(
    /const \[welcomeMessage, setWelcomeMessage\] = useState\(""\);/,
    `const [welcomeMessage, setWelcomeMessage] = useState("");\n  const [guestViewSettings, setGuestViewSettings] = useState<'all' | 'own'>('all');`
  );

  // 2. Initialize state in useEffect
  content = content.replace(
    /setWelcomeMessage\(event\.welcomeMessage \|\| [^\)]+\)\);/,
    (match) => `${match}\n      setGuestViewSettings(event.guestViewSettings || 'all');`
  );

  // 3. Add to updateDoc call
  content = content.replace(
    /await updateDoc\(eventDocRef, { welcomeMessage }\);/,
    `await updateDoc(eventDocRef, { welcomeMessage, guestViewSettings });`
  );

  // 4. Update local event state
  content = content.replace(
    /setEvent\({ \.\.\.event, welcomeMessage }\);/,
    `setEvent({ ...event, welcomeMessage, guestViewSettings });`
  );

  let labelQuestion = 'Kdo lahko vidi slike v galeriji na telefonu gosta?';
  let labelAll = 'Vse slike';
  let labelOwn = 'Samo svoje slike';
  let description = 'Če izberete "Samo svoje slike", gostje v galeriji (ko skenirajo kodo) ne bodo videli slik drugih gostov, ampak samo tiste, ki so jih sami naložili.';
  let welcomeLabel = 'Pozdravno sporočilo za goste';

  if (isPl) {
    labelQuestion = 'Kto może zobaczyć zdjęcia w galerii na telefonie gościa?';
    labelAll = 'Wszystkie zdjęcia';
    labelOwn = 'Tylko własne zdjęcia';
    description = 'Jeśli wybierzesz "Tylko własne zdjęcia", goście w galerii (po zeskanowaniu kodu) nie zobaczą zdjęć innych gości, a jedynie te, które sami udostępnili.';
    welcomeLabel = 'Wiadomość powitalna dla gości';
  } else if (isHr) {
    labelQuestion = 'Tko može vidjeti slike u galeriji na telefonu gosta?';
    labelAll = 'Sve slike';
    labelOwn = 'Samo svoje slike';
    description = 'Ako odaberete "Samo svoje slike", gosti u galeriji (kada skeniraju kod) neće vidjeti slike drugih gostiju, već samo one koje su sami prenijeli.';
    welcomeLabel = 'Poruka dobrodošlice za goste';
  }

  const formUI = `                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">${welcomeLabel}</label>
                  <textarea 
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">${labelQuestion}</label>
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
                      <span className="text-gray-700">${labelAll}</span>
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
                      <span className="text-gray-700">${labelOwn}</span>
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">${description}</p>
                </div>`;

  const regex = new RegExp(`[ \\t]*<div>[\\s\\S]*?<label className="block text-sm font-medium mb-2 text-gray-700">${welcomeLabel}</label>[\\s\\S]*?<textarea[\\s\\S]*?className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-gray-900"[\\s\\S]*?/>[\\s\\S]*?</div>`);

  content = content.replace(regex, formUI);

  fs.writeFileSync(file, content, 'utf8');
}

modifyDashboard('src/pages/Dashboard.tsx', false, false);
modifyDashboard('src/pages/DashboardHr.tsx', false, true);
modifyDashboard('src/pages/DashboardPl.tsx', true, false);
