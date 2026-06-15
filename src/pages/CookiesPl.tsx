import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPl() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-10 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nazaj na prvo stran
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Politika kolačića</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">Na spletnem mestu kliksy.si (»spletno mesto«) uporabljamo piškotke in podobne tehnologije, da vam zagotovimo optimalno izkušnjo obiska ter za pravilno delovanje naših določenih tehničnih procesov. Ta politika o piškotkih vas seznanja z vrstami piškotkov, ki jih upravljamo in z namenom uporabe v skladu z Zakonom o elektronskih komunikacijah (ZEKom-1).</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Kaj so piškotki?</h2>
          <p className="mb-6">Kolačići so manjše besedilne datoteke, ki se shranijo na vašo napravo, ko obiščete našo spletno stran. Omogočajo prepoznavanje naprave in si »zapomnijo« vaše določene izbire (kot so prijava v sistem ali izbrani paket).</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Katere piškotke uporabljamo?</h2>
          
          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">A. Nujno potrebni piškotki</h3>
          <p className="mb-6">Ti piškotki so ključnega pomena, saj omogočajo premikanje po spletnem mestu, ohranjajo prijavo v uporabniško nadzorno ploščo in upravljajo košarico oziroma postopek zakupa dogodka. Brez teh piškotkov osnovne funkcionalnosti ne delujejo, zato za takšne piškotke zakonita privolitev ni potrebna.</p>
          
          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-2">B. Funkcionalni in analitični piškotki</h3>
          <p className="mb-6">S temi piškotki merimo obiskanost spletne strani (Google Analytics in podobna orodja), kar nam pomaga pri analiziranju delovanja sistema in izboljšavenju vsebin. Ti piškotki se v vaši napravi naložijo šele, ko se s tem izrecno strinjate.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Kako lahko piškotke upravljate?</h2>
          <p className="mb-6">Svoje nastavitve in preferences za piškotke vedno lahko spremenite neposredno v svojem spletnem brskalniku, kjer je piškotke mogoče popolnoma izbrisati in onemogočiti.</p>
          <p className="mb-6">Opozarjamo pa, da izključitev vseh piškotkov (zlasti nujno potrebnih piškotkov za samo prijavo in plačilo paketa) vodi v to, da spletne aplikacije in ustvarjanja galerij ne boste mogli uspešno uporabljati.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Informacije o spremembah</h2>
          <p className="mb-6">To politiko lahko občasno posodobimo, in sicer zaradi odrazov spremenjene programske opreme ali zakonskih zahtev. Datum zadnje posodobitve se bo redno prenavljal ob izvedb.</p>
        </div>
      </div>
    </div>
  );
}
