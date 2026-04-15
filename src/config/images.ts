export const LANDING_IMAGES = {
  // Logo aplikacije (če imate svojo datoteko, jo naložite v public/logo.png)
  logo: null, // Če je null, se uporabi tekstovni logo

  // Hero sekcija - Glavna slika (Mockup telefona ali galerije)
  // TUKAJ ZAMENJAJTE: naložite svojo sliko v public/ in spodaj spremenite pot
  heroPhoneMockup: "https://github.com/jakcmeglic/Kliksy.si/blob/main/public/firstsection.webp?raw=true",
  
  // Plavajoče slike okoli glavne slike v Hero sekciji (za boljši vizualni učinek)
  floatingImage1: "https://picsum.photos/seed/wed1/200/200",
  floatingImage2: "https://picsum.photos/seed/wed2/200/200",

  // "Kako deluje" - Sekcija 1 (Slika natisnjene kode)
  printQrCode: "https://github.com/jakcmeglic/Kliksy.si/blob/main/public/Secondsection.jpeg?raw=true",

  // "Kako deluje" - Sekcija 2 (Slika gosta, ki slika)
  guestTakingPhoto: "https://github.com/jakcmeglic/Kliksy.si/blob/main/public/Middlesection.png?raw=true",

  // "Kako deluje" - Sekcija 3 (Mreža slik v galeriji)
  galleryGrid1: "https://github.com/jakcmeglic/Kliksy.si/blob/main/public/Bottomsection.jpeg?raw=true",
  galleryGrid2: "https://github.com/jakcmeglic/Kliksy.si/blob/main/public/Bottomsection.jpeg?raw=true",
  galleryGrid3: "https://github.com/jakcmeglic/Kliksy.si/blob/main/public/Bottomsection.jpeg?raw=true",
  galleryGrid4: "https://github.com/jakcmeglic/Kliksy.si/blob/main/public/Bottomsection.jpeg?raw=true",
};

/**
 * NAVODILA ZA MENJAVO SLIK:
 * 
 * 1. Svojo sliko (npr. tisto s poroke, ki ste jo poslali) naložite v mapo `public`.
 *    Poimenujte jo npr. `demo-hero.jpg`.
 * 2. V tej datoteki (src/config/images.ts) spremenite pot:
 *    heroPhoneMockup: "/demo-hero.jpg",
 * 
 * 3. Enako storite za vse ostale slike.
 */
