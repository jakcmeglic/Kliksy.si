import heroPhoneMockup from '../assets/images/heroPhoneMockup.webp';
import printQrCode from '../assets/images/printQrCode.jpeg';
import guestTakingPhoto from '../assets/images/guestTakingPhoto.png';
import galleryGrid from '../assets/images/galleryGrid.jpeg';

export const LANDING_IMAGES = {
  // Logo aplikacije (če imate svojo datoteko, jo naložite v public/logo.png)
  logo: null, // Če je null, se uporabi tekstovni logo

  // Hero sekcija - Glavna slika (Mockup telefona ali galerije)
  // TUKAJ ZAMENJAJTE: naložite svojo sliko v public/ in spodaj spremenite pot
  heroPhoneMockup,
  
  // Plavajoče slike okoli glavne slike v Hero sekciji (za boljši vizualni učinek)
  floatingImage1: "https://picsum.photos/seed/wed1/200/200",
  floatingImage2: "https://picsum.photos/seed/wed2/200/200",

  // "Kako deluje" - Sekcija 1 (Slika natisnjene kode)
  printQrCode,

  // "Kako deluje" - Sekcija 2 (Slika gosta, ki slika)
  guestTakingPhoto,

  // "Kako deluje" - Sekcija 3 (Mreža slik v galeriji)
  galleryGrid1: galleryGrid,
  galleryGrid2: galleryGrid,
  galleryGrid3: galleryGrid,
  galleryGrid4: galleryGrid,
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
