import fs from 'fs';

let content = fs.readFileSync('src/pages/CreateEventHr.tsx', 'utf-8');

const dict = {
  'Najboljša odločitev za poroko! Dobili smo toliko spontanih trenutkov, ki jih fotograf sploh ni ujel.': 'Najbolja odluka za vjenčanje! Dobili smo toliko spontanih trenutaka koje fotograf uopće nije uhvatio.',
  'Poročena 2026': 'Vjenčani 2026',
  'Super preprosto za uporabo. Tudi babica je brez težav naložila svoje slike z rojstnega dne.': 'Super jednostavno za korištenje. Čak je i baka bez problema uploadala svoje slike s rođendana.',
  'Slavljenec, 30 let': 'Slavljenik, 30 godina',
  'Odlična zadeva za naš zadnji teambuilding. Vse slike zbrane na enem mestu brez pošiljanja preko Vibra.': 'Odlična stvar za naš zadnji teambuilding. Sve slike skupljene na jednom mjestu bez slanja preko Vibera.',
  'HR, IT podjetje': 'HR, IT poduzeće',
  
  'Preprosti paketi, izberite pravega za vaš dogodek': 'Jednostavni paketi, odaberite pravi za vaš događaj',
  'Paketi za vsak dogodek': 'Paketi za svaki događaj',
  'Basic paket': 'Osnovni paket',
  'Za manjše, intimne dogodke in zabave.': 'Za manje, intimne događaje i zabave.',
  'Plus paket': 'Plus paket',
  'Najboljša izbira za poroke in srednje velike dogodke.': 'Najbolji izbor za vjenčanja i srednje velike događaje.',
  'Premium paket': 'Premium paket',
  'Za tiste, ki želijo največ od svojega dogodka.': 'Za one koji žele najviše od svog događaja.',
  
  // CreateEvent text:
  'Vaše ime ali ime proslavljenca': 'Vaše ime ili ime slavljenika',
  'Ime dogodka (npr. Teambuilding 2026)': 'Ime događaja (npr. Teambuilding 2026)',
  'Potrebujemo nekaj osnovnih informacij o vašem dogodku.': 'Trebamo neke osnovne informacije o vašem događaju.',
  'Želite račun na podjetje?': 'Želite li račun na tvrtku?',
  
  'Cena se izračuna glede na izbrani paket.': 'Cijena se izračunava prema odabranom paketu.',
  'Dogodek pripravljen!': 'Događaj je spreman!',
  'Zapri in nadaljuj': 'Zatvori i nastavi'
};

for (const [slo, hr] of Object.entries(dict)) {
  content = content.split(slo).join(hr);
}

fs.writeFileSync('src/pages/CreateEventHr.tsx', content);
console.log("CreateEventHr fine-tuned");
