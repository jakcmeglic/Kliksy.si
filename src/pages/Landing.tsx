import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Camera, QrCode, Download, Heart, ArrowRight, Check, Star, Smartphone, Images, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-[var(--color-wedding-gold-light)] selection:text-black font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl tracking-tight text-gray-900 flex items-center gap-2">
            Kliksy<span className="text-[var(--color-wedding-gold)]">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#kako-deluje" className="hover:text-gray-900 transition-colors">Kako deluje</a>
            <a href="#prednosti" className="hover:text-gray-900 transition-colors">Prednosti</a>
            <a href="#paketi" className="hover:text-gray-900 transition-colors">Paketi</a>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Prijava
            </Link>
            <Link to="/create" className="bg-gray-900 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-medium hover:bg-black transition-all hover:shadow-lg hover:shadow-gray-900/20 active:scale-95 whitespace-nowrap">
              Ustvari
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-[var(--color-wedding-gold)]" />
              <span className="text-gray-700">Najboljša izbira za poroke 2026</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] mb-6 text-gray-900 tracking-tight">
              Ujemite vsak trenutek vaše poroke.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              Brez aplikacij. Brez registracije. Gostje le skenirajo QR kodo in delijo fotografije neposredno v vašo zasebno spletno galerijo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/create" className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-black transition-all hover:shadow-xl hover:shadow-gray-900/20 active:scale-95">
                Začni brezplačno <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/event/demo" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all shadow-sm">
                Poglej demo
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} src={`https://picsum.photos/seed/face${i}/100/100`} alt="User" className="w-10 h-10 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[var(--color-wedding-gold)] mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p>Zaupa nam 500+ parov</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Visuals - Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, lg: { x: 40 }, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:flex justify-center items-center h-[600px]"
          >
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[var(--color-wedding-sand)]/40 to-[var(--color-wedding-gold-light)]/20 rounded-full blur-3xl -z-10" />
            
            {/* Main Phone */}
            <div className="relative z-20 w-[280px] h-[580px] bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl w-40 mx-auto z-30" />
              
              {/* App UI inside phone */}
              <div className="w-full h-full bg-[var(--color-wedding-beige)] flex flex-col">
                <div className="pt-12 pb-6 px-6 bg-white text-center rounded-b-3xl shadow-sm">
                  <Heart className="w-6 h-6 text-[var(--color-wedding-gold)] fill-[var(--color-wedding-gold)] mx-auto mb-2" />
                  <h3 className="font-serif text-xl text-gray-900">Ana & Luka</h3>
                  <p className="text-xs text-gray-500">Hvala, ker deliš spomine z nama.</p>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center gap-4">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg">
                    <Camera className="w-6 h-6" />
                    <span className="font-medium text-sm">Slikaj zdaj</span>
                  </div>
                  <div className="bg-white text-gray-900 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-sm border border-gray-100">
                    <Images className="w-6 h-6" />
                    <span className="font-medium text-sm">Naloži iz galerije</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-20 -left-12 z-30 bg-white p-2 rounded-xl shadow-xl border border-gray-100 transform -rotate-12"
            >
              <img src="https://picsum.photos/seed/wed1/200/200" alt="Wedding" className="w-32 h-32 rounded-lg object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-32 -right-8 z-30 bg-white p-2 rounded-xl shadow-xl border border-gray-100 transform rotate-6"
            >
              <img src="https://picsum.photos/seed/wed2/200/200" alt="Wedding" className="w-40 h-40 rounded-lg object-cover" referrerPolicy="no-referrer" />
            </motion.div>

            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/2 -right-16 z-10 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Slika naložena!</p>
                <p className="text-xs text-gray-500">pred 2 sek</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logos / Trust */}
      <section className="py-10 border-y border-gray-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60 grayscale">
          <p className="font-serif text-xl font-bold">VOGUE</p>
          <p className="font-serif text-xl font-bold">BRIDES</p>
          <p className="font-serif text-xl font-bold">The Knot</p>
          <p className="font-serif text-xl font-bold">WeddingWire</p>
          <p className="font-serif text-xl font-bold">Style Me Pretty</p>
        </div>
      </section>

      {/* How it works (Alternating Features) */}
      <section id="kako-deluje" className="py-24 md:py-32 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">Kako deluje?</h2>
            <p className="text-lg text-gray-600">Zbiranje spominov še nikoli ni bilo tako preprosto. Brez prenosov aplikacij in brez zapletenih navodil.</p>
          </div>

          <div className="space-y-24 md:space-y-32">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                <div className="w-14 h-14 bg-[var(--color-wedding-sand)]/30 rounded-2xl flex items-center justify-center mb-6">
                  <QrCode className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-3xl font-serif mb-4 text-gray-900">1. Natisnite QR kodo</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Ob ustvarjanju dogodka prejmete unikatno QR kodo. Natisnite jo in jo postavite na mize, ob vhod ali na šank. Pripravili smo tudi čudovite predloge za tisk.
                </p>
                <ul className="space-y-3">
                  {['Takojšen dostop do kode', 'PDF predloge za tisk', 'Možnost naročila lesenega stojala'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <Check className="w-5 h-5 text-[var(--color-wedding-gold)]" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="order-1 md:order-2 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 aspect-square flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
                <div className="relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center">
                  <QrCode className="w-32 h-32 text-gray-900 mb-4" />
                  <p className="font-serif text-lg">Skeniraj me</p>
                </div>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 aspect-square flex items-center justify-center relative overflow-hidden"
              >
                <img src="https://picsum.photos/seed/wedguest/800/800" alt="Guest taking photo" className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Slikaj zdaj</p>
                    <p className="text-sm text-gray-600">Brez aplikacije</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-14 h-14 bg-[var(--color-wedding-sand)]/30 rounded-2xl flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-3xl font-serif mb-4 text-gray-900">2. Gostje slikajo in delijo</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Gostje s svojim telefonom skenirajo QR kodo. Odpre se jim preprosta spletna stran, kjer lahko takoj slikajo ali izberejo slike iz svoje galerije.
                </p>
                <ul className="space-y-3">
                  {['Deluje na vseh telefonih (iOS & Android)', 'Brez registracije ali prijave', 'Izjemno hitro nalaganje'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <Check className="w-5 h-5 text-[var(--color-wedding-gold)]" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                <div className="w-14 h-14 bg-[var(--color-wedding-sand)]/30 rounded-2xl flex items-center justify-center mb-6">
                  <Images className="w-7 h-7 text-gray-900" />
                </div>
                <h3 className="text-3xl font-serif mb-4 text-gray-900">3. Vse slike v eni galeriji</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Pozabite na iskanje slik po WhatsAppu, Instagramu in e-mailih. Vse fotografije vaših gostov se v živo zbirajo v vaši zasebni galeriji.
                </p>
                <ul className="space-y-3">
                  {['Galerija v živo (Live Slideshow)', 'Prenos vseh slik z enim klikom (ZIP)', 'Originalna kvaliteta fotografij'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <Check className="w-5 h-5 text-[var(--color-wedding-gold)]" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="order-1 md:order-2 bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 aspect-square"
              >
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="space-y-4">
                    <img src="https://picsum.photos/seed/gal1/400/500" alt="Gallery" className="w-full h-48 object-cover rounded-2xl" referrerPolicy="no-referrer" />
                    <img src="https://picsum.photos/seed/gal2/400/400" alt="Gallery" className="w-full h-40 object-cover rounded-2xl" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-4 pt-8">
                    <img src="https://picsum.photos/seed/gal3/400/400" alt="Gallery" className="w-full h-40 object-cover rounded-2xl" referrerPolicy="no-referrer" />
                    <img src="https://picsum.photos/seed/gal4/400/600" alt="Gallery" className="w-full h-56 object-cover rounded-2xl" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="paketi" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">Preprosti paketi</h2>
            <p className="text-lg text-gray-600">Plačate enkrat, spomini ostanejo za vedno. Brez skritih stroškov ali naročnin.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Basic */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-gray-900">BASIC</h3>
              <p className="text-gray-500 text-sm mb-6">Za manjše poroke in zabave.</p>
              <div className="text-5xl font-serif mb-8 text-gray-900">29€</div>
              <ul className="space-y-4 mb-8">
                {['Unikatna QR koda', 'Do 50 gostov', 'Do 200 fotografij', 'Dostop do galerije 1 mesec', 'Prenos vseh slik (ZIP)'].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-gray-400 shrink-0" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=basic" className="block w-full py-4 px-6 text-center rounded-full border-2 border-gray-200 font-bold text-gray-900 hover:border-gray-900 transition-colors">
                Izberi Basic
              </Link>
            </div>
            
            {/* Plus */}
            <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-2xl transform md:-translate-y-4 relative border border-gray-800">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-wedding-gold)] text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                Najbolj priljubljeno
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">PLUS</h3>
              <p className="text-gray-400 text-sm mb-6">Vse kar potrebujete za popoln dan.</p>
              <div className="text-5xl font-serif mb-8 text-white">49€</div>
              <ul className="space-y-4 mb-8">
                {['Vse iz paketa BASIC', 'Neomejeno število gostov', 'Neomejeno fotografij', 'Live galerija (projekcija)', 'Personalizirana stran z imeni', 'Dostop do galerije 1 leto'].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-5 h-5 text-[var(--color-wedding-gold)] shrink-0" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=plus" className="block w-full py-4 px-6 text-center rounded-full bg-[var(--color-wedding-gold)] text-gray-900 font-bold hover:bg-[var(--color-wedding-gold-light)] transition-colors shadow-lg">
                Izberi Plus
              </Link>
            </div>
            
            {/* Premium */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-gray-900">PREMIUM</h3>
              <p className="text-gray-500 text-sm mb-6">Za tiste, ki želijo nekaj več.</p>
              <div className="text-5xl font-serif mb-8 text-gray-900">79€</div>
              <ul className="space-y-4 mb-8">
                {['Vse iz paketa PLUS', 'Premium design predloge', 'Dostop do galerije 2 leti', 'Prioritetna podpora'].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-5 h-5 text-gray-400 shrink-0" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=premium" className="block w-full py-4 px-6 text-center rounded-full border-2 border-gray-200 font-bold text-gray-900 hover:border-gray-900 transition-colors">
                Izberi Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">Ste pripravljeni na zbiranje spominov?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Ustvarite svoj dogodek v manj kot 2 minutah in prejmite svojo QR kodo takoj.
            </p>
            <Link to="/create" className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-10 py-5 rounded-full text-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl">
              Ustvari dogodek zdaj <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <Link to="/" className="font-serif text-2xl tracking-tight text-gray-900 mb-4 block">
                Kliksy<span className="text-[var(--color-wedding-gold)]">.</span>
              </Link>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Najboljši način za zbiranje fotografij vaših gostov. Preprosto, hitro in brez aplikacij.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Produkt</h4>
              <ul className="space-y-3 text-gray-500">
                <li><a href="#kako-deluje" className="hover:text-gray-900 transition-colors">Kako deluje</a></li>
                <li><a href="#paketi" className="hover:text-gray-900 transition-colors">Cenik</a></li>
                <li><Link to="/event/demo" className="hover:text-gray-900 transition-colors">Demo galerija</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Podjetje</h4>
              <ul className="space-y-3 text-gray-500">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Pogoji uporabe</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Zasebnost</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Kontakt</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Kliksy. Vse pravice pridržane.</p>
            <p className="mt-2 md:mt-0 flex items-center gap-1">
              Narejeno z <Heart className="w-4 h-4 text-red-500 fill-red-500" /> za popolne poroke
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
