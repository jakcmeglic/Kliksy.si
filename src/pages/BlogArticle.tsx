import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function BlogArticle() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Photo booth najem cena 2026 — Koliko stane in kaj je boljša alternativa?",
    "description": "Koliko stane najem photo bootha za poroko v Sloveniji? Cene, primerjava in zakaj je Kliksy boljša alternativa.",
    "url": "https://kliksy.si/blog/photo-booth-najem-cena",
    "datePublished": "2026-07-26",
    "dateModified": "2026-07-26",
    "author": {"@type": "Organization", "name": "Kliksy", "url": "https://kliksy.si"},
    "publisher": {"@type": "Organization", "name": "Kliksy", "url": "https://kliksy.si"},
    "inLanguage": "sl"
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {"@type": "Question", "name": "Koliko stane najem photo bootha za poroko?", "acceptedAnswer": {"@type": "Answer", "text": "Najem photo bootha za poroko v Sloveniji stane med €300 in €800 za en večer."}},
      {"@type": "Question", "name": "Kaj je cenejša alternativa photo boothu?", "acceptedAnswer": {"@type": "Answer", "text": "Kliksy je digitalna galerija za poroke ki stane od €39. Gostje skenirajo QR kodo in dodajajo fotografije v skupno galerijo v realnem času."}},
      {"@type": "Question", "name": "Kakšna je razlika med foto boothom in Kliksy?", "acceptedAnswer": {"@type": "Answer", "text": "Photo booth zajame fotografije samo iz enega kota z vrstami čakanja. Kliksy zbere fotografije od vseh gostov iz vseh kotov celotne poroke."}},
      {"@type": "Question", "name": "Koliko stane foto booth za poroko 2026?", "acceptedAnswer": {"@type": "Answer", "text": "Foto booth cena 2026 za poroko se giblje med €300 in €800 za en večer, odvisno od vrste in dodatkov."}}
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-gray-900 overflow-x-hidden">
      <Helmet>
        <title>Photo booth najem cena 2026 — Koliko stane in kaj je boljša alternativa? | Kliksy</title>
        <meta name="description" content="Koliko stane najem photo bootha za poroko v Sloveniji? Cene od €300 do €800. Foto booth, photo booth cena 2026, foto booth cena — odkrijte zakaj je Kliksy 10x cenejša alternativa." />
        <meta name="keywords" content="photo booth najem cena, photo booth cena, foto booth, foto both, foto booth cena, photo booth cena 2026, foto booth cena 2026, photo booth poroka, najem photo bootha, photo booth alternativa, kliksy, digitalna galerija poroka, qr koda za poroko" />
        <link rel="canonical" href="https://kliksy.si/blog/photo-booth-najem-cena" />
        <meta property="og:title" content="Photo booth najem cena 2026 — Koliko stane in kaj je boljša alternativa?" />
        <meta property="og:description" content="Foto booth, photo booth cena 2026 — najem stane €300–€800. Kliksy je boljša alternativa za €39." />
        <meta property="og:url" content="https://kliksy.si/blog/photo-booth-najem-cena" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-[28px] tracking-tight text-gray-900 flex items-center gap-2">
            Kliksy<span className="text-[#5B45FF]">.</span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[15px] font-semibold text-gray-600">
             <Link to="/" className="hover:text-gray-900 transition-colors">Domov</Link>
             <Link to="/blog" className="text-gray-900 transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
             <a href="https://kliksy.si" className="hidden sm:inline-flex bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[13px] sm:text-[15px] font-bold hover:bg-gray-800 transition-all shadow-md whitespace-nowrap">
              Ustvari dogodek
            </a>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6">
        <article>
          {/* BREADCRUMB */}
          <div className="text-sm font-medium text-gray-500 mb-8">
            <Link to="/" className="hover:text-gray-900 transition">Domov</Link>
            <span className="mx-2">›</span>
            <Link to="/blog" className="hover:text-gray-900 transition">Blog</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Photo booth najem cena</span>
          </div>

          {/* ARTICLE HEADER */}
          <span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            Vodič za poroke
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Photo booth najem cena 2026 — Koliko stane in kaj je boljša alternativa?
          </h1>
          <div className="flex items-center text-gray-500 text-sm font-medium mb-10">
            <span>Julij 2026</span>
            <span className="mx-2">·</span>
            <span>5 minut branja</span>
            <span className="mx-2">·</span>
            <span>Kliksy ekipa</span>
          </div>

          {/* INTRO BOX */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 md:p-8 mb-12 text-gray-900 font-medium text-lg leading-relaxed shadow-sm">
            Najem photo bootha za poroko v Sloveniji stane med €300 in €800 za en večer. Ampak ali res dobite vrednost za denar? V tem članku razkrijemo dejanske cene photo bootha, kaj foto booth naredi dobro in kaj ne — ter predstavimo cenejšo alternativo ki zajame celotno poroko, ne samo en kotiček.
          </div>

          {/* CONTENT */}
          <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">
              Koliko stane najem photo bootha za poroko?
            </h2>
            <p className="mb-6">
              Cena najema photo bootha v Sloveniji je odvisna od več dejavnikov: vrste photo bootha, trajanja najema, vključenih rekvizitov in ali je vključen operater.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-bold text-gray-900 rounded-tl-xl">Vrsta photo bootha</th>
                    <th className="p-4 font-bold text-gray-900 rounded-tr-xl">Cena za večer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="p-4">Osnovni odprti Photo booth</td><td className="p-4 font-semibold text-gray-900">€300 – €400</td></tr>
                  <tr><td className="p-4 bg-gray-50/50">Zaprti photo booth</td><td className="p-4 font-semibold text-gray-900 bg-gray-50/50">€400 – €550</td></tr>
                  <tr><td className="p-4">Ogledalni photo booth</td><td className="p-4 font-semibold text-gray-900">€500 – €700</td></tr>
                  <tr><td className="p-4 bg-gray-50/50">360° video booth</td><td className="p-4 font-semibold text-gray-900 bg-gray-50/50">€600 – €800</td></tr>
                  <tr><td className="p-4">Photo booth s tiskanjem</td><td className="p-4 font-semibold text-gray-900">€450 – €700</td></tr>
                </tbody>
              </table>
            </div>

            <p className="mb-6">
              Za poroko z 80–150 gosti boste za photo booth odšteli med €400 in €600 — in to samo za fotografije iz enega samega kota vaše dvorane.
            </p>
            
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Dodatni stroški:</h3>
            <ul className="list-disc pl-6 mb-10 space-y-2">
              <li>Dostava in postavitev: €50–€100</li>
              <li>Tiskanje fotografij: včasih vključeno, včasih €1–2 na tisk</li>
              <li>Rekviziti in kostumi: €30–€80 dodatno</li>
              <li>Podaljšanje najema: €50–€100 na uro</li>
            </ul>

            {/* CTA 1 */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 text-center my-12">
              <a href="https://kliksy.si" className="inline-block bg-[#5B45FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-md w-full sm:w-auto">
                🎉 Ustvari brezplačen Kliksy dogodek
              </a>
              <p className="text-gray-500 text-sm mt-4 font-medium">Brez kreditne kartice · Preizkusi takoj</p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">
              Kaj dobite z najetim photo boothom?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <h3 className="font-bold text-green-800 text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">👍</span> Prednosti
                </h3>
                <ul className="space-y-3 text-green-900">
                  <li className="flex gap-2"><span>✓</span> Zabavna izkušnja za goste</li>
                  <li className="flex gap-2"><span>✓</span> Takojšnje tiskanje fotografij</li>
                  <li className="flex gap-2"><span>✓</span> Rekviziti ustvarijo smeh</li>
                  <li className="flex gap-2"><span>✓</span> Primeren za vse starosti</li>
                </ul>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <h3 className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">👎</span> Slabosti
                </h3>
                <ul className="space-y-3 text-red-900">
                  <li className="flex gap-2"><span>✗</span> Zajame samo 1 kotiček</li>
                  <li className="flex gap-2"><span>✗</span> Vrste 5–15 minut čakanja</li>
                  <li className="flex gap-2"><span>✗</span> Le 30–40% gostov ga obišče</li>
                  <li className="flex gap-2"><span>✗</span> Ne ujame spontanih trenutkov</li>
                  <li className="flex gap-2"><span>✗</span> Cena €300–€800 za en večer</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">
              Skrita resnica photo bootha — kar ne povedo
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 mb-8">
              <h3 className="font-bold text-gray-900 text-xl mb-3">📸 Scenarij: Plačali ste €500 za photo booth</h3>
              <p className="mb-0">
                Zjutraj po poroki odprete mapo s fotografijami. Dobite 150 fotografij — vsi pred isto ozadju, vsi z istimi rekviziti.
              </p>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Kaj manjka?</h3>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Solze mame med izmenjavo prstanov</li>
              <li>Smeh prijateljev ob polnoči</li>
              <li>Spontani ples v kotu dvorane</li>
              <li>Trenutek prvega pogleda</li>
              <li>Pogovori zunaj pod zvezdami</li>
            </ul>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-12">
              <p className="text-orange-900 font-medium m-0 flex items-start gap-3">
                <span className="text-2xl leading-none">⚠️</span> 
                <span>Na poroki z 80 gosti bo photo booth obiskalo le 30–40% gostov. Preostali 60–70% bo fotografiralo s svojimi telefoni — te fotografije pa boste redko kdaj videli.</span>
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">
              Kliksy — boljša alternativa photo boothu za €39
            </h2>
            <p className="mb-4">
              Kliksy je slovenska digitalna rešitev ki reši točno te probleme photo bootha — in stane od €39 namesto €400–€800.
            </p>
            <p className="mb-10">
              Deluje preprosto: na vsako mizo postavite majhno kartico s QR kodo. Gostje jo skenirajo s telefonom — brez aplikacije, brez registracije — in dodajo fotografije v skupno galerijo v realnem času.
            </p>

            {/* CTA 2 */}
            <div className="mb-12">
              <a href="https://kliksy.si" className="inline-block bg-[#5B45FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-md">
                📸 Preizkusi Kliksy brezplačno — brez kartice
              </a>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">
              Photo booth vs Kliksy — podrobna primerjava
            </h2>
            <div className="overflow-x-auto mb-12">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-bold text-gray-900 rounded-tl-xl w-1/3">Lastnost</th>
                    <th className="p-4 font-bold text-gray-900 w-1/3">Photo booth</th>
                    <th className="p-4 font-bold text-[#5B45FF] rounded-tr-xl w-1/3">Kliksy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Cena</td>
                    <td className="p-4 text-red-600 font-bold">€300–€800</td>
                    <td className="p-4 text-[#5B45FF] font-extrabold">od €39</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900 bg-gray-50/50">Pokritost dogodka</td>
                    <td className="p-4 bg-gray-50/50">1 kotiček dvorane</td>
                    <td className="p-4 font-bold bg-gray-50/50">Celotna poroka</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Čakanje v vrsti</td>
                    <td className="p-4">5–15 minut</td>
                    <td className="p-4 font-bold text-green-600">✓ Ni vrst</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900 bg-gray-50/50">Število fotografij</td>
                    <td className="p-4 bg-gray-50/50">50–200</td>
                    <td className="p-4 font-bold bg-gray-50/50">200–500+</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Spontani trenutki</td>
                    <td className="p-4 text-red-500">✗ Ne</td>
                    <td className="p-4 font-bold text-green-600">✓ Da</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900 bg-gray-50/50">Različni koti</td>
                    <td className="p-4 text-red-500 bg-gray-50/50">✗ En kot</td>
                    <td className="p-4 font-bold text-green-600 bg-gray-50/50">✓ Vsi koti</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Delež gostov ki sodeluje</td>
                    <td className="p-4">30–40%</td>
                    <td className="p-4 font-bold">80–100%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900 bg-gray-50/50">Brez aplikacije</td>
                    <td className="p-4 text-red-500 bg-gray-50/50">✗</td>
                    <td className="p-4 font-bold text-green-600 bg-gray-50/50">✓ Samo QR koda</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Realni čas</td>
                    <td className="p-4 text-red-500">✗</td>
                    <td className="p-4 font-bold text-green-600">✓ Med poroko</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900 bg-gray-50/50">Prenos fotografij</td>
                    <td className="p-4 bg-gray-50/50">Tiskano</td>
                    <td className="p-4 font-bold text-green-600 bg-gray-50/50">✓ ZIP v 1 kliku</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-gray-900">Setup</td>
                    <td className="p-4">Dostava + postavitev</td>
                    <td className="p-4 font-bold">1 minuta</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">Zakaj ni vrst pri Kliksy</h2>
            <p className="mb-4">
              Pri photo boothu nastane vrsta ker je en aparat in veliko gostov. Na poroki z 80 gosti to pomeni 5–15 minut čakanja.
            </p>
            <p className="mb-10">
              Pri Kliksy vsak gost fotografira s svojim telefonom — 150 gostov = 150 photo boothov ki delujejo hkrati, povsod, ves čas.
            </p>

            {/* CTA 3 */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 text-center my-12">
              <a href="https://kliksy.si" className="inline-block bg-[#5B45FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-md w-full sm:w-auto">
                🚀 Začni z Kliksy brezplačno
              </a>
              <p className="text-gray-500 text-sm mt-4 font-medium">Setup traja 1 minuto · Ni potrebna kreditna kartica</p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">Fotografije iz vseh kotov vaše poroke</h2>
            <p className="mb-4">
              Photo booth je pritrjen na eno mesto. Vaša poroka se odvija povsod.
            </p>
            <ul className="list-disc pl-6 mb-12 space-y-2 font-medium">
              <li>Priprave neveste</li>
              <li>Ceremonija</li>
              <li>Kosilo in večerja</li>
              <li>Plesišče</li>
              <li>Zunaj pod zvezdami</li>
              <li>Zakulisje</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-6">Kliksy kot popoln dodatek k poročnemu fotografu</h2>
            <p className="mb-6 font-medium text-lg">
              Kliksy ni zamenjava za poročnega fotografa — je popoln dodatek.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-3">📸 Fotograf ujame:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Ceremonijo</li>
                  <li>• Portrete para</li>
                  <li>• Ključne trenutke</li>
                  <li>• Profesionalne kadre</li>
                </ul>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="font-bold text-indigo-900 text-lg mb-3">📱 Kliksy ujame:</h3>
                <ul className="space-y-2 text-indigo-900">
                  <li>• Spontane trenutke</li>
                  <li>• Perspektivo vsakega gosta</li>
                  <li>• Ozadje in vzdušje</li>
                  <li>• Smeh in ples</li>
                </ul>
              </div>
            </div>

            {/* SAVINGS BOX */}
            <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-10 mb-12 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">💰 Koliko prihranite z Kliksy namesto photo bootha?</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8 text-xl font-bold">
                <div className="text-center">
                  <span className="block text-gray-400 text-sm mb-2 uppercase tracking-wider">Photo booth</span>
                  <span className="text-red-400 line-through decoration-2">€500</span>
                </div>
                <div className="hidden md:block text-gray-600 font-normal">VS</div>
                <div className="text-center">
                  <span className="block text-gray-400 text-sm mb-2 uppercase tracking-wider">Kliksy Pro</span>
                  <span className="text-green-400 text-3xl">€49</span>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-6 text-center border border-white/20">
                <p className="text-xl md:text-2xl font-extrabold text-white m-0 leading-tight">
                  💸 Prihranite €451 — in dobite več fotografij, iz več kotov, brez vrst
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-16 mb-8">
              Pogosta vprašanja o photo boothu in Kliksy
            </h2>
            <div className="space-y-6 mb-16">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Q: Ali se Kliksy in photo booth izključujeta?</h3>
                <p className="text-gray-700 m-0">A: Ne — mnogi pari imajo oba. Photo booth je zabavna aktivnost, Kliksy pa zbere vse spontane fotografije zunaj photo bootha.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Q: Ali morajo gostje imeti aplikacijo za Kliksy?</h3>
                <p className="text-gray-700 m-0">A: Ne. Gostje samo skenirajo QR kodo — brez aplikacije, brez registracije. Deluje na vsakem telefonu.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Q: Koliko fotografij dobim z Kliksy?</h3>
                <p className="text-gray-700 m-0">A: Povprečna poroka z 80–100 gosti ustvari 200–400 fotografij. Nekateri pari poročajo o 500+ fotografijah.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Q: Ali Kliksy nadomesti poročnega fotografa?</h3>
                <p className="text-gray-700 m-0">A: Ne. Kliksy je popoln dodatek k poročnemu fotografu. Fotograf ujame profesionalne kadre — Kliksy zbere spontane trenutke od vseh gostov.</p>
              </div>
              <div className="border-b border-gray-200 pb-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Q: Koliko stane foto booth cena 2026?</h3>
                <p className="text-gray-700 m-0">A: Foto booth cena 2026 se giblje med €300 in €800 za en večer. Kliksy je dostopen alternativa od €39.</p>
              </div>
            </div>

          </div>
        </article>

        {/* FINAL CTA SECTION */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 md:p-12 text-center my-16 shadow-sm">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Preizkusite Kliksy brezplačno
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
            Ustvarite brezplačen demo dogodek in preizkusite kako deluje — brez kreditne kartice, brez obveznosti.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://kliksy.si" className="w-full sm:w-auto bg-[#5B45FF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-md">
              🎉 Ustvari brezplačen Kliksy dogodek
            </a>
            <a href="https://kliksy.si#paketi" className="w-full sm:w-auto bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-sm">
              Oglej si pakete in cene &rarr;
            </a>
          </div>
        </div>

        {/* BACK TO BLOG LINK */}
        <div className="text-center pb-8 border-t border-gray-100 pt-8">
          <Link to="/blog" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors">
            &larr; Nazaj na blog
          </Link>
        </div>

      </main>
    </div>
  );
}
