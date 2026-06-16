const fs = require('fs');

const file = 'src/components/QRDesignsPl.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacements = {
  "'Vjenčani'": "'Ślubne'",
  "'Neutralni'": "'Uniwersalne'",
  "'Poslovni'": "'Firmowe'",
  "'Rođendanski'": "'Urodzinowe'",

  "'Zlatne linije'": "'Złote linie'",
  "'Cvjetna romantika'": "'Kwiatowa romantyka'",
  "'Geometrijska elegancija'": "'Geometryczna elegancja'",
  "'Luksuz: Kraljevsko plava'": "'Luksus: Królewski błękit'",
  "'Luksuz: Smaragdna elegancija'": "'Luksus: Szmaragdowa elegancja'",
  "'Luksuz: Baršunasta ruža'": "'Luksus: Aksamitna róża'",
  "'Boho: Terakota'": "'Boho: Terakota'",
  "'Boho: Kadulja'": "'Boho: Szałwia'",
  "'Boho: Topli pijesak'": "'Boho: Ciepły piasek'",
  "'Neutralno: Čisti minimalizam'": "'Neutralne: Czysty minimalizm'",
  "'Neutralno: Nježna siva'": "'Neutralne: Delikatna szarość'",
  "'Čisti minimalizam'": "'Czysty minimalizm'",
  "'Elegancija'": "'Elegancja'",
  "'Okvir'": "'Ramka'",
  "'Temna Elegancija'": "'Ciemna elegancja'",
  "'Korporativni'": "'Korporacyjne'",
  "'Konferencija'": "'Konferencja'",
  "'Profesionalni'": "'Profesjonalne'",
  "'Posjetnica'": "'Wizytówka'",
  "'Zabava'": "'Impreza'",
  "'Baloni'": "'Balony'",
  "'Neon'": "'Neon'",
  "'Strip'": "'Komiks'",
  "'Korporativna plava'": "'Korporacyjny błękit'",
  "'Svijetla minimalistička'": "'Jasny minimalizm'",
  "'Zlatni naglasci'": "'Złote akcenty'",

  "Uhvati naše<br/>najljepše trenutke": "Uchwyć nasze<br/>najpiękniejsze chwile",
  "Skeniraj me": "Zeskanuj mnie",
  "Dodaj svoje fotografije i<br/>pogledaj trenutke s ovog dana.": "Dodaj swoje zdjęcia i<br/>zobacz wspomnienia z tego dnia.",
  "Hvala što sudjeluješ u stvaranju uspomena ✨": "Dziękujemy za stworzenie z nami wspomnień ✨",
  "'Događaj'": "'Wydarzenie'",
  "\"Uhvati trenutak. Skeniraj i podijeli svoje fotografije s nama.\"": "\"Uchwyć chwilę. Zeskanuj i podziel się z nami swoimi zdjęciami.\"",
  "Hvala što dijelite naš dan": "Dziękujemy, że dzielisz z nami ten dzień",
  "Budi naš fotograf! Podijeli svoje trenutke putem QR koda.": "Bądź naszym fotografem! Podziel się swoimi chwilami za pomocą kodu QR.",
  "Dobrodošli na našem vjenčanju": "Witamy na naszym weselu",
  "Naš dan kroz tvoje oči. Slikaj i učitaj ovdje.": "Nasz dzień Twoimi oczami. Zrób zdjęcie i prześlij tutaj.",
  "Stvorimo uspomene zajedno.<br/>Skeniraj za dijeljenje slika.": "Stwórzmy razem wspomnienia.<br/>Zeskanuj, aby udostępnić zdjęcia.",
  "Dijeli ljubav, dijeli slike!<br/>Skeniraj QR kod.": "Dziel się miłością, dziel się zdjęciami!<br/>Zeskanuj kod QR.",
  "Tvoj pogled na naš dan.<br/>Učitaj fotografije ovdje.": "Twój widok na nasz dzień.<br/>Prześlij zdjęcia tutaj.",
  "Pomozi nam uhvatiti svaki osmijeh.<br/>Skeniraj i podijeli.": "Pomóż nam uchwycić każdy uśmiech.<br/>Zeskanuj i podziel się.",
  "Slavite s nama": "Świętuj z nami",
  "Slikaj, skeniraj, podijeli!<br/>Hvala što si s nama.": "Zrób zdjęcie, zeskanuj, podziel się!<br/>Dziękujemy, że jesteś z nami.",
  "Dijeli fotke s nama": "Podziel się z nami zdjęciami",
  "Molimo, podijeli fotografije s nama.": "Proszę, podziel się z nami zdjęciami.",
  "Skeniraj i podijeli fotke s nama": "Zeskanuj i podziel się z nami zdjęciami",
  "Podijeli svoje fotke s nama": "Podziel się swoimi zdjęciami z nami",
  "Podijelite fotografije s nama": "Podzielcie się z nami zdjęciami",
  "Skenirajte kod za prijenos datoteka.": "Zeskanuj kod, aby przesłać pliki.",
  "Skenirajte kod i podijelite fotografije s nama": "Zeskanuj kod i podziel się z nami zdjęciami",
  "Molimo, podijelite svoje fotografije s nama.": "Proszę, podzielcie się swoimi zdjęciami z nami.",
  "Podijelite<br/>fotke<br/>s nama.": "Podzielcie się<br/>zdjęciami<br/>z nami.",
  "Podijeli fotke s moje zabave!": "Podziel się zdjęciami z mojej imprezy!",
  "Slikaj i podijeli fotke sa mnom!": "Zrób zdjęcie i podziel się nim ze mną!",
  "Podijeli fotke<br/>s nama!": "Podziel się zdjęciami<br/>z nami!",
  "BAM! Podijeli fotke<br/>sa mnom!": "BAM! Podziel się zdjęciami<br/>ze mną!",
  "Poslovni događaj": "Wydarzenie firmowe",
  "Slikajte i podijelite fotografije s nama. Skenirajte QR kod.": "Zróbcie zdjęcie i podzielcie się nim z nami. Zeskanujcie kod QR.",
  "Vaš pogled na događaj. Skenirajte i učitajte fotografije.": "Twój widok na wydarzenie. Zeskanuj i prześlij zdjęcia.",
  "Službena galerija": "Oficjalna galeria",
  "Sudjelujte u stvaranju galerije. Skenirajte i dodajte fotografije.": "Weź udział w tworzeniu galerii. Zeskanuj i dodaj zdjęcia.",
  "Podijeli uspomene": "Podziel się wspomnieniami",
  "Za pristup galeriji.": "Do dostępu do galerii.",

  "event.eventType === 'poroka'": "event.eventType === 'poroka'", // Leave alone if poroka is used
  "'Partner 1'": "'Partner 1'",
  "'Partner 2'": "'Partner 2'",
  "'hr-HR'": "'pl-PL'",
  "kliksy.si": "kliksy.pl"
};

for (const [hr, pl] of Object.entries(replacements)) {
  content = content.split(hr).join(pl);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Replacements done in QRDesignsPl.tsx');
