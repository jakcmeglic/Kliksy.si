export const LANDING_IMAGES = {
  // Logo aplikacije (če imate svojo datoteko, jo naložite v public/logo.png)
  logo: null, // Če je null, se uporabi tekstovni logo

  // Hero sekcija - Glavna slika (Mockup telefona ali galerije)
  // TUKAJ ZAMENJAJTE: naložite svojo sliko v public/ in spodaj spremenite pot
  heroPhoneMockup: "https://i.postimg.cc/LRy9DP81/firstsection.webp",
  
  // Plavajoče slike okoli glavne slike v Hero sekciji (za boljši vizualni učinek)
  floatingImage1: "https://picsum.photos/seed/wed1/200/200",
  floatingImage2: "https://picsum.photos/seed/wed2/200/200",

  // "Kako deluje" - Sekcija 1 (Slika natisnjene kode)
  printQrCode: "https://i.postimg.cc/nZdF2mhQ/Secondsection.jpg",

  // "Kako deluje" - Sekcija 2 (Slika gosta, ki slika)
  guestTakingPhoto: "https://i.postimg.cc/DFCv6GwG/Middlesection.png",

  // "Kako deluje" - Sekcija 3 (Mreža slik v galeriji)
  galleryGrid1: "https://i.postimg.cc/ZZYY6H4N/Bottomsection.jpg",
  galleryGrid2: "https://i.postimg.cc/ZZYY6H4N/Bottomsection.jpg",
  galleryGrid3: "https://i.postimg.cc/ZZYY6H4N/Bottomsection.jpg",
  galleryGrid4: "https://i.postimg.cc/ZZYY6H4N/Bottomsection.jpg",
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
