export const LANDING_IMAGES = {
  // Logo aplikacije (če imate svojo datoteko, jo naložite v public/logo.png)
  logo: null, // Če je null, se uporabi tekstovni logo

  // Hero sekcija - Glavna slika (Mockup telefona ali galerije)
  // TUKAJ ZAMENJAJTE: naložite svojo sliko v public/ in spodaj spremenite pot
  heroPhoneMockup: "/hf_20260326_053452_94c5b6a0-8199-4033-89f2-6c326395a0b1.webp",
  
  // Plavajoče slike okoli glavne slike v Hero sekciji (za boljši vizualni učinek)
  floatingImage1: "https://picsum.photos/seed/wed1/200/200",
  floatingImage2: "https://picsum.photos/seed/wed2/200/200",

  // "Kako deluje" - Sekcija 1 (Slika natisnjene kode)
  printQrCode: "/hf_20260326_055112_eca2ffc5-def0-4a57-8d76-c6336838255b (1).jpeg",

  // "Kako deluje" - Sekcija 2 (Slika gosta, ki slika)
  guestTakingPhoto: "/hf_20260327_065704_09ee1521-869d-4f93-9163-86cd1ff9e1e5 (1).png",

  // "Kako deluje" - Sekcija 3 (Mreža slik v galeriji)
  galleryGrid1: "/hf_20260326_055112_d114a56e-f8b1-4ccb-ad92-52e248232c66 (1).jpeg",
  galleryGrid2: "/hf_20260326_055112_d114a56e-f8b1-4ccb-ad92-52e248232c66 (1).jpeg",
  galleryGrid3: "/hf_20260326_055112_d114a56e-f8b1-4ccb-ad92-52e248232c66 (1).jpeg",
  galleryGrid4: "/hf_20260326_055112_d114a56e-f8b1-4ccb-ad92-52e248232c66 (1).jpeg",
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
