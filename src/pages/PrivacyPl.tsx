import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPl() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-10 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nazaj na prvo stran
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Politika privatnosti</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">Varstvo vaših osebnih podatkov je za nas zelo pomembno. V tej politiki zasebnosti pojasnjujemo, katere osebne podatke zbiramo, kako jih uporabljamo, shranjujemo in varujemo v skladu s Splošno uredbo o varstvu podatkov (GDPR) in slovensko zakonodajo (ZVOP-1 in ZVOP-2).</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Upravljavec osebnih podatkov</h2>
          <p className="mb-6">Upravljavec osebnih podatkov je podjetje (v nadaljevanju: mi, Kliksy.si). Za vsa vprašanja v zvezi z obdelavo vaših podatkov nas lahko kontaktirate na info@kliksy.si.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Podatki, ki jih zbiramo</h2>
          <p className="mb-6">Za zagotavljanje naših storitev nam posredujete določene informacije:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Osnovni podatki ustvarjalca dogodka (ime, e-naslov, morebitni podatki podjetja, če gre za nakup na podjetje) z namenom izvedbe plačila in odprtja dogodka.</li>
            <li>Podatki o dogodku (ime dogodka, datum, izbrani paket).</li>
            <li>Fotografije in drugi vizualni material, ki ga naložijo gosti/udeleženci znotraj virtualne galerije.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Namen in pravna podlaga</h2>
          <p className="mb-6">Zbrane osebne podatke obdelujemo predvsem za:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Izvajanje pogodbe:</strong> Kreiranje vašega dogodka, pošiljanje QR kod in potrditev plačila, vzdrževanje dostopa do galerij.</li>
            <li><strong>Zakonske obveznosti:</strong> Izdaja računov in reševanje morebitnih reklamacij (hramba v skladu z davčno zakonodajo).</li>
            <li><strong>Zakoniti interes:</strong> Redno obveščanje strank in preprečevanje zlorab na naših sistemih.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Obdelava fotografij</h2>
          <p className="mb-6">Kliksy.si zagotavlja zgolj prostor za shranjevanje. Čeprav skrbimo za varnost in dostopnost do podatkov preprečujemo z varnimi URL povezavami, poudarjamo, da je polna odgovornost za naložene fotografije vedno na strani organizatorja posameznega dogodka, kateri nosi tudi odgovornost za informiranje in pridobitev ustreznih soglasij svojih gostov za slikanje.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Posredovanje tretjim osebam</h2>
          <p className="mb-6">Vaših osebnih podatkov nikoli ne prodajamo ali posojamo nepooblaščenim tretjim osebam. Podatke v nekaterih primerih obdelujejo naši pogodbeni procesorji (na primer Stripe za izvedbo varnega plačila ali Firebase za varno hrambo in bazo), ki so strogo zavezani k visokim standardom informacijske varnosti in GDPR skladnosti.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Rok hrambe in pravice uporabnikov</h2>
          <p className="mb-6">Vaše podatke hranimo toliko časa, kolikor je to nujno potrebno za dosego namenov oz. kolikor določa izbrani paket pri zakupu pametne galerije (1 leto, 2 leti...). Po preteku se podatki anonimizirajo ali pa trajno izbrišejo.</p>
          <p className="mb-6">V skladu z GDPR imate pravico do dostopa, popravka, izbrisa ("pravica do pozabe"), omejitve obdelave in ugovora. Zahtevke sprejemamo na elektronski naslov info@kliksy.si.</p>
        </div>
      </div>
    </div>
  );
}
