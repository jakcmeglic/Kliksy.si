import fs from 'fs';

let c = fs.readFileSync('src/pages/DashboardHr.tsx', 'utf-8');

const dict = {
  'Hvala, ker deliš spomine z nama.': 'Hvala što dijeliš uspomene s nama.',
  'Hvala, ker deliš spomine z nami.': 'Hvala što dijeliš uspomene s nama.',
  'Naložene slike': 'Učitane slike',
  '"Gostje"': '"Gosti"', // Adding quotes so we don't accidentally replace variable names or other occurrences
  'Zadnja slika': 'Zadnja slika',
  '"Pravkar"': '"Upravo"',
  'Demo paket (omejeno na 5 slik)': 'Demo paket (ograničeno na 5 slika)',
  'Upravljaj svoje poročne spomine.': 'Upravljaj svojim vjenčanim uspomenama.',
  'Upravljaj svoje rojstnodnevne spomine.': 'Upravljaj svojim rođendanskim uspomenama.',
  '"Prenesi vse"': '"Preuzmi sve"',
  'Tvoja QR koda': 'Tvoj QR kod',
  'Natisni to kodo in jo postavi na mize.': 'Ispiši ovaj kod i postavi ga na stolove.',
  'Skeniraj to qr kodo in preizkusi, kako deluje': 'Skeniraj ovaj QR kod i isprobaj kako radi',
  'Preuzmi QR kod z designom': 'Preuzmi QR kod s dizajnom',
  'Prenesi samo QR kodo': 'Preuzmi samo QR kod',
  'Zadnje naloženo': 'Zadnje učitano',
  'Poglej vse': 'Pogledaj sve',
  'Še ni naloženih fotografij.': 'Još nema učitanih fotografija.',
  'Spremi spremembe': 'Spremi promjene',
};

for (const [slo, hr] of Object.entries(dict)) {
  c = c.split(slo).join(hr);
}

fs.writeFileSync('src/pages/DashboardHr.tsx', c);
console.log("DashboardHr missing translations updated.");
