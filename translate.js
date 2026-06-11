import fs from 'fs';

function translateLanding() {
  let content = fs.readFileSync('src/pages/LandingHr.tsx', 'utf-8');
  
  // Replacements
  const dict = {
    'svoje poroke': 'vašeg vjenčanja',
    'svojega dogodka': 'vašeg događaja',
    'svojega praznovanja': 'vaše proslave',
    'Ne izgubi slik': 'Ne gubi slike',
    'S Kliksy zberite vse fotografije in videe gostov na enem mestu, z eno samo QR kodo.': 'S Kliksyjem prikupite sve fotografije i videozapise gostiju na jednom mjestu, samo jednim QR kodom.',
    'Kako deluje': 'Kako radi',
    'Zakaj to potrebuješ': 'Zašto ti to treba',
    'Cenik': 'Cjenik',
    'Mnenja': 'Mišljenja',
    'Prijava': 'Prijava',
    'Ustvari dogodek': 'Napravi događaj',
    'Ustvari nov dogodek': 'Napravi novi događaj',
    'Zabava': 'Zabava',
    'QR koda na mizi': 'QR kod na stolu',
    'Photobooth rekviziti': 'Photobooth rekviziti',
    'Kliksy letak': 'Kliksy letak',
    'Ustvari svojo galerijo zdaj': 'Napravi svoju galeriju sada',
    'Varno. Zasebno. Samo za vas in vaše goste.': 'Sigurno. Privatno. Samo za vas i vaše goste.',
    'Veselje na poroki': 'Veselje na vjenčanju',
    'novih fotografij': 'novih fotografija',
    'Poskeniraj<br/>QR kodo': 'Skeniraj<br/>QR kod',
    'ljudi je že izbralo Kliksy': 'ljudi je već odabralo Kliksy',
    'na podlagi prvih ocen': 'na temelju prvih ocjena',
    'zbranih fotografij in videov': 'prikupljenih fotografija i videa',
    'Zakaj to potrebuješ?': 'Zašto ti to treba?',
    'Fotograf ne more biti povsod': 'Fotograf ne može biti svugdje',
    'Gosti ujamejo spontane trenutke, ki jih profesionalni fotograf pogosto zamudi.': 'Gosti uhvate spontane trenutke koje profesionalni fotograf često propusti.',
    'Slike se drugače izgubijo': 'Slike se inače izgube',
    'Fotografije ostanejo na telefonih, v klepetih in jih nikoli ne prejmete.': 'Fotografije ostaju na mobitelima, u razgovorima i nikada ih ne dobijete.',
    'Spomini iz vseh zornih kotov': 'Uspomene iz svih kutova',
    'Dobite celotno zgodbo vašega dne, skozi oči vaših gostov.': 'Dobivate cijelu priču vašeg dana, kroz oči vaših gostiju.',
    'Začnite zbirati spomine': 'Počnite skupljati uspomene',
    'Kako deluje?': 'Kako radi?',
    'Natisnite QR kodo': 'Ispišite QR kod',
    'QR kodo natisnete in postavite na mize, pri vhodu ali kamorkoli na dogodku.': 'QR kod ispišete i postavite na stolove, na ulazu ili bilo gdje na događaju.',
    'Gosti slikajo in delijo': 'Gosti slikaju i dijele',
    'Gosti skenirajo QR kodo in takoj začnejo dodajati svoje fotografije in videe - brez prijav.': 'Gosti skeniraju QR kod i odmah počinju dodavati svoje fotografije i videozapise - bez prijava.',
    'Vse na enem mestu': 'Sve na jednom mjestu',
    'Vse fotografije in videi se zbirajo v vaši zasebni galeriji, ki jo po dogodku preneseš v 1 klik.': 'Sve fotografije i videi se prikupljaju u vašoj privatnoj galeriji, koju nakon događaja možete preuzeti u 1 klik.',
    'Vsa zbirka': 'Cijela zbirka',
    'fotografij • 24 videov': 'fotografija • 24 videa',
    'Prenesi vse': 'Preuzmi sve',
    'Ustvari svoj dogodek zdaj': 'Napravi svoj događaj sada',
    'Zakaj izbrati Kliksy?': 'Zašto odabrati Kliksy?',
    'Boljše kot Photo Booth': 'Bolje od Photo Bootha',
    'Brez omejitev, brez rekvizitov in čakanja v vrsti. Gosti fotografirajo vse, kar želijo.': 'Bez ograničenja, bez rekvizita i čekanja u redu. Gosti fotografiraju sve što žele.',
    'Vse slike na enem mestu': 'Sve slike na jednom mjestu',
    'Ni več iskanja po telefonih in klepetih. Vse je urejeno na enem mestu.': 'Nema više traženja po mobitelima i razgovorima. Sve je uređeno na jednom mjestu.',
    'Takojšen dostop': 'Trenutni pristup',
    'Med dogodkom že vidite nove vsebine. Popolno za deljenje z gosti.': 'Tijekom događaja već vidite nove sadržaje. Savršeno za dijeljenje s gostima.',
    '100% zasebnost': '100% privatnost',
    'Galerija je samo za vas in vaše izbrane goste. Brez javnih povezav.': 'Galerija je samo za vas i vaše odabrane goste. Bez javnih poveznica.',
    'Polna kvaliteta': 'Puna kvaliteta',
    'Fotografije in videi so shranjeni v originalni kvaliteti. Brez stiskanja in izgube kakovosti.': 'Fotografije i videozapisi su spremljeni u originalnoj kvaliteti. Bez kompresije i gubitka kvalitete.',
    'Zabavno za vse': 'Zabavno za sve',
    'Enostavno za vse generacije – od otrok do babic in dedkov.': 'Jednostavno za sve generacije – od djece do baka i djedova.',
    'Mnenja naših kupcev': 'Mišljenja naših kupaca',
    'Naloži več mnenj': 'Učitaj više mišljenja',
    'Preprosti paketi': 'Jednostavni paketi',
    'Izberite paket, ki najbolj ustreza vašemu dogodku.': 'Odaberite paket koji najviše odgovara vašem događaju.',
    'Za manjše dogodke': 'Za manje događaje',
    'Unikatna QR koda': 'Unikatni QR kod',
    'Do 50 gostov': 'Do 50 gostiju',
    'Do 200 fotografij': 'Do 200 fotografija',
    'Dostop do galerije 1 mesec': 'Pristup galeriji 1 mjesec',
    'Prenos vseh slik (ZIP)': 'Preuzimanje svih slika (ZIP)',
    'Izberi Basic': 'Odaberi Basic',
    'NAJBOLJ PRILJUBLJENO': 'NAJPOPULARNIJE',
    'Za večje dogodke in poroke': 'Za veće događaje i vjenčanja',
    'Neomejeno število gostov': 'Neograničen broj gostiju',
    'Neomejeno fotografij': 'Neograničeno fotografija',
    'Dostop do galerije 1 leto': 'Pristup galeriji 1 godina',
    'Live galerija (projekcija)': 'Live galerija (projekcija)',
    'Personalizirana stran z imeni': 'Personalizirana stranica s imenima',
    'Izberi Plus': 'Odaberi Plus',
    'Za tiste, ki želite vse': 'Za one koji žele sve',
    'Do 100 videoposnetkov': 'Do 100 videozapisa',
    'Dostop do galerije 2 leti': 'Pristup galeriji 2 godine',
    'Premium design predloge': 'Premium design predlošci',
    'Prioritetna podpora': 'Prioritetna podrška',
    'Izberi Premium': 'Odaberi Premium',
    '30-dnevna garancija vračila denarja – brez vprašanj.': '30-dnevno jamstvo povrata novca – bez pitanja.',
    'Pogosta vprašanja': 'Česta pitanja',
    'Izdelano v Sloveniji z': 'Napravljeno s',
    'za tiste, ki želijo shraniti svoje spomine': 'za one koji žele sačuvati svoje uspomene',
    'Domov': 'Početna',
    'Produkti': 'Proizvodi',
    'Za poroke': 'Za vjenčanja',
    'Za rojstne dneve': 'Za rođendane',
    'Za podjetja': 'Za tvrtke',
    'Legalno': 'Pravno',
    'Splošni pogoji': 'Opći uvjeti',
    'Zasebnost': 'Privatnost',
    'Piškotki': 'Kolačići'
  };

  for (const [slo, hr] of Object.entries(dict)) {
    content = content.split(slo).join(hr);
  }

  // Also replace some hardcoded review stuff
  content = content.replace('Ali gosti potrebujejo aplikacijo?', 'Trebaju li gosti aplikaciju?');
  content = content.replace('Ne! Kliksy deluje popolnoma v brskalniku na telefonu. Gosti le skenirajo QR kodo s svojo kamero in takoj lahko dodajajo fotografije – brez prenosov in brez registracije.', 'Ne! Kliksy radi potpuno u pregledniku na telefonu. Gosti samo skeniraju QR kod svojom kamerom i odmah mogu dodavati fotografije - bez preuzimanja i bez registracije.');
  
  content = content.replace('Export default function Landing()', 'export default function LandingHr()');
  content = content.replace('function Landing(', 'function LandingHr(');

  fs.writeFileSync('src/pages/LandingHr.tsx', content);
}

function translateCreateEvent() {
  let content = fs.readFileSync('src/pages/CreateEventHr.tsx', 'utf-8');
  
  // Fast translations for the checkout
  const dict = {
    'Ustvari nov dogodek': 'Napravi novi događaj',
    'Podrobnosti': 'Pojedinosti',
    'Možnosti': 'Mogućnosti',
    'Plačilo': 'Plaćanje',
    'Izbira paketa': 'Odabir paketa',
    'Za kakšen dogodek gre?': 'O kakvom se događaju radi?',
    'Poroka': 'Vjenčanje',
    'Rojstni dan': 'Rođendan',
    'Teambuilding': 'Teambuilding',
    'Drug dogodek': 'Drugi događaj',
    'Ime dogodka': 'Ime događaja',
    'Ime prve osebe': 'Ime prve osobe',
    'Ime druge osebe': 'Ime druge osobe',
    'Datum dogodka': 'Datum događaja',
    'Nadaljuj': 'Nastavi',
    'Nakup na podjetje': 'Kupnja na tvrtku',
    'Naziv podjetja': 'Naziv tvrtke',
    'Naslov podjetja': 'Adresa tvrtke',
    'Davčna številka': 'Porezni broj',
    'Plačaj z bančno kartico': 'Plati bankovnom karticom',
    'Izbrani paket': 'Odabrani paket',
    'Plačaj z Apple Pay / Google Pay': 'Plati s Apple Pay / Google Pay',
    'Številka kartice': 'Broj kartice',
    'Ime na kartici': 'Ime na kartici',
    'Izberite paket': 'Odaberite paket',
    'Paket Basic': 'Paket Basic',
    'Paket Plus': 'Paket Plus',
    'Paket Premium': 'Paket Premium',
    'Zavrni': 'Odbaci',
    'Shrani': 'Spremi',
    'Strinjam se s': 'Slažem se sa',
    'splošnimi pogoji': 'općim uvjetima',
    'Zapusti': 'Napusti',
    'Dodatno': 'Dodatno',
    'Popust': 'Popust',
    'Vnesite kodo': 'Unesite kod',
    'Uporabi': 'Primijeni',
    'Prišlo je do napake': 'Došlo je do pogreške',
    'Dogodek pripravljen': 'Događaj je spreman',
    'Galerija ustvarjena': 'Galerija stvorena',
    'Nazaj': 'Natrag'
  };

  for (const [slo, hr] of Object.entries(dict)) {
    content = content.split(slo).join(hr);
  }
  
  content = content.replace('export default function CreateEvent(', 'export default function CreateEventHr(');
  fs.writeFileSync('src/pages/CreateEventHr.tsx', content);
}

translateLanding();
translateCreateEvent();
console.log("Translations configured");
