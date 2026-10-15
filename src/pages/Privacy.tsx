import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-16">
        
        {/* Povezava nazaj na prvo stran */}
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors font-semibold text-sm group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Nazaj na prvo stran
        </Link>

        {/* Glavni naslov in datum zadnje posodobitve */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            Pravno obvestilo
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.15] mb-4 uppercase">
            POLITIKA ZASEBNOSTI IN OBVESTILO O OBDELAVI OSEBNIH PODATKOV
          </h1>
          <p className="text-sm font-semibold text-gray-600 border-b border-gray-100 pb-6">
            Datum zadnje posodobitve: <span className="font-bold text-gray-900">9. 10. 2026</span>
          </p>
        </header>

        {/* Vsebina */}
        <div className="space-y-12 text-gray-700 leading-relaxed text-[15px] md:text-[16px]">

          {/* 1. Upravljavec osebnih podatkov */}
          <section id="upravljavec">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              Upravljavec osebnih podatkov
            </h2>
            <p className="mb-4">
              Upravljavec osebnih podatkov, zbranih v okviru spletne storitve Kliksy.si, je:
            </p>
            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 mb-4 space-y-2">
              <p className="font-extrabold text-gray-900 text-lg">Jaka Meglič s.p.</p>
              <p className="text-gray-700 font-medium">Zelenica 4, 4290 Tržič, Slovenija</p>
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0066FF]" />
                  <span>E-pošta: <a href="mailto:info@kliksy.si" className="text-[#0066FF] font-semibold hover:underline">info@kliksy.si</a></span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0066FF]" />
                  <span>Telefon: <a href="tel:040230880" className="text-gray-900 font-semibold hover:underline">040 230 880</a></span>
                </p>
              </div>
              <p className="text-sm text-gray-700 pt-1">
                Spletna stran: <a href="https://kliksy.si" className="text-[#0066FF] font-semibold hover:underline">https://kliksy.si</a>
              </p>
            </div>
            <p className="text-gray-600">
              Za vprašanja v zvezi z obdelavo osebnih podatkov se lahko obrnete na zgoraj navedeni e-poštni naslov.
            </p>
          </section>

          {/* 2. Katere osebne podatke obdelujemo? */}
          <section id="kategorije-podatkov">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              Katere osebne podatke obdelujemo?
            </h2>
            <p className="mb-6">
              Glede na način uporabe storitve lahko obdelujemo naslednje kategorije osebnih podatkov:
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-3">2.1 Podatki uporabniškega računa</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>e-poštni naslov;</li>
                  <li>podatke, potrebne za prijavo in upravljanje uporabniškega računa;</li>
                  <li>identifikator uporabniškega računa;</li>
                  <li>podatke o potrditvi e-poštnega naslova.</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-3">2.2 Podatki o dogodkih</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
                  <li>ime dogodka;</li>
                  <li>vrsto dogodka;</li>
                  <li>datum dogodka;</li>
                  <li>fotografije in druge vsebine, ki jih uporabnik naloži v galerijo;</li>
                  <li>podatke, potrebne za upravljanje dogodka in uporabo izbranega paketa.</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-3">2.3 Podatki o naročilih in plačilih</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700 mb-4">
                  <li>podatke o kupljenem paketu;</li>
                  <li>znesek in datum plačila;</li>
                  <li>status plačila;</li>
                  <li>identifikator transakcije in druge podatke, potrebne za obravnavo naročil, reklamacij in izpolnjevanje zakonskih obveznosti.</li>
                </ul>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                  Podatke o plačilnih karticah obdeluje plačilni ponudnik Stripe v skladu s svojimi pogoji in pravili zasebnosti. Kliksy.si ne zahteva, da uporabnik podatke o kartici posreduje neposredno prek e-pošte.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-3">2.4 Tehnični in varnostni podatki</h3>
                <p className="text-gray-700">
                  Pri uporabi spletne storitve se lahko obdelujejo tudi tehnični podatki, potrebni za delovanje in varnost sistema, na primer podatki o prijavah, čas dostopa, tehnični identifikatorji ter dnevniki napak in varnostnih dogodkov, če jih uporabljene tehnologije beležijo.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Nameni in pravne podlage obdelave */}
          <section id="nameni-in-podlage">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              Nameni in pravne podlage obdelave
            </h2>
            <p className="mb-6">
              Osebne podatke obdelujemo samo za določene namene in na ustrezni pravni podlagi.
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.1 Registracija in upravljanje uporabniškega računa</h3>
                <p className="text-gray-700 mb-2">
                  Podatke obdelujemo za ustvarjanje računa, potrditev e-poštnega naslova, prijavo, zagotavljanje dostopa do storitve ter upravljanje uporabniškega računa.
                </p>
                <p className="text-sm font-semibold text-gray-600 bg-blue-50/60 text-[#0066FF] px-3 py-1.5 rounded-md inline-block">
                  Pravna podlaga: izvajanje pogodbe oziroma izvajanje ukrepov na zahtevo posameznika pred sklenitvijo pogodbe, kadar je to ustrezna podlaga po členu 6(1)(b) GDPR.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.2 Ustvarjanje dogodkov in zagotavljanje galerij</h3>
                <p className="text-gray-700 mb-2">
                  Podatke o dogodkih in naložene vsebine obdelujemo za ustvarjanje, prikazovanje, upravljanje in shranjevanje galerij ter zagotavljanje funkcionalnosti izbranega paketa.
                </p>
                <p className="text-sm font-semibold text-gray-600 bg-blue-50/60 text-[#0066FF] px-3 py-1.5 rounded-md inline-block">
                  Pravna podlaga: izvajanje pogodbe oziroma ukrepov na zahtevo uporabnika pred sklenitvijo pogodbe, kadar je to ustrezna pravna podlaga.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.3 Obdelava plačil in upravljanje naročil</h3>
                <p className="text-gray-700 mb-2">
                  Podatke o naročilih in plačilih obdelujemo za izvedbo nakupa, preverjanje uspešnosti plačila, omogočanje dostopa do plačljivega paketa, obravnavo reklamacij in vodenje poslovnih evidenc.
                </p>
                <p className="text-sm font-semibold text-gray-600 bg-blue-50/60 text-[#0066FF] px-3 py-1.5 rounded-md inline-block">
                  Pravne podlage: izvajanje pogodbe in izpolnjevanje zakonskih obveznosti, zlasti obveznosti s področja računovodstva in davkov.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.4 Varnost in preprečevanje zlorab</h3>
                <p className="text-gray-700 mb-2">
                  Podatke lahko obdelujemo za zaščito uporabniških računov, preprečevanje nepooblaščenega dostopa, odkrivanje zlorab, odpravljanje tehničnih napak in zagotavljanje varnosti storitve.
                </p>
                <p className="text-sm font-semibold text-gray-600 bg-blue-50/60 text-[#0066FF] px-3 py-1.5 rounded-md inline-block">
                  Pravna podlaga: zakoniti interesi upravljavca, kadar so izpolnjeni pogoji iz člena 6(1)(f) GDPR. Zakoniti interes je zagotavljanje varnosti in zanesljivosti spletne storitve ter preprečevanje zlorab.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.5 Komunikacija z uporabniki</h3>
                <p className="text-gray-700 mb-2">
                  Podatke obdelujemo za odgovarjanje na vprašanja, obravnavo zahtevkov, tehnično podporo in pošiljanje sporočil, ki so potrebna za delovanje računa ali kupljene storitve.
                </p>
                <p className="text-sm font-semibold text-gray-600 bg-blue-50/60 text-[#0066FF] px-3 py-1.5 rounded-md inline-block">
                  Pravna podlaga: izvajanje pogodbe, zakonita obveznost ali zakoniti interes, odvisno od vrste komunikacije.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-600">
              Če bi želeli osebne podatke uporabljati za druge namene, ki niso združljivi z zgoraj navedenimi, bomo pred takšno nadaljnjo obdelavo posamezniku zagotovili ustrezne informacije in pridobili privolitev, kadar bo ta potrebna.
            </div>
          </section>

          {/* 4. Uporaba storitev Google Firebase in Stripe */}
          <section id="storitve-firebase-stripe">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              Uporaba storitev Google Firebase in Stripe
            </h2>
            <p className="mb-6">
              Za zagotavljanje delovanja Kliksy.si uporabljamo zunanje ponudnike tehnoloških in plačilnih storitev.
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-3">4.1 Google Firebase</h3>
                <p className="text-gray-700 mb-3">
                  Firebase uporabljamo za hrambo in upravljanje podatkov ter fotografij in za funkcionalnosti, povezane z uporabniškimi računi in delovanjem storitve.
                </p>
                <p className="text-gray-700 mb-3">
                  Google pri uporabi Firebase praviloma nastopa kot obdelovalec osebnih podatkov, ki jih obdeluje v našem imenu, pri čemer so njegove obveznosti določene v ustreznih pogodbenih pogojih za obdelavo podatkov.
                </p>
                <p className="text-gray-700 mb-4">
                  Podatki se lahko glede na uporabljene storitve Firebase, konfiguracijo in veljavne pogoje obdelujejo v različnih državah, tudi zunaj Evropskega gospodarskega prostora. Za morebitne prenose osebnih podatkov se uporabljajo ustrezni mehanizmi in zaščitni ukrepi, kadar so zahtevani z veljavno zakonodajo.
                </p>
                <div className="pt-2 border-t border-gray-100 space-y-1.5 text-sm">
                  <p className="font-semibold text-gray-900">Več informacij:</p>
                  <p>
                    <a 
                      href="https://firebase.google.com/support/privacy/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#0066FF] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Firebase – zasebnost in varnost <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </p>
                  <p>
                    <a 
                      href="https://firebase.google.com/terms/data-processing-terms" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#0066FF] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Firebase – pogoji obdelave in varstva podatkov <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-3">4.2 Stripe</h3>
                <p className="text-gray-700 mb-3">
                  Stripe uporabljamo za obdelavo plačil s plačilnimi karticami in zagotavljanje povezanih plačilnih funkcionalnosti.
                </p>
                <p className="text-gray-700 mb-4">
                  Stripe lahko glede na posamezno dejavnost nastopa kot samostojni upravljavec ali obdelovalec osebnih podatkov. Obseg njegove obdelave je določen z njegovo vlogo, pogodbenimi pogoji in veljavnimi pravili.
                </p>
                <div className="pt-2 border-t border-gray-100 space-y-1.5 text-sm">
                  <p className="font-semibold text-gray-900">Več informacij:</p>
                  <p>
                    <a 
                      href="https://stripe.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#0066FF] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Stripe – politika zasebnosti <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </p>
                  <p>
                    <a 
                      href="https://stripe.com/legal/dpa" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#0066FF] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Stripe – pogodba o obdelavi podatkov <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Fotografije in osebni podatki drugih oseb */}
          <section id="fotografije-in-osebni-podatki">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
              Fotografije in osebni podatki drugih oseb
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Galerije lahko vsebujejo fotografije in videoposnetke, na katerih so prepoznavni posamezniki.
              </p>
              <p>
                Uporabnik, ki ustvari dogodek in naloži vsebine, mora zagotoviti, da ima ustrezno pravno podlago za njihovo zbiranje, nalaganje, shranjevanje in deljenje ter da pri tem spoštuje pravice posameznikov, katerih podatki so vključeni v vsebine.
              </p>
              <p>
                Glede vsebin, ki jih uporabnik naloži za svoj dogodek, lahko uporabnik določa namen in način njihove uporabe, Kliksy.si pa lahko pri zagotavljanju tehničnega delovanja galerije nastopa kot obdelovalec v njegovem imenu, kadar so za to izpolnjeni pogoji GDPR.
              </p>
              <p>
                Kliksy.si vsebine obdeluje v obsegu, ki je potreben za zagotavljanje storitve, njeno varnost in izpolnjevanje zakonskih obveznosti.
              </p>
            </div>
          </section>

          {/* 6. Dostop do galerij in odgovornost uporabnika */}
          <section id="dostop-in-odgovornost">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
              Dostop do galerij in odgovornost uporabnika
            </h2>
            <div className="space-y-4 text-gray-700">
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
              <p>
                Če uporabnik ugotovi, da je bila povezava do galerije razkrita ali da se vsebine uporabljajo nedovoljeno, naj nas o tem obvesti na <a href="mailto:info@kliksy.si" className="text-[#0066FF] font-semibold hover:underline">info@kliksy.si</a>. Zahtevo bomo obravnavali glede na okoliščine in veljavne zakonske obveznosti.
              </p>
            </div>
          </section>

          {/* 7. Komu lahko posredujemo osebne podatke? */}
          <section id="posredovanje-podatkov">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">7</span>
              Komu lahko posredujemo osebne podatke?
            </h2>
            <p className="font-semibold text-gray-900 mb-3">
              Osebnih podatkov ne prodajamo.
            </p>
            <p className="mb-4">
              Podatke lahko posredujemo oziroma omogočimo dostop do njih naslednjim kategorijam prejemnikov, kadar je to potrebno za zagotavljanje storitve ali izpolnjevanje zakonskih obveznosti:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>ponudnikom gostovanja, podatkovnih zbirk in infrastrukture, zlasti Google Firebase;</li>
              <li>ponudniku plačilnih storitev Stripe;</li>
              <li>pooblaščenim tehničnim izvajalcem, kadar potrebujejo dostop za vzdrževanje ali podporo;</li>
              <li>računovodskim, davčnim, pravnim ali drugim strokovnim izvajalcem, kadar je to potrebno;</li>
              <li>pristojnim državnim organom, kadar to zahteva zakon ali veljaven pravni postopek.</li>
            </ul>
            <p className="text-gray-700 mb-3">
              Dostop do osebnih podatkov omejujemo na obseg, ki je potreben za posamezen namen.
            </p>
            <p className="text-gray-700">
              Če so fotografije oziroma galerije nastavljene tako, da so dostopne drugim osebam prek povezave ali drugega načina dostopa, lahko te osebe vidijo vsebine v obsegu, ki ga omogočajo nastavitve galerije.
            </p>
          </section>

          {/* 8. Prenosi osebnih podatkov v tretje države */}
          <section id="prenosi-v-tretje-drzave">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">8</span>
              Prenosi osebnih podatkov v tretje države
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nekateri naši tehnološki ponudniki lahko osebne podatke obdelujejo tudi zunaj Evropskega gospodarskega prostora.
              </p>
              <p>
                Če pride do prenosa osebnih podatkov v tretjo državo, se tak prenos izvede v skladu z zahtevami GDPR in ob uporabi ustreznega mehanizma za prenos, kadar je ta potreben. To lahko vključuje sklep o ustreznosti, ustrezne pogodbene klavzule ali drug zakonsko dovoljen mehanizem.
              </p>
              <p>
                Informacije o uporabljenih mehanizmih so na voljo v dokumentaciji zadevnih ponudnikov, na katero je opozorjeno v tej politiki.
              </p>
            </div>
          </section>

          {/* 9. Obdobje hrambe osebnih podatkov */}
          <section id="obdobje-hrambe">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">9</span>
              Obdobje hrambe osebnih podatkov
            </h2>
            <p className="mb-6">
              Osebne podatke hranimo le toliko časa, kolikor je potrebno za namen, zaradi katerega so bili zbrani, oziroma toliko časa, kolikor to zahtevajo veljavni predpisi.
            </p>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">9.1 Uporabniški račun</h3>
                <p className="text-gray-700">
                  Podatke hranimo, dokler je račun aktiven in je to potrebno za zagotavljanje storitve. Po zaprtju računa podatke izbrišemo ali anonimiziramo, razen če je nadaljnja hramba potrebna zaradi zakonskih obveznosti, reševanja sporov ali uveljavljanja pravnih zahtevkov.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">9.2 Podatki o dogodkih, fotografije in videoposnetki</h3>
                <p className="text-gray-700 mb-3">
                  Obdobje dostopnosti galerije je odvisno od kupljenega paketa:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-700 mb-4">
                  <li><strong>Basic:</strong> galerija se samodejno izbriše po enem mesecu;</li>
                  <li><strong>Plus:</strong> galerija se samodejno izbriše po enem letu;</li>
                  <li><strong>Premium:</strong> galerija se samodejno izbriše po dveh letih.</li>
                </ul>
                <p className="text-gray-700 mb-3">
                  Obdobje se šteje od datuma dogodka. Točen datum poteka oziroma brisanja mora biti uporabniku jasno predstavljen ob nakupu.
                </p>
                <p className="text-gray-700">
                  Uporabnik lahko fotografije in druge vsebine izbriše tudi pred potekom paketa, če mu storitev to omogoča. Po izvedenem izbrisu se sproži postopek odstranitve vsebin iz aktivnih sistemov, ki jih upravljamo.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">9.3 Podatki o naročilih in računovodski podatki</h3>
                <p className="text-gray-700">
                  Podatke, ki jih moramo hraniti zaradi davčnih, računovodskih ali drugih zakonskih obveznosti, hranimo toliko časa, kot določajo veljavni predpisi.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
                <h3 className="text-lg font-bold text-gray-900 mb-2">9.4 Tehnični in varnostni dnevniki</h3>
                <p className="text-gray-700">
                  Te podatke hranimo toliko časa, kolikor je potrebno za zagotavljanje varnosti, odpravljanje napak in obravnavo morebitnih zlorab, glede na vrsto podatkov in namen njihovega zbiranja.
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              Kadar posamezen rok hrambe ni določen, uporabimo merila, kot so trajanje pogodbenega razmerja, namen obdelave, tehnična nujnost ter zakonski roki.
            </p>
          </section>

          {/* 10. Pravice posameznikov */}
          <section id="pravice-posameznikov">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">10</span>
              Pravice posameznikov
            </h2>
            <p className="mb-4">
              V skladu z GDPR imate, kadar so izpolnjeni zakonski pogoji, naslednje pravice:
            </p>
            <ul className="space-y-3 pl-2 mb-6 text-gray-700">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Pravica do dostopa:</strong> zahtevate lahko potrditev, ali obdelujemo vaše osebne podatke, ter dostop do njih in informacije o obdelavi.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Pravica do popravka:</strong> zahtevate lahko popravek netočnih ali dopolnitev nepopolnih podatkov.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Pravica do izbrisa:</strong> zahtevate lahko izbris podatkov, kadar so izpolnjeni zakonski pogoji.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Pravica do omejitve obdelave:</strong> zahtevate lahko omejitev obdelave v primerih, ki jih določa GDPR.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Pravica do prenosljivosti:</strong> v zakonsko določenih primerih lahko zahtevate prejem podatkov v strukturirani, splošno uporabljani in strojno berljivi obliki.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Pravica do ugovora:</strong> kadar obdelava temelji na zakonitem interesu, lahko ugovarjate obdelavi iz razlogov, povezanih z vašim položajem.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Pravica do preklica privolitve:</strong> kadar obdelava temelji na privolitvi, jo lahko kadar koli prekličete. Preklic ne vpliva na zakonitost obdelave pred preklicem.
                </div>
              </li>
            </ul>

            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 space-y-3 text-sm text-gray-700">
              <p>
                Za uveljavljanje pravic pišite na <a href="mailto:info@kliksy.si" className="text-[#0066FF] font-semibold hover:underline">info@kliksy.si</a>. Zaradi varstva podatkov lahko pred obravnavo zahteve preverimo vašo identiteto, kadar je to potrebno in sorazmerno.
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

          {/* 11. Pravica do pritožbe pri nadzornem organu */}
          <section id="pritozba-nadzorni-organ">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">11</span>
              Pravica do pritožbe pri nadzornem organu
            </h2>
            <p className="mb-4">
              Če menite, da se vaši osebni podatki obdelujejo v nasprotju z veljavnimi predpisi, imate pravico vložiti pritožbo pri pristojnem nadzornem organu:
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-xs">
              <p className="font-extrabold text-gray-900">Informacijski pooblaščenec Republike Slovenije</p>
              <p className="text-gray-700">Dunajska cesta 22, 1000 Ljubljana</p>
              <p className="text-sm mt-2">
                Spletna stran:{' '}
                <a 
                  href="https://www.ip-rs.si/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#0066FF] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  https://www.ip-rs.si/ <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Pravica do pritožbe ne posega v druge upravne ali sodne postopke, ki so vam na voljo.
            </p>
          </section>

          {/* 12. Ali morate posredovati osebne podatke? */}
          <section id="obveznost-posredovanja">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">12</span>
              Ali morate posredovati osebne podatke?
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Posredovanje določenih podatkov, zlasti e-poštnega naslova in podatkov, potrebnih za vzpostavitev računa, je potrebno za registracijo in uporabo funkcionalnosti, ki zahtevajo uporabniški račun.
              </p>
              <p>
                Podatki, potrebni za izvedbo nakupa, so potrebni za obdelavo naročila in omogočanje plačljivega paketa.
              </p>
              <p>
                Če teh podatkov ne posredujete, morda ne boste mogli ustvariti računa, zaključiti nakupa ali uporabljati ustrezne funkcionalnosti.
              </p>
              <p>
                Drugi podatki se posredujejo prostovoljno, razen kadar je ob posameznem obrazcu izrecno navedeno drugače.
              </p>
            </div>
          </section>

          {/* 13. Avtomatizirano sprejemanje odločitev */}
          <section id="avtomatizirano-odlocanje">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">13</span>
              Avtomatizirano sprejemanje odločitev
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Kliksy.si na podlagi osebnih podatkov ne izvaja avtomatiziranega sprejemanja odločitev ali profiliranja, ki bi imelo pravne učinke za posameznika ali bi nanj podobno pomembno vplivalo.
              </p>
              <p>
                Če bi takšno obdelavo v prihodnje uvedli, bomo posameznikom zagotovili informacije, ki jih zahteva GDPR, in izpolnili druge veljavne zakonske obveznosti.
              </p>
            </div>
          </section>

          {/* 14. Varnost osebnih podatkov */}
          <section id="varnost-podatkov">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">14</span>
              Varnost osebnih podatkov
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Izvajamo ustrezne tehnične in organizacijske ukrepe, namenjene zaščiti osebnih podatkov pred nepooblaščenim dostopom, izgubo, uničenjem, spremembo ali razkritjem.
              </p>
              <p>
                Ukrepi vključujejo varovanje dostopa do sistemov, upravljanje uporabniških pravic in uporabo varnostnih funkcij ponudnikov infrastrukture, kjer so na voljo in ustrezno konfigurirane.
              </p>
              <p>
                Kljub sprejetim ukrepom ni mogoče zagotoviti popolne varnosti vseh informacijskih sistemov. V primeru kršitve varnosti osebnih podatkov bomo ravnali v skladu z veljavnimi zakonskimi obveznostmi.
              </p>
            </div>
          </section>

          {/* 15. Spremembe politike zasebnosti */}
          <section id="spremembe-politike">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">15</span>
              Spremembe politike zasebnosti
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                To politiko lahko občasno posodobimo zaradi sprememb storitve, uporabljenih tehnologij, zakonodaje ali načina obdelave osebnih podatkov.
              </p>
              <p>
                Veljavna različica je vedno objavljena na spletni strani Kliksy.si, skupaj z datumom zadnje posodobitve.
              </p>
              <p>
                Če sprememba zahteva posebno obvestilo posameznikom, bomo to izvedli na ustrezen način.
              </p>
            </div>
          </section>

          {/* 16. Kontakt */}
          <section id="kontakt" className="border-t border-gray-100 pt-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold flex-shrink-0">16</span>
              Kontakt
            </h2>
            <p className="text-gray-700 mb-4">
              Za vsa vprašanja, zahteve ali uveljavljanje pravic v zvezi z obdelavo osebnih podatkov nas kontaktirajte:
            </p>
            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-6 space-y-2 mb-4">
              <p className="font-extrabold text-gray-900 text-lg">Jaka Meglič s.p. – Kliksy.si</p>
              <p className="text-gray-700 font-medium">Zelenica 4, 4290 Tržič, Slovenija</p>
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0066FF]" />
                  <span>E-pošta: <a href="mailto:info@kliksy.si" className="text-[#0066FF] font-semibold hover:underline">info@kliksy.si</a></span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0066FF]" />
                  <span>Telefon: <a href="tel:040230880" className="text-gray-900 font-semibold hover:underline">040 230 880</a></span>
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Več informacij o naših storitvah je na voljo na <a href="https://kliksy.si" className="text-[#0066FF] font-medium hover:underline">https://kliksy.si</a>.
            </p>
          </section>

        </div>

        {/* Spodnji gumb za vrnitev */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-colors shadow-sm text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Nazaj na prvo stran
          </Link>
        </div>

      </div>
    </div>
  );
}
