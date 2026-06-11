import fs from 'fs';

let c = fs.readFileSync('src/components/QRDesignsHr.tsx', 'utf-8');

const dict = {
  'Zabeležite trenutke. Skenirajte kodo za deljenje slik z nami.': 'Zabiložeite trenutke. Skenirajte kod za dijeljenje slika s nama.',
  'Ustvarjamo zgodbo dogodka. Slikajte in delite fotografije.': 'Stvaramo priču događaja. Slikajte i podijelite fotografije.',
  'Prispevajte v skupno galerijo. Skenirajte in delite utrinke.': 'Doprinesite zajedničkoj galeriji. Skenirajte i podijelite trenutke.',
  'Vaše fotografije bogatijo naš dogodek. Skenirajte in delite.': 'Vaše fotografije obogaćuju naš događaj. Skenirajte i podijelite.',
  'Slikaj in deli fotografije z nami.<br/>Poskeniraj QR kodo.': 'Slikaj i podijeli fotografije s nama.<br/>Skeniraj QR kod.',
  'Shranimo spomine skupaj. Slikajte, poskenirajte in delite.': 'Sačuvajmo uspomene zajedno. Slikajte, skenirajte i podijelite.',
};

for (const [slo, hr] of Object.entries(dict)) {
  c = c.split(slo).join(hr);
}

fs.writeFileSync('src/components/QRDesignsHr.tsx', c);
console.log("QRDesignsHr extra translations done");
