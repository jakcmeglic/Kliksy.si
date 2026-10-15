import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2, AlertCircle, Mail } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-gray-900 pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-12 md:pt-16">
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors font-semibold text-sm group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Nazaj na prvo stran
        </Link>

        {/* Glavni naslov in datum zadnje posodobitve */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            Pravno obvestilo
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.15] mb-4">
            Politika zasebnosti in obvestilo o obdelavi osebnih podatkov
          </h1>
          <p className="text-sm font-medium text-gray-500 border-b border-gray-100 pb-6">
            Datum zadnje posodobitve: <span className="font-semibold text-gray-700">15. oktober 2026</span>
          </p>
        </div>

        {/* Uvodno obvestilo */}
        <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-100 rounded-2xl p-6 md:p-8 mb-12">
          <p className="text-gray-700 leading-relaxed text-[16px] md:text-[17px]">
            Pri podjetju <strong className="text-gray-900 font-bold">Kliksy.si</strong> (v nadaljevanju: »upravljavec«, »ponudnik« ali »mi«) izjemno cenimo vaše zaupanje in se zavedamo odgovornosti, ki jo prinaša obdelava osebnih podatkov. To obvestilo vas podrobno in pregledno seznanja s tem, katere osebne podatke zbiramo, na kakšni pravni podlagi, v katere namene jih obdelujemo, koliko časa jih hranimo ter kakšne pravice imate kot posameznik v skladu s <strong className="text-gray-900 font-semibold">Splošno uredbo o varstvu podatkov (GDPR – Uredba (EU) 2016/679)</strong>, <strong className="text-gray-900 font-semibold">Zakonom o varstvu osebnih podatkov (ZVOP-2)</strong> in <strong className="text-gray-900 font-semibold">Zakonom o elektronskih komunikacijah (ZEKom-2)</strong>.
          </p>
        </div>

        {/* Vsebina po poglavjih */}
        <div className="space-y-12 text-gray-700 leading-relaxed text-[15px] md:text-[16px]">

          {/* 1. Upravljavec osebnih podatkov */}
          <section className="scroll-mt-10" id="upravljavec">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">1</span>
              Upravljavec osebnih podatkov
            </h2>
            <p className="mb-4">
              Upravljavec osebnih podatkov, zbranih prek spletnega mesta in storitve <strong>Kliksy.si</strong>, je ponudnik platforme Kliksy.si.
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-4">
              <p className="font-semibold text-gray-900 mb-1">Kontaktni podatki za varstvo podatkov:</p>
              <p className="text-gray-600">Spletno mesto: <a href="https://kliksy.si" className="text-[#0066FF] hover:underline font-medium">kliksy.si</a></p>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                E-poštni naslov za vprašanja in uveljavljanje pravic: <a href="mailto:info@kliksy.si" className="text-[#0066FF] font-medium hover:underline">info@kliksy.si</a>
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Zaradi narave in obsega obdelave osebnih podatkov upravljavec nima imenovane posebne pooblaščene osebe za varstvo podatkov (DPO), saj obdelava ne zajema obsežnih občutljivih podatkov ali rednega sistematičnega nadzora posameznikov. Za vsa vprašanja se lahko neposredno obrnete na zgornji kontaktni naslov.
            </p>
          </section>

          {/* 2. Temeljni pojmi */}
          <section className="scroll-mt-10" id="pojmi">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">2</span>
              Temeljni pojmi
            </h2>
            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Osebni podatek:</strong> Katerakoli informacija v zvezi z določenim ali določljivim posameznikom (npr. ime, priimek, elektronski naslov, fotografija obraza, podatki o naročilu).
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Posameznik:</strong> Uporabnik spletne strani, registrirani naročnik storitve (organizator dogodka) ali udeleženec dogodka (gost), ki naloži ali pregleduje vsebine.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">Obdelava osebnih podatkov:</strong> Vsako dejanje ali niz dejanj, ki se izvajajo v zvezi z osebnimi podatki (zbiranje, hramba, vpogled, posredovanje, brisanje itd.).
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF] mt-2.5 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900 font-semibold">GDPR:</strong> Splošna uredba o varstvu podatkov (Uredba (EU) 2016/679 Evropskega parlamenta in Sveta z dne 27. aprila 2016).
                </div>
              </li>
            </ul>
          </section>

          {/* 3. Kategorije osebnih podatkov, ki jih obdelujemo */}
          <section className="scroll-mt-10" id="podatki">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">3</span>
              Kategorije osebnih podatkov, ki jih obdelujemo
            </h2>
            <p className="mb-6">
              Zbiramo izključno tiste podatke, ki so nujno potrebni za nemoteno delovanje platforme, izvedbo naročenih paketov, izpolnjevanje zakonskih obveznosti ter zagotavljanje vrhunske uporabniške izkušnje:
            </p>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.1 Podatki naročnika / organizatorja dogodka</h3>
                <p className="text-gray-600 mb-3">Ob ustvarjanju računa in naročilu paketa virtualne galerije obdelujemo:</p>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                  <li>Ime in priimek organizatorja,</li>
                  <li>Elektronski naslov (za aktivacijo računa, pošiljanje povezav in obvestil),</li>
                  <li>Telefonsko številko (v kolikor je posredovana za namen obveščanja ali podpore),</li>
                  <li>Podatke za izdajo računa (naziv podjetja, naslov, davčna številka, če naročilo izvede pravna oseba),</li>
                  <li>Prijavne poverilnice (šifrirano geslo ali avtentikacijski žeton ponudnika Google prijava).</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.2 Podatki o dogodku</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                  <li>Naziv dogodka (npr. »Poroka Ane in Luke«, »Rojstni dan 30«),</li>
                  <li>Datum poteka dogodka in trajanje zakupljenega paketa,</li>
                  <li>Generirana unikatna QR koda ter povezava do galerije,</li>
                  <li>Nastavitve galerije (npr. dovoljenja za neposredno nalaganje, moderiranje ali prenos).</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.3 Fotografije in vsebine, ki jih naložijo gosti/udeleženci</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                  <li>Digitalne fotografije in morebitni videoposnetki, ki jih gosti naložijo prek spletnega vmesnika,</li>
                  <li>Morebitna spremna besedila, posvetila ali imena, če jih naložnik samostojno vnese,</li>
                  <li>Časovni žig nalaganja in osnovni tehnični metapodatki datotek (dimenzije, format, velikost datoteke).</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.4 Tehnični in sejni podatki</h3>
                <ul className="list-disc pl-6 space-y-1.5 text-gray-600 text-sm">
                  <li>IP naslov naprave, s katere se dostopa do spletnega mesta,</li>
                  <li>Vrsta in različica spletnega brskalnika, operacijski sistem naprave,</li>
                  <li>Nujni tehnični piškotki za ohranjanje seje in varno prijavo.</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2">3.5 Plačilni podatki</h3>
                <p className="text-gray-600 text-sm">
                  Plačila se izvajajo prek varnega certificiranega ponudnika plačilnih storitev <strong>Stripe (Stripe Payments Europe, Ltd.)</strong>. Ponudnik Kliksy.si ne hrani, ne zbira in nima dostopa do celotnih številk vaših plačilnih kartic ali varnostnih kod (CVC/CVV). Od ponudnika plačil prejmemo zgolj potrditev o uspešnosti transakcije ter identifikator plačila za namen izdaje računa.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Nameni obdelave in pravne podlage */}
          <section className="scroll-mt-10" id="nameni-in-podlage">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">4</span>
              Nameni obdelave in pravne podlage
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden mb-6">
                <thead>
                  <tr className="bg-gray-100 text-gray-900 font-bold border-b border-gray-200">
                    <th className="p-3.5">Namen obdelave</th>
                    <th className="p-3.5">Pravna podlaga (GDPR)</th>
                    <th className="p-3.5">Kategorije podatkov</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-600">
                  <tr>
                    <td className="p-3.5 font-medium text-gray-900">Registracija, vzpostavitev virtualne galerije, omogočanje dostopa prek QR kode in prenos datotek</td>
                    <td className="p-3.5">Izvajanje pogodbe ali predpogodbenih ukrepov (člen 6(1)(b) GDPR)</td>
                    <td className="p-3.5">Ime, e-naslov, podatki o dogodku, naložene fotografije</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-gray-900">Izdaja računov, vodenje poslovnih knjig ter davčne evidence</td>
                    <td className="p-3.5">Izpolnjevanje zakonske obveznosti (člen 6(1)(c) GDPR v povezavi z ZDavPR in ZDDV-1)</td>
                    <td className="p-3.5">Ime in priimek/podjetje, naslov, davčna številka, znesek, potrdilo o plačilu</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-gray-900">Zagotavljanje varnosti sistema, preprečevanje zlorab in zaščita integritete podatkov</td>
                    <td className="p-3.5">Zakoniti interes upravljavca (člen 6(1)(f) GDPR)</td>
                    <td className="p-3.5">IP naslov, dnevniški zapisi strežnika, tehnični podatki</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-medium text-gray-900">Komuniciranje s strankami, reševanje tehničnih težav in podpora uporabnikom</td>
                    <td className="p-3.5">Izvajanje pogodbe oz. zakoniti interes (člen 6(1)(b) in (f) GDPR)</td>
                    <td className="p-3.5">E-naslov, vsebina sporočila ali povpraševanja</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Posebna določila glede virtualnih galerij in fotografij */}
          <section className="scroll-mt-10" id="posebnosti-galerije">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">5</span>
              Posebnosti glede fotografij v virtualnih galerijah
            </h2>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">Vloga Kliksy.si in odgovornost organizatorja dogodka</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Kliksy.si zagotavlja varno programsko orodje in strežniško infrastrukturo za ustvarjanje digitalnih galerij ter zbiranje spominov z dogodkov. Kliksy.si deluje kot tehnični posrednik in shramba podatkov.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    <strong>Odgovornost organizatorja:</strong> Organizator dogodka (naročnik) je tisti, ki vabi goste in omogoča dostop do galerije. Organizator je dolžan poskrbeti, da so gostje in udeleženci ustrezno obveščeni o fotografiranju na dogodku ter o možnosti deljenja fotografij prek QR kode.
                  </p>
                </div>
              </div>
            </div>
            <p className="mb-4">
              <strong>Pravica posameznika do odstranitve fotografije:</strong> Če posameznik (gost ali udeleženec dogodka) ugotovi, da je bila v galerijo naložena fotografija, na kateri je prepoznan in ne želi njenega nadaljnjega prikaza, lahko:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-600">
              <li>Neposredno kontaktira organizatorja dogodka, ki ima v svoji nadzorni plošči možnost takojšnjega izbrisa katerekoli fotografije; ali</li>
              <li>Pošlje zahtevek na naš kontaktni naslov <a href="mailto:info@kliksy.si" className="text-[#0066FF] font-semibold hover:underline">info@kliksy.si</a> z navedbo dogodka in povezavo do sporne fotografije. Upravljavec bo fotografijo nemudoma varno odstranil.</li>
            </ul>
          </section>

          {/* 6. Pogodbeni obdelovalci in posredovanje podatkov */}
          <section className="scroll-mt-10" id="obdelovalci">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">6</span>
              Pogodbeni obdelovalci in posredovanje tretjim osebam
            </h2>
            <p className="mb-4">
              Vaših osebnih podatkov nikoli ne prodajamo, ne oddajamo v najem in jih ne posredujemo nepooblaščenim tretjim osebam. Za tehnično delovanje storitve sodelujemo izključno s preverjenimi pogodbenimi obdelovalci, ki zagotavljajo najvišje standarde informacijske varnosti in skladnost z GDPR:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border border-gray-200 rounded-xl p-4 bg-white">
                <h3 className="font-bold text-gray-900 mb-1">Google Cloud & Firebase</h3>
                <p className="text-xs text-gray-500 mb-2">Google Ireland Ltd., Dublin, Irska</p>
                <p className="text-sm text-gray-600">Varna hramba podatkov, podatkovna baza ter avtentikacija uporabnikov v podatkovnih centrih znotraj Evropske unije.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4 bg-white">
                <h3 className="font-bold text-gray-900 mb-1">Stripe Payments</h3>
                <p className="text-xs text-gray-500 mb-2">Stripe Payments Europe Ltd., Dublin, Irska</p>
                <p className="text-sm text-gray-600">Procesiranje varnih spletnih plačil z najvišjim certifikatom PCI DSS Level 1.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4 bg-white">
                <h3 className="font-bold text-gray-900 mb-1">E-poštne storitve (Resend & SMTP)</h3>
                <p className="text-xs text-gray-500 mb-2">Pooblaščeni ponudniki transakcijske pošte</p>
                <p className="text-sm text-gray-600">Pošiljanje potrditvenih elektronskih sporočil, aktivacijskih povezav ter obvestil o dogodkih.</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4 bg-white">
                <h3 className="font-bold text-gray-900 mb-1">Računovodstvo in davčni organi</h3>
                <p className="text-xs text-gray-500 mb-2">Slovenski pooblaščeni organi in servisi</p>
                <p className="text-sm text-gray-600">Izpolnjevanje zakonsko predpisanih davčnih obveznosti (FURS) in overitev računov.</p>
              </div>
            </div>
          </section>

          {/* 7. Obdobje hrambe podatkov */}
          <section className="scroll-mt-10" id="hramba">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">7</span>
              Obdobje hrambe osebnih podatkov
            </h2>
            <p className="mb-4">
              Osebne podatke hranimo le toliko časa, kolikor je potrebno za uresničitev namena, zaradi katerega so bili zbrani:
            </p>
            <ul className="space-y-3 pl-2 mb-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Podatki o dogodku in shranjene fotografije:</strong> Hranijo se v skladu z izbranim paketom ob naročilu (npr. 12 mesecev ali 24 mesecev od dneva dogodka). Po preteku obdobja veljavnosti paketa se fotografije in vsebine galerije avtomatsko in trajno izbrišejo ali nepovratno anonimizirajo.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Podatki uporabniškega računa:</strong> Hranijo se do zahteve uporabnika po izbrisu računa oz. do prenehanja veljavnosti storitve.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Izdani računi in računovodski dokumenti:</strong> Hranijo se 10 let po poteku leta, na katero se nanašajo, kot to izrecno zapoveduje slovenska davčna zakonodaja.
                </div>
              </li>
            </ul>
          </section>

          {/* 8. Varnost podatkov */}
          <section className="scroll-mt-10" id="varnost">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">8</span>
              Varnost osebnih podatkov
            </h2>
            <p className="mb-4">
              Izvajamo ustrezne tehnične in organizacijske varnostne ukrepe za zaščito podatkov pred nepooblaščenim dostopom, spreminjanjem, razkritjem ali uničenjem:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0066FF]" />
                <span>Celotna komunikacija prek spletnega mesta poteka prek varnega, šifriranega protokola HTTPS (SSL/TLS certifikat).</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0066FF]" />
                <span>Uporabniška gesla so zgoščena (hashed) z naprednimi kriptografskimi algoritmi.</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0066FF]" />
                <span>Dostop do administrativnih orodij je strogo omejen z večnivojsko avtentikacijo.</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0066FF]" />
                <span>Redno izvajamo varnostne preglede in posodobitve vseh uporabljenih komponent.</span>
              </div>
            </div>
          </section>

          {/* 9. Pravice posameznikov po GDPR */}
          <section className="scroll-mt-10" id="pravice">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">9</span>
              Pravice posameznikov
            </h2>
            <p className="mb-4">
              V skladu s Splošno uredbo o varstvu podatkov (GDPR) imate glede svojih osebnih podatkov naslednje pravice:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1 text-base">Pravica do dostopa (15. člen)</h3>
                <p className="text-xs text-gray-600">Pravico imate pridobiti potrditev, ali se obdelujejo vaši osebni podatki, in zahtevati kopijo teh podatkov.</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1 text-base">Pravica do popravka (16. člen)</h3>
                <p className="text-xs text-gray-600">Pravico imate doseči, da brez nepotrebnega odlašanja popravimo netočne osebne podatke o vas.</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1 text-base">Pravica do izbrisa (17. člen)</h3>
                <p className="text-xs text-gray-600">Pravica do »pozabe« – doseči izbris svojih osebnih podatkov, v kolikor ne obstaja zakonska dolžnost hrambe.</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1 text-base">Pravica do omejitve (18. člen)</h3>
                <p className="text-xs text-gray-600">Pravico imate zahtevati omejitev obdelave v primerih, določenih z GDPR (npr. ob presoji točnosti podatkov).</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1 text-base">Pravica do prenosljivosti (20. člen)</h3>
                <p className="text-xs text-gray-600">Pravico imate prejeti svoje podatke v strukturirani, splošno uporabljani in strojno berljivi obliki.</p>
              </div>
              <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                <h3 className="font-bold text-gray-900 mb-1 text-base">Pravica do ugovora (21. člen)</h3>
                <p className="text-xs text-gray-600">Pravico imate kadarkoli ugovarjati obdelavi osebnih podatkov, ki temelji na zakonitem interesu.</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <h3 className="font-bold text-gray-900 text-sm mb-2">Uveljavljanje pravic in pritožba pri nadzornem organu:</h3>
              <p className="text-gray-600 text-sm mb-3">
                Vse zahteve za uveljavljanje pravic pošljite na: <a href="mailto:info@kliksy.si" className="text-[#0066FF] font-semibold hover:underline">info@kliksy.si</a>. Na vašo zahtevo bomo odgovorili v roku 30 dni brez nepotrebnega odlašanja.
              </p>
              <p className="text-gray-600 text-sm">
                Če menite, da obdelava vaših osebnih podatkov krši predpise o varstvu podatkov, imate pravico vložiti pritožbo pri pristojnem nadzornem organu:<br />
                <strong className="text-gray-900">Informacijski pooblaščenec Republike Slovenije</strong><br />
                Dunajska cesta 22, 1000 Ljubljana, Slovenija<br />
                E-naslov: <a href="mailto:gp.ip@ip-rs.si" className="text-[#0066FF] hover:underline">gp.ip@ip-rs.si</a> | Splet: <a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline">www.ip-rs.si</a>
              </p>
            </div>
          </section>

          {/* 10. Piškotki */}
          <section className="scroll-mt-10" id="piskotki">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">10</span>
              Piškotki in spletne tehnologije
            </h2>
            <p className="mb-3">
              Spletno mesto Kliksy.si uporablja nujne tehnične piškotke za osnovno delovanje (npr. ohranjanje seje prijavljenega uporabnika, varnost obrazcev in izbor jezika).
            </p>
            <p className="text-gray-600 text-sm mb-3">
              Za podrobne informacije o vrstah piškotkov, namenu njihove uporabe ter možnostih upravljanja vas vabimo, da si preberete našo posebno stran <Link to="/piskotki" className="text-[#0066FF] font-semibold hover:underline">Politika piškotkov</Link>.
            </p>
          </section>

          {/* 11. Spremembe politike zasebnosti */}
          <section className="scroll-mt-10" id="spremembe">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">11</span>
              Spremembe te politike zasebnosti
            </h2>
            <p className="text-gray-600">
              Pridržujemo si pravico do občasnih sprememb ali dopolnitev te politike zasebnosti zaradi uskladitve z zakonodajo ali nadgradnje funkcionalnosti naših storitev. Vsaka posodobitev bo z navedbo datuma zadnje spremembe objavljena na tej strani. Priporočamo vam, da občasno preverite to vsebino.
            </p>
          </section>

          {/* 12. Kontakt */}
          <section className="scroll-mt-10 border-t border-gray-100 pt-8" id="kontakt">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center text-sm font-bold">12</span>
              Kontakt
            </h2>
            <p className="text-gray-600 mb-4">
              Če imate kakršnakoli vprašanja, pripombe ali želite uveljavljati svoje pravice glede obdelave osebnih podatkov, nam lahko kadarkoli pišete na:
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <Mail className="w-5 h-5 text-[#0066FF]" />
              <span className="font-bold text-gray-900">info@kliksy.si</span>
            </div>
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
