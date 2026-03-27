import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Camera, QrCode, Download, Heart, ArrowRight, Check, Star, Smartphone, Images, Sparkles, Play } from "lucide-react";
import { LANDING_IMAGES } from "../config/images";

const EVENT_TYPES = ["Poroke", "Zabave", "Rojstnega dne", "Dogodka"];

export default function Landing() {
  const [currentEventType, setCurrentEventType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventType((prev) => (prev + 1) % EVENT_TYPES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-indigo-100 selection:text-indigo-900 font-sans overflow-x-hidden text-gray-900">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-bold text-2xl tracking-tight text-gray-900 flex items-center gap-2">
            {LANDING_IMAGES.logo ? (
              <img src={LANDING_IMAGES.logo} alt="Kliksy Logo" className="h-8 w-auto" referrerPolicy="no-referrer" />
            ) : (
              <>Kliksy<span className="text-indigo-600">.</span></>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#kako-deluje" className="hover:text-gray-900 transition-colors">Kako deluje</a>
            <a href="#prednosti" className="hover:text-gray-900 transition-colors">Prednosti</a>
            <a href="#paketi" className="hover:text-gray-900 transition-colors">Cenik</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Prijava
            </Link>
            <Link to="/create" className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
              Ustvari dogodek
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-indigo-50/50 blur-[100px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center z-10 relative">
          {/* Hero Content */}
          <div className="max-w-5xl mx-auto text-center z-10 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-gray-700">Več kot 10.000 deljenih spominov</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Zberi vsako fotografijo s<br />
              <span className="inline-block relative w-[280px] md:w-[400px] text-indigo-600 h-[1.2em] overflow-hidden align-bottom">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={currentEventType}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute left-0 right-0 text-center"
                  >
                    {EVENT_TYPES[currentEventType]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              z eno samo QR kodo.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Kliksy je najlažji način za zbiranje fotografij in videoposnetkov vaših gostov. Brez prenašanja aplikacij, brez registracije.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link to="/create" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-95">
                Ustvari dogodek brezplačno <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/event/demo" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                <Play className="w-5 h-5" /> Poglej demo
              </Link>
            </div>

            {LANDING_IMAGES.heroPhoneMockup && (
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative max-w-4xl mx-auto"
              >
                <div className="relative rounded-[2rem] overflow-hidden border border-gray-200/50 shadow-2xl shadow-indigo-900/10 bg-white">
                  <div className="absolute top-0 left-0 w-full h-12 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200/50 flex items-center px-4 gap-2 z-10">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="mx-auto bg-white px-4 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200 shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      Nova slika: Gost je pravkar naložil sliko
                    </div>
                  </div>
                  <img 
                    src={LANDING_IMAGES.heroPhoneMockup} 
                    alt="Kliksy App Interface" 
                    className="w-full h-auto object-cover pt-12"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            )}
          </div>
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
      <section id="kako-deluje" className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[100px]" />
          <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-50/50 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 md:mb-32">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">Kako deluje?</h2>
            <p className="text-lg md:text-xl text-gray-600">Zbiranje spominov še nikoli ni bilo tako preprosto. Brez prenosov aplikacij in brez zapletenih navodil.</p>
          </div>

          <div className="space-y-32 md:space-y-40">
            {/* Feature 1 */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="order-2 md:order-1"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <QrCode className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">1. Natisnite QR kodo</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Ob ustvarjanju dogodka prejmete unikatno QR kodo. Natisnite jo in jo postavite na mize, ob vhod ali na šank. Pripravili smo tudi čudovite predloge za tisk.
                </p>
                <ul className="space-y-4">
                  {['Takojšen dostop do kode', 'PDF predloge za tisk', 'Možnost naročila lesenega stojala'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-indigo-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="order-1 md:order-2 bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-800 aspect-square flex items-center justify-center relative overflow-hidden group"
              >
                <img src={LANDING_IMAGES.printQrCode} alt="Printed QR Code" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                
                <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center transform transition-transform duration-500 group-hover:scale-105">
                  <QrCode className="w-12 h-12 text-white mb-3" />
                  <p className="font-bold text-lg text-white tracking-tight">QR koda pripravljena</p>
                </div>
              </motion.div>
            </div>

            {/* Feature 2 */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-800 aspect-square flex items-center justify-center relative overflow-hidden group"
              >
                <img src={LANDING_IMAGES.guestTakingPhoto} alt="Guest taking photo" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                
                <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center transform transition-transform duration-500 group-hover:scale-105">
                  <Camera className="w-12 h-12 text-white mb-3" />
                  <p className="font-bold text-lg text-white tracking-tight">Gostje slikajo</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <Smartphone className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">2. Gostje slikajo in delijo</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Gostje s svojim telefonom skenirajo QR kodo. Odpre se jim preprosta spletna stran, kjer lahko takoj slikajo ali izberejo slike iz svoje galerije.
                </p>
                <ul className="space-y-4">
                  {['Deluje na vseh telefonih (iOS & Android)', 'Brez registracije ali prijave', 'Izjemno hitro nalaganje'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-indigo-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Feature 3 */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="order-2 md:order-1"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <Images className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">3. Vse slike v eni galeriji</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Pozabite na iskanje slik po WhatsAppu, Instagramu in e-mailih. Vse fotografije vaših gostov se v živo zbirajo v vaši zasebni galeriji.
                </p>
                <ul className="space-y-4">
                  {['Galerija v živo (Live Slideshow)', 'Prenos vseh slik z enim klikom (ZIP)', 'Originalna kvaliteta fotografij'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 text-indigo-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="order-1 md:order-2 bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-800 aspect-square flex items-center justify-center relative overflow-hidden group"
              >
                <img src={LANDING_IMAGES.galleryGrid1} alt="Gallery" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                
                <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center transform transition-transform duration-500 group-hover:scale-105">
                  <Images className="w-12 h-12 text-white mb-3" />
                  <p className="font-bold text-lg text-white tracking-tight">Vse slike zbrane</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="paketi" className="py-24 md:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">Preprosti paketi</h2>
            <p className="text-lg text-gray-600">Plačate enkrat, spomini ostanejo za vedno. Brez skritih stroškov ali naročnin.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Basic */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-gray-900">BASIC</h3>
              <p className="text-gray-500 text-sm mb-6">Za manjše poroke in zabave.</p>
              <div className="text-5xl font-extrabold mb-8 text-gray-900 tracking-tight">29€</div>
              <ul className="space-y-4 mb-10">
                {['Unikatna QR koda', 'Do 50 gostov', 'Do 200 fotografij', 'Dostop do galerije 1 mesec', 'Prenos vseh slik (ZIP)'].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=basic" className="block w-full py-4 px-6 text-center rounded-xl border-2 border-gray-200 font-bold text-gray-900 hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                Izberi Basic
              </Link>
            </div>
            
            {/* Plus */}
            <div className="bg-indigo-600 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl transform md:-translate-y-4 relative border border-indigo-500">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-indigo-400 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                Najbolj priljubljeno
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">PLUS</h3>
              <p className="text-indigo-200 text-sm mb-6">Vse kar potrebujete za popoln dan.</p>
              <div className="text-5xl font-extrabold mb-8 text-white tracking-tight">49€</div>
              <ul className="space-y-4 mb-10">
                {['Vse iz paketa BASIC', 'Neomejeno število gostov', 'Neomejeno fotografij', 'Live galerija (projekcija)', 'Personalizirana stran z imeni', 'Dostop do galerije 1 leto'].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-indigo-100 font-medium">
                    <Check className="w-5 h-5 text-indigo-300 shrink-0" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=plus" className="block w-full py-4 px-6 text-center rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-50 transition-colors shadow-lg">
                Izberi Plus
              </Link>
            </div>
            
            {/* Premium */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-gray-900">PREMIUM</h3>
              <p className="text-gray-500 text-sm mb-6">Za tiste, ki želijo nekaj več.</p>
              <div className="text-5xl font-extrabold mb-8 text-gray-900 tracking-tight">79€</div>
              <ul className="space-y-4 mb-10">
                {['Vse iz paketa PLUS', 'Premium design predloge', 'Dostop do galerije 2 leti', 'Prioritetna podpora'].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                    <Check className="w-5 h-5 text-indigo-400 shrink-0" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=premium" className="block w-full py-4 px-6 text-center rounded-xl border-2 border-gray-200 font-bold text-gray-900 hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                Izberi Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/50 to-gray-900 opacity-50" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">Ste pripravljeni na zbiranje spominov?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Ustvarite svoj dogodek v manj kot 2 minutah in prejmite svojo QR kodo takoj.
            </p>
            <Link to="/create" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/30">
              Ustvari dogodek zdaj <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900 mb-4 block">
                {LANDING_IMAGES.logo ? (
                  <img src={LANDING_IMAGES.logo} alt="Kliksy Logo" className="h-8 w-auto" referrerPolicy="no-referrer" />
                ) : (
                  <>Kliksy<span className="text-indigo-600">.</span></>
                )}
              </Link>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Najboljši način za zbiranje fotografij vaših gostov. Preprosto, hitro in brez aplikacij.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Produkt</h4>
              <ul className="space-y-3 text-gray-500 font-medium">
                <li><a href="#kako-deluje" className="hover:text-indigo-600 transition-colors">Kako deluje</a></li>
                <li><a href="#paketi" className="hover:text-indigo-600 transition-colors">Cenik</a></li>
                <li><Link to="/event/demo" className="hover:text-indigo-600 transition-colors">Demo galerija</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Podjetje</h4>
              <ul className="space-y-3 text-gray-500 font-medium">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pogoji uporabe</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Zasebnost</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Kontakt</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 text-sm text-gray-400 font-medium">
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
