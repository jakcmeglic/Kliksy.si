import fs from 'fs';

let c = fs.readFileSync('src/components/QRDesignsHr.tsx', 'utf-8');

const dict = {
  'Dogodek': 'Događaj',
  'Poročni': 'Vjenčani',
  'POROČNI': 'VJENČANI',
  'Nevtralni': 'Neutralni',
  'NEVTRALNI': 'NEUTRALNI',
  'Poslovni': 'Poslovni',
  'POSLOVNI': 'POSLOVNI',
  'Rojstnodnevni': 'Rođendanski',
  'ROJSTNODNEVNI': 'ROĐENDANSKI',
  
  'Ujemi najine<br/>najlepše trenutke': 'Uhvati naše<br/>najljepše trenutke',
  'Skeniraj me': 'Skeniraj me',
  'Dodaj svoje fotografije in<br/>poglej utrinke tega dne.': 'Dodaj svoje fotografije i<br/>pogledaj trenutke s ovog dana.',
  'Hvala, ker soustvarjaš spomine ✨': 'Hvala što sudjeluješ u stvaranju uspomena ✨',
  
  // Design names
  "Zlate Linije": "Zlatne linije",
  "Cvetlična Romantika": "Cvjetna romantika",
  "Geometrijska Eleganca": "Geometrijska elegancija",
  "Luksuz: Kraljevo Modra": "Luksuz: Kraljevsko plava",
  'Luksuz: Smaragdna Eleganca': 'Luksuz: Smaragdna elegancija',
  'Luksuz: Žametna Vrtnica': 'Luksuz: Baršunasta ruža',
  'Boho: Terakota': 'Boho: Terakota',
  'Boho: Žajbelj': 'Boho: Kadulja',
  'Boho: Topel Pesek': 'Boho: Topli pijesak',
  'Nevtralno: Čisti Minimalizem': 'Neutralno: Čisti minimalizam',
  'Nevtralno: Nežna Sivina': 'Neutralno: Nježna siva',
  'Čisti Minimalizem': 'Čisti minimalizam',
  'Eleganca': 'Elegancija',
  'Okvir': 'Okvir',
  'Temna Eleganca': 'Tamna elegancija',
  'Korporativni': 'Korporativni',
  'Konferenca': 'Konferencija',
  'Profesionalni': 'Profesionalni',
  'Vizitka': 'Posjetnica',
  'Korporativna Modra': 'Korporativna plava',
  'Svetla Minimalistična': 'Svijetla minimalistička',
  'Zlati Poudarki': 'Zlatni naglasci',
  'Zabava': 'Zabava',
  'Baloni': 'Baloni',
  'Neon': 'Neon',
  'Strip': 'Strip',

  '"Ujemi trenutek. Poskeniraj in deli svoje fotografije z nama."': '"Uhvati trenutak. Skeniraj i podijeli svoje fotografije s nama."',
  'Hvala, ker delite najin dan': 'Hvala što dijelite naš dan',
  'Bodi najin fotograf! Deli svoje utrinke preko QR kode.': 'Budi naš fotograf! Podijeli svoje trenutke putem QR koda.',
  'Dobrodošli na najini poroki': 'Dobrodošli na našem vjenčanju',
  'Najin dan skozi tvoje oči. Slikaj in naloži tukaj.': 'Naš dan kroz tvoje oči. Slikaj i učitaj ovdje.',
  'Ustvarimo spomine skupaj.<br/>Poskeniraj za deljenje slik.': 'Stvorimo uspomene zajedno.<br/>Skeniraj za dijeljenje slika.',
  'Deli ljubezen, deli slike!<br/>Poskeniraj QR kodo.': 'Dijeli ljubav, dijeli slike!<br/>Skeniraj QR kod.',
  'Tvoj pogled na najin dan.<br/>Naloži fotografije tukaj.': 'Tvoj pogled na naš dan.<br/>Učitaj fotografije ovdje.',
  'Pomagaj nama ujeti vsak nasmeh.<br/>Skeniraj in deli.': 'Pomozi nam uhvatiti svaki osmijeh.<br/>Skeniraj i podijeli.',
  'Praznujta z nama': 'Slavite s nama',
  'Slikaj, poskeniraj, deli!<br/>Hvala, ker si z nama.': 'Slikaj, skeniraj, podijeli!<br/>Hvala što si s nama.',
  
  'Deli fotke z nami': 'Dijeli fotke s nama',
  'Prosimo, deli fotografije z nami.': 'Molimo, podijeli fotografije s nama.',
  'Skeniraj & deli fotke z nami': 'Skeniraj i podijeli fotke s nama',
  'Deli svoje fotke z nami': 'Podijeli svoje fotke s nama',
  'Delite fotografije z nami': 'Podijelite fotografije s nama',
  'Skenirajte kodo za prenos datotek.': 'Skenirajte kod za prijenos datoteka.',
  'Skenirajte kodo in delite fotografije z nami': 'Skenirajte kod i podijelite fotografije s nama',
  'Prosimo, delite svoje fotografije z nami.': 'Molimo, podijelite svoje fotografije s nama.',
  'Delite<br/>fotke<br/>z nami.': 'Podijelite<br/>fotke<br/>s nama.',
  'Slikajte in delite fotografije z nami. Skenirajte QR kodo.': 'Slikajte i podijelite fotografije s nama. Skenirajte QR kod.',
  'Vaš pogled na dogodek. Skenirajte in naložite fotografije.': 'Vaš pogled na događaj. Skenirajte i učitajte fotografije.',
  'Uradna galerija': 'Službena galerija',
  'Deli fotke z moje zabave!': 'Podijeli fotke s moje zabave!',
  'Slikaj in deli fotke z mano!': 'Slikaj i podijeli fotke sa mnom!',
  'Deli fotke<br/>z nami!': 'Podijeli fotke<br/>s nama!',
  'BAM! Deli fotke<br/>z mano!': 'BAM! Podijeli fotke<br/>sa mnom!',
};

// Also replace dates formatting
// .toLocaleDateString('sl-SI') -> .toLocaleDateString('hr-HR')
c = c.replace(/toLocaleDateString\('sl-SI'\)/g, "toLocaleDateString('hr-HR')");

for (const [slo, hr] of Object.entries(dict)) {
  c = c.split(slo).join(hr);
}

fs.writeFileSync('src/components/QRDesignsHr.tsx', c);
console.log("QRDesignsHr translated");
