import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-20">
      <div className="max-w-3xl mx-auto px-6 pt-12 md:pt-20">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-10 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Nazaj na prvo stran
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">Pogoji uporabe</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">Splošni pogoji poslovanja in uporabe spletne strani kliksy.si so sestavljeni v skladu z Zakonom o varstvu potrošnikov (ZVPot), Zakonom o varstvu osebnih podatkov (ZVOP-1), Splošno uredbo o varstvu podatkov (GDPR) in Zakonom o elektronskih komunikacijah (ZEKom-1).</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Splošne določbe</h2>
          <p className="mb-6">Z uporabo spletnega mesta kliksy.si potrjujete, da ste seznanjeni in se strinjate z navedenimi pogoji uporabe. Storitev omogoča ustvarjanje virtualnih galerij za shranjevanje in deljenje fotografij iz dogodkov.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Uporaba storitve in ustvarjanje dogodkov</h2>
          <p className="mb-6">Z ustvarjanjem dogodka na naši platformi zakupljate dostop do virtualne galerije, kjer vaše stranke/gosti lahko nalagajo fotografije. Uporabnik je dolžan platformo uporabljati v skladu s predpisi.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 bg-yellow-100 px-4 py-2 rounded-lg inline-block">3. Odgovornost za naložene vsebine (Pomembno)</h2>
          <p className="mb-6 font-medium text-gray-800">
            Organizatorji oziroma tisti ponudniki (uporabniki), ki na naši platformi ustvarijo in odprejo dogodek, prevzemajo popolno in izključno odgovornost za vse fotografije, videoposnetke ter druge vsebine, ki jih njim ali njihovim gostom uspe naložiti v dotično virtualno galerijo. 
          </p>
          <p className="mb-6">
            Kliksy.si (upravljavec platforme) nastopa zgolj kot ponudnik tehnološke rešitve oz. informacijske infrastrukture za lažje zbiranje slik in pri tem ročno ne pregleduje vsake naložene fotografije. V kolikor se v galeriji znajdejo neprimerne, avtorsko sporne ali nezakonite vsebine (npr. golota, nasilje, protipravne vsebine), je dolžnost in odgovornost ustvarjalca dogodka, da te slike redno pregleduje in s pomočjo orodij (ki so na voljo v nadzorni plošči) nemudoma izbriše.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Cene in plačilo</h2>
          <p className="mb-6">Vse cene na spletnem mestu so navedene v evrih. Plačila se izvajajo prek varne povezave (Stripe). Za vsa vplačila izdamo ustrezne račune, ki so v skladu s slovensko zakonodajo.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Pravica do odstopa od pogodbe in reklamacije</h2>
          <p className="mb-6">Uporabnik ima v skladu z ZVPot pravico, da nas v 14 dneh obvesti, če odstopa od pogodbe, in zahteva vračilo kupnine znotraj naše reklamacijske sheme in naše 30-dnevne garancije nezadovoljstva. Vračilo bo izvedeno na isto transakcijsko sredstvo.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">6. Omejitev odgovornosti upravljavca</h2>
          <p className="mb-6">Platforma zagotavlja visoko zanesljivost dostopanja do podatkov, kljub temu pa upravljavec ne prevzema odgovornosti za morebitne izpade delovanja strežnikov izven lastnega nadzora.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">7. Končne določbe</h2>
          <p className="mb-6">Pogoji uporabe pričnejo veljati z dnem objave. Upravljavec si pridržuje pravico do spremembe pogojev, o čemer se uporabnike pravočasno seznani.</p>
        </div>
      </div>
    </div>
  );
}
