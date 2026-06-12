import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Camera, QrCode, Download, Heart, ArrowRight, Check, Star, Smartphone, Images, Sparkles, User as UserIcon, Shield, Zap, Users, ChevronDown, LayoutGrid, Smile, Menu, X } from "lucide-react";
import { LANDING_IMAGES } from "../config/images";
import { useAuth } from "../components/AuthProvider";

const EVENT_TYPES = [
  { word: "vašeg vjenčanja" },
  { word: "vašeg događaja" },
  { word: "vaše proslave" }
];

const REVIEWS = [
  { 
    name: "Tina & Luka", date: "Travanj 2026", 
    text: "Ludo dobra ideja! Dobili smo toliko spontanih fotografija koje inače ne bismo nikada vidjeli. Gosti su oduševljeni koliko je bilo jednostavno.",
    initials: "TL", gender: "couple"
  },
  {
    name: "Marko", date: "Ožujak 2026",
    text: "Za moj 30. rođendan koristili smo Kliksy. Ludo, koliko sam zabavnih slika dobio sljedeći dan. Prijatelji su odmah počeli dodavati slike!",
    initials: "M", gender: "male"
  },
  {
    name: "Ekipa tvrtke", date: "Prosinac 2025",
    text: "Konačno smo dokumentirali našu božićnu zabavu na jednom mjestu. Kao tehničari jako hvalimo jednostavnost. Scan and shoot. Bez kreiranja korisničkih računa.",
    initials: "IT", gender: "couple"
  },
  { 
    name: "Maja & David", date: "Kolovoz 2025", 
    text: "Sve slike prikupljene na jednom mjestu, bez stresa i preuzimanja. Toplo preporučujemo svakom paru!",
    initials: "MD", gender: "couple"
  },
  {
    name: "Špela", date: "Lipanj 2025",
    text: "Odlična stvar! QR kodove sam stavila na stolove i ujutro me dočekala savršena galerija svih trenutaka s moje proslave diplome koje sam propustila.",
    initials: "Š", gender: "female"
  },
  { 
    name: "Nina & Rok", date: "Rujan 2025", 
    text: "Najbolji dodatak našem vjenčanju! Svaki gost je dodao barem nekoliko slika. Uspomene koje nikada drugačije ne bismo dobili.",
    initials: "NR", gender: "couple"
  },
  {
    name: "Tomaž", date: "Studeni 2025",
    text: "Godišnji teambuilding na jednom mjestu zabilježen od strane svih kolega. Konačno ne moramo moliti da dijele slike po raznim grupama i platformama.",
    initials: "T", gender: "male"
  },
  {
    name: "Ana & Peter", date: "Kolovoz 2025",
    text: "Vrlo praktično! Bilo je sjajno gledati događaj očima naših prijatelja. Toplo preporučujem.",
    initials: "AP", gender: "couple"
  },
  {
    name: "Sara & Matej", date: "Rujan 2025",
    text: "Jednostavno za starije goste! Moja baka je bez problema dodala svoje fotografije. Kvaliteta slika je takva kakva mora biti.",
    initials: "SM", gender: "couple"
  },
  {
    name: "Tjaša & Miha", date: "Travanj 2026",
    text: "Fotografu će trebati mjesec dana za slike, a mi smo imali preko 500 ludih i spontanih slika već istu večer!",
    initials: "TM", gender: "couple"
  }
];

const FAQS = [
  { q: "Trebaju li gosti aplikaciju?", a: "Ne! Kliksy radi potpuno u pregledniku na telefonu. Gosti samo skeniraju QR kod svojom kamerom i odmah mogu dodavati fotografije - bez preuzimanja i bez registracije." },
  { q: "Radi li i bez interneta?", a: "Za dodavanje fotografija gosti trebaju internetsku vezu (mobilne podatke ili Wi-Fi događaja). Galeriju možete pregledavati i koristiti kad god ste na mreži." },
  { q: "Koliko dugo imam pristup galeriji?", a: "Ovisno o odabranom paketu. Kod Basic paketa to je 1 mjesec, kod Plus 1 godina, a kod Premium paketa 2 godine. U tom vremenu možete preuzeti uspomene bilo kada." },
  { q: "Je li galerija privatna?", a: "Da, vaša galerija je 100% privatna. Njoj mogu pristupiti samo oni kojima pošaljete poveznicu i gosti koji su skenirali QR kod." },
  { q: "Što ako imam više događaja?", a: "Unutar svoje nadzorne ploče (dashboarda) možete dodati nove događaje i imati sve događaje prikupljene na svom profilu." }
];

export default function LandingHr() {
  const [currentEventType, setCurrentEventType] = useState(0);
  const { user } = useAuth();
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventType((prev) => (prev + 1) % EVENT_TYPES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-indigo-100 selection:text-indigo-900 font-sans text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-[28px] tracking-tight text-gray-900 flex items-center gap-2">
            Kliksy<span className="text-[#5B45FF]">.</span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[15px] font-semibold text-gray-600">
            <a href="#kako-deluje" className="hover:text-gray-900 transition-colors">Kako radi</a>
            <a href="#prednosti-dodatne" className="hover:text-gray-900 transition-colors">Zašto ti to treba</a>
            <a href="#paketi" className="hover:text-gray-900 transition-colors">Cjenik</a>
            <a href="#mnenja" className="hover:text-gray-900 transition-colors">Mišljenja</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {user && !user.isAnonymous ? (
              <Link to="/dashboard" className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-5 h-5 mx-auto" />
                )}
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex shrink-0 flex-col items-center justify-center w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 transition-colors">
                <UserIcon className="w-5 h-5 text-purple-600" />
              </Link>
            )}
            <Link to="/create" className="hidden sm:inline-flex bg-gray-900 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-[13px] sm:text-[15px] font-bold hover:bg-gray-800 transition-all shadow-md whitespace-nowrap">
              Napravi događaj
            </Link>
            <button className="lg:hidden text-[#5B45FF] p-2 -mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-7 h-7 stroke-[2.5]" /> : <Menu className="w-7 h-7 stroke-[2.5]" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="flex flex-col py-4 px-6 space-y-4 text-center text-[16px] font-semibold text-gray-700">
                <a href="#kako-deluje" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Kako radi</a>
                <a href="#prednosti-dodatne" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Zašto ti to treba</a>
                <a href="#paketi" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Cjenik</a>
                <a href="#mnenja" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Mišljenja</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">FAQ</a>
                {!user || user.isAnonymous ? (
                  <div className="pt-4 flex flex-col gap-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-purple-50 text-purple-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                       Prijava <UserIcon className="w-5 h-5"/>
                    </Link>
                    <Link to="/create" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-[#5B45FF] text-white py-3 rounded-xl font-bold text-lg">
                      Napravi događaj
                    </Link>
                  </div>
                ) : (
                  <div className="pt-4">
                    <Link to="/create" onClick={() => setIsMobileMenuOpen(false)} className="w-full inline-block bg-[#5B45FF] text-white py-3 rounded-xl font-bold text-lg">
                      Napravi novi događaj
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-[110px] md:pt-[140px] pb-8 px-6 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-8">
          
          {/* Left / Text Side */}
          <div className="w-full md:w-[55%] lg:w-1/2 px-2 md:px-0 text-center md:text-left">

            
            <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[4.5rem] font-extrabold tracking-tight text-gray-900 mb-4 leading-[1.05] break-words min-h-[160px] md:min-h-0 flex flex-col justify-start md:block">
              <span className="block">Ne gubi slike</span>
              <span className="inline-grid text-[#5B45FF] leading-[1.05] mt-1 sm:mt-0">
                {EVENT_TYPES.map((type, index) => (
                  <motion.span
                    key={index}
                    className="col-start-1 row-start-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: currentEventType === index ? 1 : 0, 
                      y: currentEventType === index ? 0 : -20,
                      pointerEvents: currentEventType === index ? 'auto' : 'none'
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {type.word}.
                  </motion.span>
                ))}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
              S Kliksyjem prikupite sve fotografije i videozapise gostiju na jednom mjestu, samo jednim QR kodom.
            </p>

            {/* Photo Collage */}
            <div className="relative w-[110%] -ml-[5%] sm:ml-0 sm:w-full max-w-[420px] h-[280px] sm:h-[350px] mb-12 mt-6 mx-auto md:mx-0 shrink-0">
              {/* Top-left: Dancing (1) */}
              <img 
                src="https://i.postimg.cc/7hvnkh7X/hf-20260424-062805-2a04f02c-aa0e-4117-8b31-73864659076b.webp" 
                className="absolute left-0 top-[2%] w-[55%] aspect-[4/3] object-cover rounded shadow-md border-4 sm:border-[6px] border-white transform -rotate-6 z-10 hover:scale-105 hover:z-50 transition-all duration-300" 
                alt="Zabava" 
              />
              
              {/* Top-right: QR on table (2) */}
              <img 
                src="https://i.postimg.cc/J0bc48cg/hf-20260424-062820-195d1677-9456-4936-a48d-ba136c48a79a.webp" 
                className="absolute right-0 top-[8%] w-[52%] aspect-[4/3] object-cover rounded shadow-lg border-4 sm:border-[6px] border-white transform rotate-6 z-20 hover:scale-105 hover:z-50 transition-all duration-300" 
                alt="QR kod na stolu" 
              />
              
              {/* Bottom-right: Photobooth (4) */}
              <img 
                src="https://i.postimg.cc/ZnrFKmFX/hf-20260429-125252-5fda138d-9fbe-41ec-bb70-16fb08cf8414.webp" 
                className="absolute right-[5%] bottom-[5%] w-[58%] aspect-[4/3] object-cover rounded shadow-xl border-4 sm:border-[6px] border-white transform -rotate-3 z-30 hover:scale-105 hover:z-50 transition-all duration-300" 
                alt="Photobooth rekviziti" 
              />
              
              {/* Bottom-left: Flyer (3) */}
              <img 
                src="https://i.postimg.cc/prDYXvY6/hf-20260424-062820-a905e0f9-16e9-4c55-be91-4cde92a15ea0.webp" 
                className="absolute left-[5%] bottom-0 w-[45%] aspect-[3/4] object-cover rounded shadow-2xl border-4 sm:border-[6px] border-white transform rotate-[-8deg] z-40 hover:scale-105 hover:z-50 transition-all duration-300" 
                alt="Kliksy letak" 
              />
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <Link to="/create" onClick={() => { if (typeof window !== 'undefined' && window.fbq) { window.fbq('track', 'AddToCart'); } }} className="inline-flex items-center justify-center gap-3 bg-[#5B45FF] text-white px-8 py-4 rounded-full text-[17px] font-bold hover:bg-[#4E3BE0] transition-all shadow-xl shadow-[#5B45FF]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-95 text-center w-[90%] mx-auto md:mx-0 sm:w-auto">
                Napravi svoju galeriju sada <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center justify-center md:justify-start gap-2 text-[13px] md:text-[14px] font-semibold text-green-600">
                <Check className="w-4 h-4 text-white stroke-[3] bg-green-500 rounded-full p-0.5 shrink-0" />
                <span>Sigurno. Privatno. Samo za vas i vaše goste.</span>
              </div>
            </div>
          </div>

          {/* Right / Hero Image */}
          <div className="w-full md:w-[45%] lg:w-1/2 relative lg:h-[500px] flex items-center justify-center md:justify-end mt-12 md:mt-0">
             <div className="relative w-full max-w-[600px] right-0 lg:-mr-16">
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative border-[6px] border-white" style={{boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}}>
                   {LANDING_IMAGES.heroPhoneMockup ? (
                     <img src={LANDING_IMAGES.heroPhoneMockup} alt="Wedding group selfie" className="w-full h-auto object-cover aspect-[4/3] relative z-10" />
                   ) : (
                     <div className="w-full aspect-[4/3] bg-gray-200"></div>
                   )}
                </div>
                
                {/* Floating Notification */}
                <div className="absolute -top-4 right-4 sm:-right-8 lg:-right-4 z-20 bg-white px-5 py-3 rounded-[24px] shadow-xl flex items-center gap-3 border border-gray-100">
                  <div className="flex -space-x-3">
                     <div className="w-10 h-10 rounded-full bg-pink-100 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center text-[20px]">👩</div>
                     <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center text-[20px]">👨</div>
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold flex items-center gap-1.5 text-gray-900">Veselje na vjenčanju <Heart className="w-4 h-4 text-red-500 fill-red-500"/></p>
                    <p className="text-[13px] text-gray-500"><strong className="text-gray-900">+183</strong> novih fotografija</p>
                  </div>
                </div>

                {/* Floating QR */}
                <div className="absolute -bottom-8 -left-4 sm:-left-8 lg:-left-4 z-20 bg-white p-4 rounded-[28px] shadow-xl flex items-center gap-4 border border-gray-100">
                  <div className="bg-gray-100/80 rounded-2xl p-2.5">
                    <QrCode className="w-12 h-12 text-gray-900" />
                  </div>
                  <div className="pr-2">
                    <p className="text-[15px] font-bold leading-tight text-gray-900">Skeniraj<br/>QR kod</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="py-6 bg-transparent max-w-[1200px] mx-auto px-4 sm:px-6 relative z-30 mt-6 md:-mt-8 mb-16">
        <div className="bg-white rounded-[2rem] px-6 sm:px-8 py-8 md:py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 flex-col items-stretch">
          
          <div className="flex flex-row items-center gap-4 sm:gap-5 w-full md:w-auto mt-2 md:mt-0 justify-start">
            <div className="flex -space-x-3 shrink-0">
              <div className="w-12 h-12 rounded-full bg-pink-100 border-2 border-white shadow-sm flex items-center justify-center text-[24px]">👩</div>
              <div className="w-12 h-12 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-[24px]">👨</div>
              <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-[24px]">👱‍♂️</div>
            </div>
            <div className="text-left">
              <p className="text-xl sm:text-2xl font-extrabold text-[#5B45FF]">200+</p>
              <p className="text-[14px] sm:text-[15px] font-semibold text-gray-600 leading-tight">ljudi je već odabralo Kliksy</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-gray-100" />
          <div className="block md:hidden w-full h-px bg-gray-100" />

          <div className="flex flex-row items-center gap-4 sm:gap-5 w-full md:w-auto justify-start">
             <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full border-2 border-indigo-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B45FF]" />
             </div>
             <div className="text-left">
               <p className="text-xl sm:text-2xl font-extrabold text-[#5B45FF]">5.0/5</p>
               <p className="text-[14px] sm:text-[15px] font-semibold text-gray-600 mb-1 leading-none pt-1">na temelju prvih ocjena</p>
               <div className="flex items-center gap-1">
                 {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />)}
               </div>
             </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-gray-100" />
          <div className="block md:hidden w-full h-px bg-gray-100" />

          <div className="flex flex-row items-center gap-4 sm:gap-5 w-full md:w-auto justify-start">
             <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full border-2 border-indigo-100 flex items-center justify-center">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B45FF]" />
             </div>
             <div className="text-left">
               <p className="text-xl sm:text-2xl font-extrabold text-[#5B45FF]">10000+</p>
               <p className="text-[14px] sm:text-[15px] font-semibold text-gray-600 leading-tight">prikupljenih fotografija i videa</p>
             </div>
          </div>
        </div>
      </section>

      {/* Zašto ti to treba? */}
      <section className="pb-16 pt-8 bg-[#FDFCFB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-center mb-16 text-gray-900 tracking-tight">Zašto ti to treba?</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-5 p-0 sm:p-6 mb-6 md:mb-0">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 mb-0 md:mb-6 flex items-center justify-center rounded-[16px] md:rounded-[20px] bg-white border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#F3F1FF] opacity-50"></div>
                 <LayoutGrid className="w-6 h-6 md:w-8 md:h-8 text-[#5B45FF] stroke-[1.5] relative z-10" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900 leading-tight">Fotograf ne može biti svugdje</h3>
                 <p className="text-gray-500 font-medium text-[15px] md:text-[16px] leading-relaxed">Gosti uhvate spontane trenutke koje profesionalni fotograf često propusti.</p>
               </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-5 p-0 sm:p-6 mb-6 md:mb-0">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 mb-0 md:mb-6 flex items-center justify-center rounded-[16px] md:rounded-[20px] bg-white border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#F3F1FF] opacity-50"></div>
                 <Shield className="w-6 h-6 md:w-8 md:h-8 text-[#5B45FF] stroke-[1.5] relative z-10" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900 leading-tight">Slike se inače izgube</h3>
                 <p className="text-gray-500 font-medium text-[15px] md:text-[16px] leading-relaxed">Fotografije ostaju na mobitelima, u razgovorima i nikada ih ne dobijete.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-5 p-0 sm:p-6 mb-2 md:mb-0">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 mb-0 md:mb-6 flex items-center justify-center rounded-[16px] md:rounded-[20px] bg-white border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#F3F1FF] opacity-50"></div>
                 <Camera className="w-6 h-6 md:w-8 md:h-8 text-[#5B45FF] stroke-[1.5] relative z-10" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900 leading-tight">Uspomene iz svih kutova</h3>
                 <p className="text-gray-500 font-medium text-[15px] md:text-[16px] leading-relaxed">Dobivate cijelu priču vašeg dana, kroz oči vaših gostiju.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#FDFCFB]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <Link to="/create" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#5B45FF] text-white px-8 py-4 rounded-full text-[17px] font-bold hover:bg-[#4E3BE0] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#5B45FF]/30">
            Počnite skupljati uspomene <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Kako radi? */}
      <section id="kako-deluje" className="py-24 bg-[#FDFCFB] relative text-center">
        <h2 className="text-[36px] md:text-[44px] font-extrabold mb-20 text-gray-900 tracking-tight">Kako radi?</h2>
        
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 md:gap-8 relative">
            <div className="hidden lg:block absolute top-[28px] left-[16%] right-[16%] h-px z-0 bg-indigo-100" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-14 h-14 bg-[#5B45FF] text-white rounded-full flex items-center justify-center text-xl font-extrabold shadow-lg shadow-[#5B45FF]/30 mb-8 border-[5px] border-white ring-1 ring-gray-100 relative z-10">
                 1
               </div>
               <h3 className="text-[20px] font-extrabold mb-3 text-gray-900">Ispišite QR kod</h3>
               <p className="text-gray-500 font-medium px-4 mb-10 leading-relaxed text-[16px] md:min-h-[80px]">
                 QR kod ispišete i postavite na stolove, na ulazu ili bilo gdje na događaju.
               </p>
               <div className="mt-auto w-full max-w-[280px] bg-[#F8F9FA] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] mx-auto relative border-[8px] border-white">
                 {LANDING_IMAGES.printQrCode ? (
                   <img src={LANDING_IMAGES.printQrCode} alt="Natisnite kodo" className="w-full h-[360px] object-cover" />
                 ) : (
                   <div className="w-full h-[360px] bg-gray-200"></div>
                 )}
               </div>
               
               <svg className="w-10 h-16 md:hidden text-gray-300 mt-8" fill="none" stroke="currentColor" viewBox="0 0 40 100" preserveAspectRatio="none">
                 <path strokeDasharray="6,6" strokeWidth="3" d="M20 0 L20 80 M20 80 L5 65 M20 80 L35 65" />
               </svg>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-14 h-14 bg-[#5B45FF] text-white rounded-full flex items-center justify-center text-xl font-extrabold shadow-lg shadow-[#5B45FF]/30 mb-8 border-[5px] border-white ring-1 ring-gray-100 relative z-10">
                 2
               </div>
               <h3 className="text-[20px] font-extrabold mb-3 text-gray-900">Gosti slikaju i dijele</h3>
               <p className="text-gray-500 font-medium px-4 mb-10 leading-relaxed text-[16px] md:min-h-[80px]">
                 Gosti skeniraju QR kod i odmah počinju dodavati svoje fotografije i videozapise - bez prijava.
               </p>
               <div className="mt-auto w-full max-w-[280px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] mx-auto border-[10px] border-gray-900 relative">
                 {LANDING_IMAGES.guestTakingPhoto ? (
                   <img src={LANDING_IMAGES.guestTakingPhoto} alt="Guest taking photo" className="w-full h-[360px] object-cover" />
                 ) : (
                   <div className="w-full h-[360px] p-6 pt-12 flex flex-col bg-white">
                    <p className="text-center font-bold text-lg mb-8">Dodaj svoju fotografiju</p>
                    <div className="bg-gray-900 text-white p-4 rounded-full text-center font-bold mb-4 shadow-xl">Odaberi iz galerije</div>
                    <div className="text-center text-sm font-bold text-gray-400 mb-4">ili</div>
                    <div className="bg-gray-100 text-gray-600 p-4 rounded-full text-center font-bold">Snimi kamerom</div>
                   </div>
                 )}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
               </div>

               <svg className="w-10 h-16 md:hidden text-gray-300 mt-8" fill="none" stroke="currentColor" viewBox="0 0 40 100" preserveAspectRatio="none">
                 <path strokeDasharray="6,6" strokeWidth="3" d="M20 0 L20 80 M20 80 L5 65 M20 80 L35 65" />
               </svg>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-14 h-14 bg-[#5B45FF] text-white rounded-full flex items-center justify-center text-xl font-extrabold shadow-lg shadow-[#5B45FF]/30 mb-8 border-[5px] border-white ring-1 ring-gray-100 relative z-10">
                 3
               </div>
               <h3 className="text-[20px] font-extrabold mb-3 text-gray-900">Sve na jednom mjestu</h3>
               <p className="text-gray-500 font-medium px-4 mb-10 leading-relaxed text-[16px] md:min-h-[80px]">
                 Sve fotografije i videi se prikupljaju u vašoj privatnoj galeriji, koju nakon događaja možete preuzeti u 1 klik.
               </p>
               <div className="mt-auto w-full max-w-[280px] bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-5 flex flex-col mx-auto h-[360px]">
                 <div className="flex justify-between items-center mb-5">
                   <div className="text-left">
                     <p className="text-[14px] font-extrabold text-gray-900">Cijela zbirka</p>
                     <p className="text-[#5B45FF] font-bold text-[11px] mt-1 pt-1 opacity-80">182 fotografija • 24 videa</p>
                   </div>
                   <div className="px-3 py-1.5 border-2 border-indigo-50 rounded-full">
                     <p className="text-[#5B45FF] font-bold text-[11px]">Preuzmi sve</p>
                   </div>
                 </div>
                 {LANDING_IMAGES.galleryGrid1 ? (
                   <img src={LANDING_IMAGES.galleryGrid1} alt="Galerija grid" className="rounded-2xl w-full h-full object-cover"/>
                 ) : (
                   <div className="flex-1 rounded-2xl overflow-hidden relative grid grid-cols-2 gap-2 pb-2">
                      <div className="bg-gray-100 rounded-lg overflow-hidden h-32"></div>
                      <div className="bg-gray-100 rounded-lg overflow-hidden h-32"></div>
                      <div className="bg-gray-100 rounded-lg overflow-hidden h-32"></div>
                      <div className="bg-gray-100 rounded-lg overflow-hidden h-32"></div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#FDFCFB]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <Link to="/create" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#5B45FF] text-white px-8 py-4 rounded-full text-[17px] font-bold hover:bg-[#4E3BE0] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#5B45FF]/30">
            Napravi svoj događaj sada <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Zašto odabrati Kliksy? */}
      <section id="prednosti-dodatne" className="py-24 bg-[#FDFCFB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[32px] md:text-[44px] font-extrabold mb-12 md:mb-20 text-gray-900 tracking-tight text-center">Zašto odabrati Kliksy?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-16 gap-x-12">
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <LayoutGrid className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Bolje od Photo Bootha</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Bez ograničenja, bez rekvizita i čekanja u redu. Gosti fotografiraju sve što žele.</p>
               </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Smartphone className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Sve slike na jednom mjestu</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Nema više traženja po mobitelima i razgovorima. Sve je uređeno na jednom mjestu.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Zap className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Trenutni pristup</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Tijekom događaja već vidite nove sadržaje. Savršeno za dijeljenje s gostima.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Shield className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">100% privatnost</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Galerija je samo za vas i vaše odabrane goste. Bez javnih poveznica.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Camera className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Puna kvaliteta</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Fotografije i videozapisi su spremljeni u originalnoj kvaliteti. Bez kompresije i gubitka kvalitete.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Smile className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Zabavno za sve</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Jednostavno za sve generacije – od djece do baka i djedova.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mišljenja */}
      <section id="mnenja" className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-blue-50/20"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <h2 className="text-[32px] md:text-[44px] font-extrabold mb-12 md:mb-16 text-center text-gray-900 tracking-tight">Mišljenja naših kupcev</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {REVIEWS.slice(0, visibleReviews).map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col hover:-translate-y-1 transition-transform">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-700 font-medium leading-relaxed mb-8 flex-1 text-[15px] md:text-[16px]">
                  {review.text}
                </p>
                <div className="flex items-center gap-4 mt-auto">
                   <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center border-2 border-white ${review.gender === 'male' ? 'bg-blue-100' : review.gender === 'female' ? 'bg-pink-100' : 'bg-purple-100'}`}>
                     <span className="text-[24px] leading-none pb-0.5">{review.gender === 'male' ? '👨' : review.gender === 'female' ? '👩' : '👫'}</span>
                   </div>
                   <div>
                     <p className="font-extrabold text-gray-900 text-[15px]">{review.name}</p>
                     <p className="text-[13px] text-gray-500 font-medium pt-0.5">{review.date}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {visibleReviews < REVIEWS.length && (
            <div className="text-center">
              <button 
                onClick={() => setVisibleReviews(prev => prev + 3)}
                className="inline-flex flex-col items-center gap-1 text-gray-500 font-bold hover:text-gray-900 transition-colors py-4 px-6"
              >
                Učitaj više mišljenja
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Paketi */}
      <section id="paketi" className="py-24 bg-[#FDFCFB] relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16 md:mb-20 relative flex flex-col items-center">
            <h2 className="text-[36px] md:text-[44px] font-extrabold mb-4 text-gray-900 tracking-tight">Jednostavni paketi</h2>
            <p className="text-[15px] md:text-[16px] text-gray-500 font-medium mb-6">Odaberite paket koji najviše odgovara vašem događaju.</p>
            

          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
            {/* Basic */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden">
              <h3 className="text-[18px] font-extrabold mb-1 text-gray-900 tracking-tight">BASIC</h3>
              <p className="text-gray-500 text-[13px] mb-8 font-medium">Za manje događaje</p>
              <div className="flex items-baseline gap-3 mb-8">
                <div className="text-[48px] font-extrabold text-gray-900 tracking-tight leading-none">39<span className="text-[32px]">€</span></div>
                <div className="text-[20px] text-gray-400 font-bold line-through">55€</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Unikatni QR kod', 
                  'Do 50 gostiju', 
                  'Do 200 fotografija', 
                  'Pristup galeriji 1 mjesec',
                  'Preuzimanje svih slika (ZIP)'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700 font-medium">
                    <Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=basic" className="block w-full py-4 text-center rounded-full border border-gray-200 font-bold text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors text-[15px]">
                Odaberi Basic
              </Link>
            </div>
            
            {/* Plus */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgb(91,69,255,0.12)] border-2 border-[#5B45FF] flex flex-col z-10 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] bg-[#5B45FF] text-white text-[11px] font-extrabold px-6 py-1.5 rounded-b-xl uppercase shadow-sm whitespace-nowrap">
                NAJPOPULARNIJE
              </div>
              <h3 className="text-[18px] font-extrabold mb-1 text-gray-900 tracking-tight pt-2">PLUS</h3>
              <p className="text-gray-500 text-[13px] mb-8 font-medium">Za veće događaje i vjenčanja</p>
              <div className="flex items-baseline gap-3 mb-8">
                <div className="text-[48px] font-extrabold text-[#5B45FF] tracking-tight leading-none">49<span className="text-[32px]">€</span></div>
                <div className="text-[20px] text-gray-400 font-bold line-through">69€</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Unikatni QR kod', 
                  'Neograničen broj gostiju', 
                  'Neograničeno fotografija', 
                  'Pristup galeriji 1 godina', 
                  'Preuzimanje svih slika (ZIP)', 
                  'Live galerija (projekcija)',
                  'Personalizirana stranica s imenima'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700 font-medium">
                    <Check className="w-4 h-4 text-[#5B45FF] shrink-0 mt-0.5" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=plus" className="block w-full py-4 text-center rounded-full bg-[#5B45FF] text-white font-bold hover:bg-[#4E3BE0] transition-colors shadow-lg shadow-[#5B45FF]/20 mt-auto text-[15px]">
                Odaberi Plus
              </Link>
            </div>
            
            {/* Premium */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
              <h3 className="text-[18px] font-extrabold mb-1 text-gray-900 tracking-tight">PREMIUM</h3>
              <p className="text-gray-500 text-[13px] mb-8 font-medium">Za one koji žele sve</p>
              <div className="flex items-baseline gap-3 mb-8">
                <div className="text-[48px] font-extrabold text-gray-900 tracking-tight leading-none">79<span className="text-[32px]">€</span></div>
                <div className="text-[20px] text-gray-400 font-bold line-through">109€</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Unikatni QR kod', 
                  'Neograničen broj gostiju', 
                  'Neograničeno fotografija', 
                  'Do 100 videozapisa',
                  'Pristup galeriji 2 godine', 
                  'Preuzimanje svih slika (ZIP)', 
                  'Live galerija (projekcija)',
                  'Personalizirana stranica s imenima',
                  'Premium design predlošci',
                  'Prioritetna podrška'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700 font-medium">
                    <Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=premium" className="block w-full py-4 text-center rounded-full border border-gray-200 font-bold text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors mt-auto text-[15px]">
                Odaberi Premium
              </Link>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-[14px] text-gray-500 font-medium">
             <Shield className="w-5 h-5 text-gray-400" /> 30-dnevno jamstvo povrata novca – bez pitanja.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white relative">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-[36px] md:text-[44px] font-extrabold mb-16 text-center text-gray-900 tracking-tight">Česta pitanja</h2>
          
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#FDFCFB] border border-gray-100 rounded-[20px] overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center font-extrabold text-gray-900 hover:text-[#5B45FF] transition-colors"
                >
                  <span className="text-[17px]">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#5B45FF] transform transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-8 pb-6 text-gray-500 font-medium text-[16px] leading-relaxed pt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-4 sm:px-6 bg-white">
        <div className="max-w-[1280px] mx-auto bg-[#1C1F26] rounded-[2rem] sm:rounded-[2.5rem] pt-12 px-6 pb-0 md:pt-20 md:px-20 text-center relative flex flex-col items-center shadow-2xl overflow-hidden">
            <h2 className="text-[32px] sm:text-[36px] md:text-[44px] font-extrabold mb-4 sm:mb-6 text-white tracking-tight leading-[1.1] relative z-10">Jeste li spremni za<br/>prikupljanje uspomena?</h2>
            <p className="text-[15px] sm:text-[17px] text-gray-400 mb-8 sm:mb-10 max-w-lg mx-auto font-medium leading-relaxed relative z-10">
              Stvorite svoju galeriju i ne izgubite nijednu fotografiju sa svog posebnog dana.
            </p>
            <Link to="/create" onClick={() => { if (typeof window !== 'undefined' && window.fbq) { window.fbq('track', 'AddToCart'); } }} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#5B45FF] text-white px-8 py-4 rounded-full text-[15px] sm:text-[17px] font-bold hover:bg-[#4E3BE0] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#5B45FF]/30 relative z-10 mb-12">
              Napravi svoju galeriju sada <ArrowRight className="w-5 h-5" />
            </Link>
          
          <div className="relative w-full flex justify-center gap-3 sm:gap-6 px-4 pb-0 -mb-8 sm:-mb-12 mt-4 z-0">
             <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=300" className="w-[100px] sm:w-[180px] h-[120px] sm:h-[200px] object-cover rounded-xl shadow-2xl transform rotate-[-4deg] translate-y-4" alt="Uspomene sa zabave" />
             <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=300" className="w-[120px] sm:w-[220px] h-[140px] sm:h-[240px] object-cover rounded-xl shadow-2xl z-10" alt="Vrhunske uspomene" />
             <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=300" className="w-[100px] sm:w-[180px] h-[120px] sm:h-[200px] object-cover rounded-xl shadow-2xl transform rotate-[4deg] translate-y-4" alt="Prijatelji" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-5 lg:col-span-4 pr-8">
              <Link to="/" className="text-[28px] font-extrabold tracking-tight text-gray-900 mb-4 block">
                 Kliksy<span className="text-[#5B45FF]">.</span>
              </Link>
              <p className="text-gray-500 leading-relaxed font-medium text-[15px] max-w-sm">
                Prikupljanje uspomena nikad nije bilo tako jednostavno.
              </p>
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="font-extrabold text-gray-900 mb-6 text-[15px]">Povezave</h4>
              <ul className="space-y-4 text-gray-500 font-medium text-[15px]">
                <li><a href="#kako-deluje" className="hover:text-gray-900 transition-colors">Kako radi</a></li>
                <li><a href="#paketi" className="hover:text-gray-900 transition-colors">Paketi</a></li>
                <li><a href="#mnenja" className="hover:text-gray-900 transition-colors">Mišljenja</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="font-extrabold text-gray-900 mb-6 text-[15px]">Pravno</h4>
              <ul className="space-y-4 text-gray-500 font-medium text-[15px]">
                <li><Link to="/pogoji-uporabe" className="hover:text-gray-900 transition-colors">Opći uvjeti korištenja</Link></li>
                <li><Link to="/zasebnost" className="hover:text-gray-900 transition-colors">Privatnost</Link></li>
                <li><Link to="/piskotki" className="hover:text-gray-900 transition-colors">Kolačići</Link></li>
              </ul>
            </div>
            <div className="md:col-span-3 lg:col-span-4">
              <h4 className="font-extrabold text-gray-900 mb-6 text-[15px]">Kontakt</h4>
              <p className="text-gray-500 font-medium text-[15px] mb-6">info@kliksy.si</p>
              <div className="flex gap-3">
                 <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                    <span className="text-gray-500 font-bold text-sm">IG</span>
                 </div>
                 <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors cursor-pointer">
                    <span className="text-gray-500 font-bold text-sm">FB</span>
                 </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 text-[13px] text-gray-400 font-medium gap-6">
            <div className="flex items-center gap-4 order-2 md:order-1">
               <span className="font-black text-gray-800 text-[16px] tracking-tight flex items-center gap-0.5"><span className="text-xl leading-none -mt-1"><svg viewBox="0 0 384 512" width="16" height="16" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg></span> Pay</span>
               <span className="font-extrabold text-gray-600 text-[16px] tracking-tight"><span className="text-[#4285F4]">G</span> <span className="text-[#EA4335]">P</span><span className="text-[#FBBC05]">a</span><span className="text-[#34A853]">y</span></span>
               <span className="font-black text-[#1A1F71] text-[16px] italic">VISA</span>
               <span className="flex items-center"><div className="w-4 h-4 rounded-full bg-[#EB001B] relative z-10 mix-blend-multiply"></div><div className="w-4 h-4 rounded-full bg-[#F79E1B] -ml-1.5 mix-blend-multiply"></div></span>
            </div>
            
            <p className="order-1 md:order-2">© {new Date().getFullYear()} Kliksy. Vse pravice pridržane.</p>
            
            <div className="flex gap-4 order-3 md:hidden">
                 <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">IG</div>
                 <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">FB</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
