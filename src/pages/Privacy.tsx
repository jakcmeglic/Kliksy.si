import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-gray-900 pb-24">
      <title>Politika zasebnosti | Kliksy.si</title>
      <meta name="description" content="Politika zasebnosti in obvestilo o obdelavi osebnih podatkov v okviru spletne storitve Kliksy.si." />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://kliksy.si/zasebnost" />

      {/* Header Container */}
      <div className="border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Nazaj na prvo stran
          </Link>
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100/60">
            GDPR & ZVOP-2 skladno
          </span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-10 md:pt-16">
        {/* Document Header */}
        <div className="mb-12 pb-8 border-b border-gray-200">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            Pravno obvestilo
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 leading-tight">
            POLITIKA ZASEBNOSTI IN OBVESTILO O OBDELAVI OSEBNIH PODATKOV
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Datum zadnje posodobitve: <span className="font-semibold text-gray-700">9. 10. 2026</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-12 text-gray-700 leading-relaxed text-[16px] md:text-[17px]">
          
          {/* 1. UPRAVLJAVEC */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200/80 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-950 mb-4 flex items-center gap-2">
              <span className="text-[#5B45FF]">1.</span> Upravljavec osebnih podatkov
            </h2>
            <p className="mb-4">
              Upravljavec osebnih podatkov, zbranih v okviru spletne storitve Kliksy.si, je:
            </p>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/70 space-y-1.5 font-medium text-gray-800">
              <div className="font-bold text-lg text-gray-950">Jaka Meglič s.p.</div>
              <div>Zelenica 4, 4290 Tržič, Slovenija</div>
              <div className="pt-2 flex flex-wrap gap-y-2 gap-x-6 text-sm">
                <a href="mailto:info@kliksy.si" className="inline-flex items-center text-[#5B45FF] hover:underline">
                  <Mail className="w-4 h-4 mr-1.5" /> info@kliksy.si
                </a>
                <a href="tel:040230880" className="inline-flex items-center text-[#5B45FF] hover:underline">
                  <Phone className="w-4 h-4 mr-1.5" /> 040 230 880
                </a>
                <a href="https://kliksy.si" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#5B45FF] hover:underline">
                  <ExternalLink className="w-4 h-4 mr-1.5" /> https://kliksy.si
                </a>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Za vprašanja v zvezi z obdelavo osebnih podatkov se lahko obrnete na zgoraj navedeni e-poštni naslov.
            </p>
          </section>

          {/* 2. KATERE PODATKE OBDELUJEMO */}
          <section>
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">2.</span> Katere osebne podatke obdelujemo?
            </h2>
            <p className="mb-6">
              Glede na način uporabe storitve lahko obdelujemo naslednje kategorije osebnih podatkov:
            </p>

            <div className="space-y-5">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Podatki uporabniškega računa</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>e-poštni naslov;</li>
                  <li>podatke, potrebne za prijavo in upravljanje uporabniškega računa;</li>
                  <li>identifikator uporabniškega računa;</li>
                  <li>podatke o potrditvi e-poštnega naslova.</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Podatki o dogodkih</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>ime dogodka;</li>
                  <li>vrsto dogodka;</li>
                  <li>datum dogodka;</li>
                  <li>fotografije in druge vsebine, ki jih uporabnik naloži v galerijo;</li>
                  <li>podatke, potrebne za upravljanje dogodka in uporabo izbranega paketa.</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Podatki o naročilih in plačilih</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700 mb-4">
                  <li>podatke o kupljenem paketu;</li>
                  <li>znesek in datum plačila;</li>
                  <li>status plačila;</li>
                  <li>identifikator transakcije in druge podatke, potrebne za obravnavo naročil, reklamacij in izpolnjevanje zakonskih obveznosti.</li>
                </ul>
                <div className="p-3.5 bg-blue-50/70 rounded-lg text-sm text-blue-900 border border-blue-100">
                  Podatke o plačilnih karticah obdeluje plačilni ponudnik Stripe v skladu s svojimi pogoji in pravili zasebnosti. Kliksy.si ne zahteva, da uporabnik podatke o kartici posreduje neposredno prek e-pošte.
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-2">Tehnični in varnostni podatki</h3>
                <p className="text-gray-700">
                  Pri uporabi spletne storitve se lahko obdelujejo tudi tehnični podatki, potrebni za delovanje in varnost sistema, na primer podatki o prijavah, čas dostopa, tehnični identifikatorji ter dnevniki napak in varnostnih dogodkov, če jih uporabljene tehnologije beležijo.
                </p>
              </div>
            </div>
          </section>

          {/* 3. NAMENI IN PRAVNE PODLAGE */}
          <section>
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">3.</span> Nameni in pravne podlage obdelave
            </h2>
            <p className="mb-6">
              Osebne podatke obdelujemo samo za določene namene in na ustrezni pravni podlagi.
            </p>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-2">3.1. Registracija in upravljanje uporabniškega računa</h3>
                <p className="mb-2">
                  Podatke obdelujemo za ustvarjanje računa, potrditev e-poštnega naslova, prijavo, zagotavljanje dostopa do storitve ter upravljanje uporabniškega računa.
                </p>
                <p className="text-sm font-medium text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <strong className="text-gray-900">Pravna podlaga:</strong> izvajanje pogodbe oziroma izvajanje ukrepov na zahtevo posameznika pred sklenitvijo pogodbe, kadar je to ustrezna podlaga po členu 6(1)(b) GDPR.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-2">3.2. Ustvarjanje dogodkov in zagotavljanje galerij</h3>
                <p className="mb-2">
                  Podatke o dogodkih in naložene vsebine obdelujemo za ustvarjanje, prikazovanje, upravljanje in shranjevanje galerij ter zagotavljanje funkcionalnosti izbranega paketa.
                </p>
                <p className="text-sm font-medium text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <strong className="text-gray-900">Pravna podlaga:</strong> izvajanje pogodbe oziroma ukrepov na zahtevo uporabnika pred sklenitvijo pogodbe, kadar je to ustrezna pravna podlaga.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-2">3.3. Obdelava plačil in upravljanje naročil</h3>
                <p className="mb-2">
                  Podatke o naročilih in plačilih obdelujemo za izvedbo nakupa, preverjanje uspešnosti plačila, omogočanje dostopa do plačljivega paketa, obravnavo reklamacij in vodenje poslovnih evidenc.
                </p>
                <p className="text-sm font-medium text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <strong className="text-gray-900">Pravne podlage:</strong> izvajanje pogodbe in izpolnjevanje zakonskih obveznosti, zlasti obveznosti s področja računovodstva in davkov.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-2">3.4. Varnost in preprečevanje zlorab</h3>
                <p className="mb-2">
                  Podatke lahko obdelujemo za zaščito uporabniških računov, preprečevanje nepooblaščenega dostopa, odkrivanje zlorab, odpravljanje tehničnih napak in zagotavljanje varnosti storitve.
                </p>
                <p className="text-sm font-medium text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <strong className="text-gray-900">Pravna podlaga:</strong> zakoniti interesi upravljavca, kadar so izpolnjeni pogoji iz člena 6(1)(f) GDPR. Zakoniti interes je zagotavljanje varnosti in zanesljivosti spletne storitve ter preprečevanje zlorab.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-2">3.5. Komunikacija z uporabniki</h3>
                <p className="mb-2">
                  Podatke obdelujemo za odgovarjanje na vprašanja, obravnavo zahtevkov, tehnično podporo in pošiljanje sporočil, ki so potrebna za delovanje računa ali kupljene storitve.
                </p>
                <p className="text-sm font-medium text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <strong className="text-gray-900">Pravna podlaga:</strong> izvajanje pogodbe, zakonita obveznost ali zakoniti interes, odvisno od vrste komunikacije.
                </p>
              </div>
            </div>

            <p className="mt-5 text-gray-600 text-sm italic">
              Če bi želeli osebne podatke uporabljati za druge namene, ki niso združljivi z zgoraj navedenimi, bomo pred takšno nadaljnjo obdelavo posamezniku zagotovili ustrezne informacije in pridobili privolitev, kadar bo ta potrebna.
            </p>
          </section>

          {/* 4. GOOGLE FIREBASE IN STRIPE */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">4.</span> Uporaba storitev Google Firebase in Stripe
            </h2>
            <p className="mb-6">
              Za zagotavljanje delovanja Kliksy.si uporabljamo zunanje ponudnike tehnoloških in plačilnih storitev.
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-indigo-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Google Firebase</h3>
                <p className="mb-3">
                  Firebase uporabljamo za hrambo in upravljanje podatkov ter fotografij in za funkcionalnosti, povezane z uporabniškimi računi in delovanjem storitve.
                </p>
                <p className="mb-3">
                  Google pri uporabi Firebase praviloma nastopa kot obdelovalec osebnih podatkov, ki jih obdeluje v našem imenu, pri čemer so njegove obveznosti določene v ustreznih pogodbenih pogojih za obdelavo podatkov.
                </p>
                <p className="mb-3">
                  Podatki se lahko glede na uporabljene storitve Firebase, konfiguracijo in veljavne pogoje obdelujejo v različnih državah, tudi zunaj Evropskega gospodarskega prostora. Za morebitne prenose osebnih podatkov se uporabljajo ustrezni mehanizmi in zaščitni ukrepi, kadar so zahtevani z veljavno zakonodajo.
                </p>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-semibold text-gray-900">Več informacij:</span>
                  </div>
                  <div>
                    • Firebase – zasebnost in varnost:{' '}
                    <a href="https://firebase.google.com/support/privacy/" target="_blank" rel="noopener noreferrer" className="text-[#5B45FF] hover:underline break-all">
                      https://firebase.google.com/support/privacy/
                    </a>
                  </div>
                  <div>
                    • Firebase – pogoji obdelave in varstva podatkov:{' '}
                    <a href="https://firebase.google.com/terms/data-processing-terms" target="_blank" rel="noopener noreferrer" className="text-[#5B45FF] hover:underline break-all">
                      https://firebase.google.com/terms/data-processing-terms
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-4 py-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Stripe</h3>
                <p className="mb-3">
                  Stripe uporabljamo za obdelavo plačil s plačilnimi karticami in zagotavljanje povezanih plačilnih funkcionalnosti.
                </p>
                <p className="mb-3">
                  Stripe lahko glede na posamezno dejavnost nastopa kot samostojni upravljavec ali obdelovalec osebnih podatkov. Obseg njegove obdelave je določen z njegovo vlogo, pogodbenimi pogoji in veljavnimi pravili.
                </p>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-semibold text-gray-900">Več informacij:</span>
                  </div>
                  <div>
                    • Stripe – politika zasebnosti:{' '}
                    <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#5B45FF] hover:underline break-all">
                      https://stripe.com/privacy
                    </a>
                  </div>
                  <div>
                    • Stripe – pogodba o obdelavi podatkov:{' '}
                    <a href="https://stripe.com/legal/dpa" target="_blank" rel="noopener noreferrer" className="text-[#5B45FF] hover:underline break-all">
                      https://stripe.com/legal/dpa
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. FOTOGRAFIJE IN OSEBNI PODATKI DRUGIH OSEB */}
          <section>
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">5.</span> Fotografije in osebni podatki drugih oseb
            </h2>
            <p className="mb-4">
              Galerije lahko vsebujejo fotografije in videoposnetke, na katerih so prepoznavni posamezniki.
            </p>
            <p className="mb-4">
              Uporabnik, ki ustvari dogodek in naloži vsebine, mora zagotoviti, da ima ustrezno pravno podlago za njihovo zbiranje, nalaganje, shranjevanje in deljenje ter da pri tem spoštuje pravice posameznikov, katerih podatki so vključeni v vsebine.
            </p>
            <p className="mb-4">
              Glede vsebin, ki jih uporabnik naloži za svoj dogodek, lahko uporabnik določa namen in način njihove uporabe, Kliksy.si pa lahko pri zagotavljanju tehničnega delovanja galerije nastopa kot obdelovalec v njegovem imenu, kadar so za to izpolnjeni pogoji GDPR.
            </p>
            <p className="mb-8">
              Kliksy.si vsebine obdeluje v obsegu, ki je potreben za zagotavljanje storitve, njeno varnost in izpolnjevanje zakonskih obveznosti.
            </p>

            {/* 5.1 */}
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-6 md:p-7">
              <h3 className="text-xl font-bold text-amber-950 mb-3 flex items-center gap-2">
                <span>5.1</span> Dostop do galerij in odgovornost uporabnika
              </h3>
              <div className="space-y-3.5 text-amber-950 text-[15px] md:text-[16px]">
                <p>
                  Galerije dogodkov na Kliksy.si so dostopne osebam, ki imajo povezavo do galerije oziroma ustrezno QR-kodo za dostop.
                </p>
                <p>
                  Galerija ni namenjena javnemu iskanju po imenu dogodka, vendar lahko do njene vsebine dostopa vsakdo, ki pridobi veljavno povezavo ali QR-kodo. Dostop zato ni omejen izključno na povabljene goste.
                </p>
                <p>
                  Uporabnik, ki ustvari dogodek oziroma kupi paket, je odgovoren za ustrezno deljenje povezave in QR-kode ter za to, da ju posreduje samo osebam, ki jim želi omogočiti dostop do galerije. Uporabniku priporočamo, da povezave oziroma QR-kode ne objavlja na javno dostopnih mestih, če želi omejiti dostop do fotografij.
                </p>
                <p>
                  Uporabnik mora pri nalaganju fotografij in videoposnetkov spoštovati veljavno zakonodajo, pravice do zasebnosti in druge pravice oseb, ki so prikazane na vsebinah. Zagotoviti mora ustrezno pravno podlago za nalaganje in deljenje teh vsebin.
                </p>
                <p>
                  Kliksy.si zagotavlja tehnično delovanje galerije, vendar zgolj obstoj povezave ali QR-kode ne omogoča preverjanja, ali je oseba, ki do galerije dostopa, dejansko povabljeni gost.
                </p>
                <p className="pt-2 font-medium">
                  Če uporabnik ugotovi, da je bila povezava do galerije razkrita ali da se vsebine uporabljajo nedovoljeno, naj nas o tem obvesti na{' '}
                  <a href="mailto:info@kliksy.si" className="underline font-bold text-indigo-900 hover:text-indigo-950">
                    info@kliksy.si
                  </a>
                  . Zahtevo bomo obravnavali glede na okoliščine in veljavne zakonske obveznosti.
                </p>
              </div>
            </div>
          </section>

          {/* 6. KOMU POSREDUJEMO */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">6.</span> Komu lahko posredujemo osebne podatke?
            </h2>
            <p className="font-bold text-gray-950 mb-3">
              Osebnih podatkov ne prodajamo.
            </p>
            <p className="mb-4">
              Podatke lahko posredujemo oziroma omogočimo dostop do njih naslednjim kategorijam prejemnikov, kadar je to potrebno za zagotavljanje storitve ali izpolnjevanje zakonskih obveznosti:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
              <li>ponudnikom gostovanja, podatkovnih zbirk in infrastrukture, zlasti Google Firebase;</li>
              <li>ponudniku plačilnih storitev Stripe;</li>
              <li>pooblaščenim tehničnim izvajalcem, kadar potrebujejo dostop za vzdrževanje ali podporo;</li>
              <li>računovodskim, davčnim, pravnim ali drugim strokovnim izvajalcem, kadar je to potrebno;</li>
              <li>pristojnim državnim organom, kadar to zahteva zakon ali veljaven pravni postopek.</li>
            </ul>
            <p className="mb-3 text-sm text-gray-600">
              Dostop do osebnih podatkov omejujemo na obseg, ki je potreben za posamezen namen.
            </p>
            <p className="text-sm text-gray-600">
              Če so fotografije oziroma galerije nastavljene tako, da so dostopne drugim osebam prek povezave ali drugega načina dostopa, lahko te osebe vidijo vsebine v obsegu, ki ga omogočajo nastavitve galerije.
            </p>
          </section>

          {/* 7. PRENOSI V TRETJE DRŽAVE */}
          <section>
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">7.</span> Prenosi osebnih podatkov v tretje države
            </h2>
            <p className="mb-3">
              Nekateri naši tehnološki ponudniki lahko osebne podatke obdelujejo tudi zunaj Evropskega gospodarskega prostora.
            </p>
            <p className="mb-3">
              Če pride do prenosa osebnih podatkov v tretjo državo, se tak prenos izvede v skladu z zahtevami GDPR in ob uporabi ustreznega mehanizma za prenos, kadar je ta potreben. To lahko vključuje sklep o ustreznosti, ustrezne pogodbene klavzule ali drug zakonsko dovoljen mehanizem.
            </p>
            <p className="text-sm text-gray-600">
              Informacije o uporabljenih mehanizmih so na voljo v dokumentaciji zadevnih ponudnikov, na katero je opozorjeno v tej politiki.
            </p>
          </section>

          {/* 8. OBDOBJE HRAMBE */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">8.</span> Obdobje hrambe osebnih podatkov
            </h2>
            <p className="mb-6">
              Osebne podatke hranimo le toliko časa, kolikor je potrebno za namen, zaradi katerega so bili zbrani, oziroma toliko časa, kolikor to zahtevajo veljavni predpisi.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Uporabniški račun</h3>
                <p className="text-gray-700">
                  Podatke hranimo, dokler je račun aktiven in je to potrebno za zagotavljanje storitve. Po zaprtju računa podatke izbrišemo ali anonimiziramo, razen če je nadaljnja hramba potrebna zaradi zakonskih obveznosti, reševanja sporov ali uveljavljanja pravnih zahtevkov.
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-2">Podatki o dogodkih, fotografije in videoposnetki</h3>
                <p className="mb-3 text-gray-700">
                  Obdobje dostopnosti galerije je odvisno od kupljenega paketa:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-3 text-gray-800 font-medium">
                  <li><strong className="text-gray-950">Basic:</strong> galerija se samodejno izbriše po enem mesecu;</li>
                  <li><strong className="text-gray-950">Plus:</strong> galerija se samodejno izbriše po enem letu;</li>
                  <li><strong className="text-gray-950">Premium:</strong> galerija se samodejno izbriše po dveh letih.</li>
                </ul>
                <p className="text-sm text-gray-600 mb-3">
                  Obdobje se šteje od datuma dogodka. Točen datum poteka oziroma brisanja mora biti uporabniku jasno predstavljen ob nakupu.
                </p>
                <p className="text-sm text-gray-600">
                  Uporabnik lahko fotografije in druge vsebine izbriše tudi pred potekom paketa, če mu storitev to omogoča. Po izvedenem izbrisu se sproži postopek odstranitve vsebin iz aktivnih sistemov, ki jih upravljamo.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Podatki o naročilih in računovodski podatki</h3>
                <p className="text-gray-700">
                  Podatke, ki jih moramo hraniti zaradi davčnih, računovodskih ali drugih zakonskih obveznosti, hranimo toliko časa, kot določajo veljavni predpisi.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Tehnični in varnostni dnevniki</h3>
                <p className="text-gray-700">
                  Te podatke hranimo toliko časa, kolikor je potrebno za zagotavljanje varnosti, odpravljanje napak in obravnavo morebitnih zlorab, glede na vrsto podatkov in namen njihovega zbiranja.
                </p>
              </div>

              <div className="pt-2 text-sm text-gray-500 italic border-t border-gray-100">
                Kadar posamezen rok hrambe ni določen, uporabimo merila, kot so trajanje pogodbenega razmerja, namen obdelave, tehnična nujnost ter zakonski roki.
              </div>
            </div>
          </section>

          {/* 9. PRAVICE POSAMEZNIKOV */}
          <section>
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">9.</span> Pravice posameznikov
            </h2>
            <p className="mb-4">
              V skladu z GDPR imate, kadar so izpolnjeni zakonski pogoji, naslednje pravice:
            </p>
            <div className="space-y-3 mb-6">
              <div className="p-3.5 bg-white rounded-lg border border-gray-200">
                <strong className="text-gray-950">Pravica do dostopa:</strong> zahtevate lahko potrditev, ali obdelujemo vaše osebne podatke, ter dostop do njih in informacije o obdelavi.
              </div>
              <div className="p-3.5 bg-white rounded-lg border border-gray-200">
                <strong className="text-gray-950">Pravica do popravka:</strong> zahtevate lahko popravek netočnih ali dopolnitev nepopolnih podatkov.
              </div>
              <div className="p-3.5 bg-white rounded-lg border border-gray-200">
                <strong className="text-gray-950">Pravica do izbrisa:</strong> zahtevate lahko izbris podatkov, kadar so izpolnjeni zakonski pogoji.
              </div>
              <div className="p-3.5 bg-white rounded-lg border border-gray-200">
                <strong className="text-gray-950">Pravica do omejitve obdelave:</strong> zahtevate lahko omejitev obdelave v primerih, ki jih določa GDPR.
              </div>
              <div className="p-3.5 bg-white rounded-lg border border-gray-200">
                <strong className="text-gray-950">Pravica do prenosljivosti:</strong> v zakonsko določenih primerih lahko zahtevate prejem podatkov v strukturirani, splošno uporabljani in strojno berljivi obliki.
              </div>
              <div className="p-3.5 bg-white rounded-lg border border-gray-200">
                <strong className="text-gray-950">Pravica do ugovora:</strong> kadar obdelava temelji na zakonitem interesu, lahko ugovarjate obdelavi iz razlogov, povezanih z vašim položajem.
              </div>
              <div className="p-3.5 bg-white rounded-lg border border-gray-200">
                <strong className="text-gray-950">Pravica do preklica privolitve:</strong> kadar obdelava temelji na privolitvi, jo lahko kadar koli prekličete. Preklic ne vpliva na zakonitost obdelave pred preklicem.
              </div>
            </div>

            <div className="bg-indigo-50/60 p-5 rounded-xl border border-indigo-100 text-sm space-y-2.5 text-gray-800">
              <p>
                Za uveljavljanje pravic pišite na{' '}
                <a href="mailto:info@kliksy.si" className="font-bold text-[#5B45FF] hover:underline">
                  info@kliksy.si
                </a>
                . Zaradi varstva podatkov lahko pred obravnavo zahteve preverimo vašo identiteto, kadar je to potrebno in sorazmerno.
              </p>
              <p>
                Na zahteve bomo odgovorili brez nepotrebnega odlašanja in praviloma v enem mesecu od prejema, ob upoštevanju zakonskih pogojev za morebitno podaljšanje roka.
              </p>
              <p>
                Pravice se lahko v posameznih primerih omejijo, če to dopušča GDPR ali druga veljavna zakonodaja.
              </p>
              <p>
                Če se obdelava nanaša na fotografije oziroma vsebine, za katere je upravljavec druga oseba, lahko zahtevo posredujemo temu upravljavcu ali vam pojasnimo, na koga se morate obrniti, kadar je to primerno.
              </p>
            </div>
          </section>

          {/* 10. PRITOŽBA PRI NADZORNEM ORGANU */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">10.</span> Pravica do pritožbe pri nadzornem organu
            </h2>
            <p className="mb-4">
              Če menite, da se vaši osebni podatki obdelujejo v nasprotju z veljavnimi predpisi, imate pravico vložiti pritožbo pri pristojnem nadzornem organu:
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4 font-medium text-gray-900">
              <div className="font-bold">Informacijski pooblaščenec Republike Slovenije</div>
              <div>Dunajska cesta 22, 1000 Ljubljana</div>
              <div>
                Spletna stran:{' '}
                <a href="https://www.ip-rs.si/" target="_blank" rel="noopener noreferrer" className="text-[#5B45FF] hover:underline font-semibold">
                  https://www.ip-rs.si/
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Pravica do pritožbe ne posega v druge upravne ali sodne postopke, ki so vam na voljo.
            </p>
          </section>

          {/* 11. ALI MORATE POSREDOVATI */}
          <section>
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">11.</span> Ali morate posredovati osebne podatke?
            </h2>
            <div className="space-y-3">
              <p>
                Posredovanje določenih podatkov, zlasti e-poštnega naslova in podatkov, potrebnih za vzpostavitev računa, je potrebno za registracijo in uporabo funkcionalnosti, ki zahtevajo uporabniški račun.
              </p>
              <p>
                Podatki, potrebni za izvedbo nakupa, so potrebni za obdelavo naročila in omogočanje plačljivega paketa.
              </p>
              <p>
                Če teh podatkov ne posredujete, morda ne boste mogli ustvariti računa, zaključiti nakupa ali uporabljati ustrezne funkcionalnosti.
              </p>
              <p className="text-sm text-gray-600">
                Drugi podatki se posredujejo prostovoljno, razen kadar je ob posameznem obrazcu izrecno navedeno drugače.
              </p>
            </div>
          </section>

          {/* 12. AVTOMATIZIRANO SPREJEMANJE ODLOČITEV */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">12.</span> Avtomatizirano sprejemanje odločitev
            </h2>
            <p className="mb-3">
              Kliksy.si na podlagi osebnih podatkov ne izvaja avtomatiziranega sprejemanja odločitev ali profiliranja, ki bi imelo pravne učinke za posameznika ali bi nanj podobno pomembno vplivalo.
            </p>
            <p className="text-sm text-gray-600">
              Če bi takšno obdelavo v prihodnje uvedli, bomo posameznikom zagotovili informacije, ki jih zahteva GDPR, in izpolnili druge veljavne zakonske obveznosti.
            </p>
          </section>

          {/* 13. VARNOST */}
          <section>
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">13.</span> Varnost osebnih podatkov
            </h2>
            <div className="space-y-3">
              <p>
                Izvajamo ustrezne tehnične in organizacijske ukrepe, namenjene zaščiti osebnih podatkov pred nepooblaščenim dostopom, izgubo, uničenjem, spremembo ali razkritjem.
              </p>
              <p>
                Ukrepi vključujejo varovanje dostopa do sistemov, upravljanje uporabniških pravic in uporabo varnostnih funkcij ponudnikov infrastrukture, kjer so na voljo in ustrezno konfigurirane.
              </p>
              <p className="text-sm text-gray-600">
                Kljub sprejetim ukrepom ni mogoče zagotoviti popolne varnosti vseh informacijskih sistemov. V primeru kršitve varnosti osebnih podatkov bomo ravnali v skladu z veljavnimi zakonskimi obveznostmi.
              </p>
            </div>
          </section>

          {/* 14. SPREMEMBE POLITKE */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-950 mb-4">
              <span className="text-[#5B45FF]">14.</span> Spremembe politike zasebnosti
            </h2>
            <p className="mb-3">
              To politiko lahko občasno posodobimo zaradi sprememb storitve, uporabljenih tehnologij, zakonodaje ali načina obdelave osebnih podatkov.
            </p>
            <p className="mb-3">
              Veljavna različica je vedno objavljena na spletni strani Kliksy.si, skupaj z datumom zadnje posodobitve.
            </p>
            <p className="text-sm text-gray-600">
              Če sprememba zahteva posebno obvestilo posameznikom, bomo to izvedli na ustrezen način.
            </p>
          </section>

          {/* 15. KONTAKT */}
          <section className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 rounded-3xl p-8 md:p-10 border border-indigo-100 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950 mb-3">
              <span className="text-[#5B45FF]">15.</span> Kontakt
            </h2>
            <p className="text-gray-700 mb-6">
              Za vsa vprašanja, zahteve ali uveljavljanje pravic v zvezi z obdelavo osebnih podatkov nas kontaktirajte:
            </p>
            
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-indigo-100/80 shadow-sm space-y-3 font-medium text-gray-800">
              <div className="text-lg font-bold text-gray-950">Jaka Meglič s.p. – Kliksy.si</div>
              <div className="text-gray-600">Zelenica 4, 4290 Tržič, Slovenija</div>
              <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm">
                <a href="mailto:info@kliksy.si" className="inline-flex items-center text-[#5B45FF] hover:underline font-semibold">
                  <Mail className="w-4 h-4 mr-2" /> info@kliksy.si
                </a>
                <a href="tel:040230880" className="inline-flex items-center text-[#5B45FF] hover:underline font-semibold">
                  <Phone className="w-4 h-4 mr-2" /> 040 230 880
                </a>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Več informacij o naših storitvah je na voljo na{' '}
              <a href="https://kliksy.si" className="text-[#5B45FF] font-semibold hover:underline">
                https://kliksy.si
              </a>
              .
            </p>
          </section>

        </div>

        {/* Bottom Back Button */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:text-gray-950 hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazaj na prvo stran
          </Link>
        </div>
      </main>
    </div>
  );
}
