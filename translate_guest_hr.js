import fs from 'fs';

let content = fs.readFileSync('src/pages/GuestViewHr.tsx', 'utf-8');

const dict = {
  'Ustvaril Kliksy': 'Stvorio Kliksy',
  'Dodaj fotografije in videe': 'Dodaj fotografije i videozapise',
  'Naloži več datotek': 'Dodaj još datoteka',
  'Pripravljen za slikanje?': 'Spremni za slikanje?',
  'Dodaj več datotek': 'Dodaj još datoteka',
  'ali povlecite in spustite sem': 'ili povucite i ispustite ovdje',
  'Prekini': 'Prekini',
  'Ustvari lasten dogodek': 'Napravite vlastiti događaj',
  'Naložene datoteke': 'Učitane datoteke',
  'Hvala za upload!': 'Hvala na učitavanju!',
  'Uspešno naloženo': 'Uspješno učitano',
  'Pripravljam na nalaganje...': 'Pripremam za učitavanje...',
  'Nalagam datoteke...': 'Učitavam datoteke...',
  'Nisem mogel naložiti nekaterih datotek. Poskusite ponovno.': 'Nisam mogao učitati neke datoteke. Pokušajte ponovno.',
  'Urejanje je trenutno onemogočeno za ta dogodek.': 'Uređivanje je trenutno onemogućeno za ovaj događaj.',
  'Ogled Live Galerije': 'Prikaz Live Galerije',
  'Shrani sliko': 'Spremi sliku',
  'Nazaj': 'Natrag',
  'Vaše fotografije se nalagajo': 'Vaše fotografije se učitavaju',
  'Pritisni tukaj za upload': 'Pritisnite ovdje za učitavanje',
  'Dobrodošli na dogodku!': 'Dobrodošli na događaj!',
  'Brez fotografij. Bodi prvi!': 'Nema fotografija. Budi prvi!',
  'Uporabi to kamero': 'Koristi ovu kameru',
  'Ostanite na strani, dokler se nalaganje ne konča.': 'Ostanite na stranici dok se učitavanje ne završi.',
  'Skeniraj ponovno in dodaj še več!': 'Skenirajte ponovno i dodajte još!',
  'Ustvari svoj brezplačen dogodek': 'Napravite svoj besplatan događaj',
  'Dogodek ne obstaja.': 'Događaj ne postoji.',
  'Vse slike': 'Sve slike',
  'Dogodek ustvarjen z': 'Događaj stvoren s',
  'Prišlo je do napake': 'Došlo je do pogreške',
  'Vse': 'Sve',
  'Predvajaj': 'Pokreni',
  'Nalaganje': 'Učitavanje',
  'Uplodaj slike': 'Učitaj slike',
  'Nalaganje se končuje': 'Učitavanje se završava',
  'Maksimalno število slik': 'Maksimalan broj slika',
  'Datoteka ne sme biti večja od 50MB.': 'Datoteka ne smije biti veća od 50MB.',
  'Nalaganje prekinjeno': 'Učitavanje prekinuto',
  'Izberite datoteke ali slikajte': 'Odaberite datoteke ili slikajte',
  'Naslednja': 'Sljedeća',
  'Prejšnja': 'Prethodna',
  'Izbriši sliko': 'Obriši sliku',
  'Želite izbrisati to sliko?': 'Želite obrisati ovu sliku?',
  'Galerija posodobljena!': 'Galerija ažurirana!',
  'Svetel način': 'Svijetli način',
  'Slika izbrisana': 'Slika obrisana',
  'Podrobnosti': 'Pojedinosti',
  'Pripravljeno na nalaganje': 'Spremno za učitavanje'
};

for (const [slo, hr] of Object.entries(dict)) {
  content = content.split(slo).join(hr);
}

// Rename function component
content = content.replace(/export default function GuestView/g, 'export default function GuestViewHr');

fs.writeFileSync('src/pages/GuestViewHr.tsx', content);

console.log("GuestViewHr translated");
