import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Camera, QrCode, Download, Heart, ArrowRight, Check, Star, Smartphone, Images, Sparkles, User as UserIcon, Shield, Zap, Users, ChevronDown, LayoutGrid, Smile, Menu, X } from "lucide-react";
import { LANDING_IMAGES } from "../config/images";
import { useAuth } from "../components/AuthProvider";

const EVENT_TYPES = [
  { word: "svoje poroke" },
  { word: "svojega dogodka" },
  { word: "svojega praznovanja" }
];

const REVIEWS = [
  { 
    name: "Tina & Luka", date: "April 2026", 
    text: "Noro dobra ideja! Dobila sva toliko spontanih fotografij, ki jih drugače ne bi nikoli videla. Gosti so navdušeni nad kako enostavno je bilo.",
    initials: "TL", gender: "couple"
  },
  {
    name: "Marko", date: "Marec 2026",
    text: "Za moj 30. rojstni dan smo uporabili Kliksy. Noro, koliko zabavnih slik sem dobil naslednji dan. Prijatelji so takoj začeli nalagati slike!",
    initials: "M", gender: "male"
  },
  {
    name: "Ekipa podjetja", date: "December 2025",
    text: "Končno smo dokumentirali našo božično zabavo na enem mestu. Kot tehniki močno pohvalimo preprostost. Scan and shoot. Nobenega kreiranja računov.",
    initials: "IT", gender: "couple"
  },
  { 
    name: "Maja & David", date: "Avgust 2025", 
    text: "Vse slike zbrane na enem mestu, brez stresa in prošenj pošiljanja. Toplo priporočava vsakemu paru!",
    initials: "MD", gender: "couple"
  },
  {
    name: "Špela", date: "Junij 2025",
    text: "Odlična zadeva! QR kode sem dala na mize in zjutraj me je pričakala popolna galerija vseh trenutkov iz mojega praznovanja diplome, ki sem jih zamudila.",
    initials: "Š", gender: "female"
  },
  { 
    name: "Nina & Rok", date: "September 2025", 
    text: "Najboljši dodatek najini poroki! Vsak gost je dodal vsaj nekaj slik. Spomini, ki jih ne bi nikoli dobili drugače.",
    initials: "NR", gender: "couple"
  },
  {
    name: "Tomaž", date: "November 2025",
    text: "Letni teambuilding na enem mestu posnet s strani vseh sodelavcev. Končno nam ni treba prositi, da podelijo slike po različnih skupinah in platformah.",
    initials: "T", gender: "male"
  },
  {
    name: "Ana & Peter", date: "Avgust 2025",
    text: "Zelo priročno! Super je bilo opazovati dogodek skozi oči naših prijateljev. Toplo priporočam.",
    initials: "AP", gender: "couple"
  },
  {
    name: "Sara & Matej", date: "September 2025",
    text: "Enostavno za starejše goste! Moja babica je brez težav naložila svoje fotografije. Kakovost slik je takšna, kot mora biti.",
    initials: "SM", gender: "couple"
  },
  {
    name: "Tjaša & Miha", date: "April 2026",
    text: "Fotograf bo rabil en mesec za slike, mi pa smo imeli preko 500 norih in spontanih slik že isti večer!",
    initials: "TM", gender: "couple"
  }
];

const FAQS = [
  { q: "Ali gosti potrebujejo aplikacijo?", a: "Ne! Kliksy deluje popolnoma v brskalniku na telefonu. Gosti le skenirajo QR kodo s svojo kamero in takoj lahko dodajajo fotografije – brez prenosov in brez registracije." },
  { q: "Ali deluje tudi brez interneta?", a: "Za nalaganje fotografij potrebujejo gosti internetno povezavo (mobilne podatke ali Wi-Fi dogodka). Galerijo pa lahko pregledujete in uporabljate kadarkoli, ko ste na spletu." },
  { q: "Kako dolgo imam dostop do galerije?", a: "Odvisno od izbranega paketa. Pri Basic paketu je to 1 mesec, pri Plus 1 leto, pri Premium pa 2 leti. V tem času si lahko spomine kadarkoli prenesete." },
  { q: "Ali je galerija zasebna?", a: "Da, vaša galerija je 100% zasebna. Do nje lahko dostopajo le tisti, ki jim pošljete povezavo, in gosti, ki so skenirali QR kodo." },
  { q: "Kaj pa, če imam več dogodkov?", a: "Znotraj svoje nadzorne plošče (dashboarda) lahko dodajate nove dogodke in imate vse dogodke zbrane pod svojim profilom." }
];

export default function Landing() {
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
            <a href="#kako-deluje" className="hover:text-gray-900 transition-colors">Kako deluje</a>
            <a href="#prednosti-dodatne" className="hover:text-gray-900 transition-colors">Zakaj to potrebuješ</a>
            <a href="#paketi" className="hover:text-gray-900 transition-colors">Cenik</a>
            <a href="#mnenja" className="hover:text-gray-900 transition-colors">Mnenja</a>
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
              Ustvari dogodek
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
                <a href="#kako-deluje" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Kako deluje</a>
                <a href="#prednosti-dodatne" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Zakaj to potrebuješ</a>
                <a href="#paketi" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Cenik</a>
                <a href="#mnenja" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">Mnenja</a>
                <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-indigo-600">FAQ</a>
                {!user || user.isAnonymous ? (
                  <div className="pt-4 flex flex-col gap-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-purple-50 text-purple-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                       Prijava <UserIcon className="w-5 h-5"/>
                    </Link>
                    <Link to="/create" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-[#5B45FF] text-white py-3 rounded-xl font-bold text-lg">
                      Ustvari dogodek
                    </Link>
                  </div>
                ) : (
                  <div className="pt-4">
                    <Link to="/create" onClick={() => setIsMobileMenuOpen(false)} className="w-full inline-block bg-[#5B45FF] text-white py-3 rounded-xl font-bold text-lg">
                      Ustvari nov dogodek
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
            <div className="flex flex-col sm:flex-row items-center sm:inline-flex justify-center sm:justify-start gap-2 mb-3 mx-auto md:mx-0">
              <div className="bg-[#F3F1FF] text-[#5B45FF] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase inline-block">
                -30% S KODO POMLAD30
              </div>
              <span className="text-gray-600 font-medium text-[13px]">Samo za kratek čas!</span>
            </div>
            
            <h1 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[4.5rem] font-extrabold tracking-tight text-gray-900 mb-4 leading-[1.05] break-words min-h-[160px] md:min-h-0 flex flex-col justify-start md:block">
              <span className="block">Ne izgubi slik</span>
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
              S Kliksy zberite vse fotografije in videe gostov na enem mestu, z eno samo QR kodo.
            </p>

            {/* Feature Badges Grid */}
            <div className="flex flex-col sm:grid sm:grid-cols-4 gap-4 sm:gap-4 lg:gap-6 mb-12 items-center md:items-start">
              <div className="flex flex-row items-center sm:flex-col justify-start gap-4 sm:gap-3 text-left sm:text-center w-[220px] sm:w-auto">
                <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-2xl sm:rounded-full bg-white sm:bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center shadow-sm text-[#5B45FF]">
                  <Smile className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>
                <span className="text-[15px] sm:text-[13px] font-semibold text-gray-700 leading-tight">Enostavno<span className="hidden sm:inline"><br /></span> za goste</span>
              </div>
              <div className="flex flex-row items-center sm:flex-col justify-start gap-4 sm:gap-3 text-left sm:text-center w-[220px] sm:w-auto">
                <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-2xl sm:rounded-full bg-white sm:bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center shadow-sm text-[#5B45FF]">
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>
                <span className="text-[15px] sm:text-[13px] font-semibold text-gray-700 leading-tight">Vse na enem<span className="hidden sm:inline"><br /></span> mestu</span>
              </div>
              <div className="flex flex-row items-center sm:flex-col justify-start gap-4 sm:gap-3 text-left sm:text-center w-[220px] sm:w-auto">
                <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-2xl sm:rounded-full bg-white sm:bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center shadow-sm text-[#5B45FF]">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>
                <span className="text-[15px] sm:text-[13px] font-semibold text-gray-700 leading-tight">Brez aplikacij<span className="hidden sm:inline"><br /></span> in prijav</span>
              </div>
              <div className="flex flex-row items-center sm:flex-col justify-start gap-4 sm:gap-3 text-left sm:text-center w-[220px] sm:w-auto">
                <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-2xl sm:rounded-full bg-white sm:bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center shadow-sm text-[#5B45FF]">
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                </div>
                <span className="text-[15px] sm:text-[13px] font-semibold text-gray-700 leading-tight">Prenos vseh<span className="hidden sm:inline"><br /></span> v 1 klik</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <Link to="/create" className="inline-flex items-center justify-center gap-3 bg-[#5B45FF] text-white px-8 py-4 rounded-full text-[17px] font-bold hover:bg-[#4E3BE0] transition-all shadow-xl shadow-[#5B45FF]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-95 text-center w-[90%] mx-auto md:mx-0 sm:w-auto">
                Ustvari svojo galerijo zdaj <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center justify-center md:justify-start gap-2 text-[13px] md:text-[14px] font-semibold text-green-600">
                <Check className="w-4 h-4 text-white stroke-[3] bg-green-500 rounded-full p-0.5 shrink-0" />
                <span>Varno. Zasebno. Samo za vaju in vajine goste.</span>
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
                    <p className="text-[14px] font-extrabold flex items-center gap-1.5 text-gray-900">Veselje na poroki <Heart className="w-4 h-4 text-red-500 fill-red-500"/></p>
                    <p className="text-[13px] text-gray-500"><strong className="text-gray-900">+183</strong> novih fotografij</p>
                  </div>
                </div>

                {/* Floating QR */}
                <div className="absolute -bottom-8 -left-4 sm:-left-8 lg:-left-4 z-20 bg-white p-4 rounded-[28px] shadow-xl flex items-center gap-4 border border-gray-100">
                  <div className="bg-gray-100/80 rounded-2xl p-2.5">
                    <QrCode className="w-12 h-12 text-gray-900" />
                  </div>
                  <div className="pr-2">
                    <p className="text-[15px] font-bold leading-tight text-gray-900">Poskeniraj<br/>QR kodo</p>
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
              <p className="text-[14px] sm:text-[15px] font-semibold text-gray-600 leading-tight">ljudi je že izbralo Kliksy</p>
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
               <p className="text-[14px] sm:text-[15px] font-semibold text-gray-600 mb-1 leading-none pt-1">na podlagi prvih ocen</p>
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
               <p className="text-[14px] sm:text-[15px] font-semibold text-gray-600 leading-tight">zbranih fotografij in videov</p>
             </div>
          </div>
        </div>
      </section>

      {/* Zakaj to potrebuješ? */}
      <section className="pb-16 pt-8 bg-[#FDFCFB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-center mb-16 text-gray-900 tracking-tight">Zakaj to potrebuješ?</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-5 p-0 sm:p-6 mb-6 md:mb-0">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 mb-0 md:mb-6 flex items-center justify-center rounded-[16px] md:rounded-[20px] bg-white border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#F3F1FF] opacity-50"></div>
                 <LayoutGrid className="w-6 h-6 md:w-8 md:h-8 text-[#5B45FF] stroke-[1.5] relative z-10" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900 leading-tight">Fotograf ne more biti povsod</h3>
                 <p className="text-gray-500 font-medium text-[15px] md:text-[16px] leading-relaxed">Gosti ujamejo spontane trenutke, ki jih profesionalni fotograf pogosto zamudi.</p>
               </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-5 p-0 sm:p-6 mb-6 md:mb-0">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 mb-0 md:mb-6 flex items-center justify-center rounded-[16px] md:rounded-[20px] bg-white border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#F3F1FF] opacity-50"></div>
                 <Shield className="w-6 h-6 md:w-8 md:h-8 text-[#5B45FF] stroke-[1.5] relative z-10" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900 leading-tight">Slike se drugače izgubijo</h3>
                 <p className="text-gray-500 font-medium text-[15px] md:text-[16px] leading-relaxed">Fotografije ostanejo na telefonih, v klepetih in jih nikoli ne prejmete.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start gap-4 sm:gap-5 p-0 sm:p-6 mb-2 md:mb-0">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 mb-0 md:mb-6 flex items-center justify-center rounded-[16px] md:rounded-[20px] bg-white border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                 <div className="absolute inset-0 bg-[#F3F1FF] opacity-50"></div>
                 <Camera className="w-6 h-6 md:w-8 md:h-8 text-[#5B45FF] stroke-[1.5] relative z-10" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900 leading-tight">Spomini iz vseh zornih kotov</h3>
                 <p className="text-gray-500 font-medium text-[15px] md:text-[16px] leading-relaxed">Dobite celotno zgodbo vašega dne, skozi oči vaših gostov.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-[#FDFCFB]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <Link to="/create" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#5B45FF] text-white px-8 py-4 rounded-full text-[17px] font-bold hover:bg-[#4E3BE0] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#5B45FF]/30">
            Začnite zbirati spomine <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Kako deluje? */}
      <section id="kako-deluje" className="py-24 bg-[#FDFCFB] relative text-center">
        <h2 className="text-[36px] md:text-[44px] font-extrabold mb-20 text-gray-900 tracking-tight">Kako deluje?</h2>
        
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 md:gap-8 relative">
            <div className="hidden lg:block absolute top-[28px] left-[16%] right-[16%] h-px z-0 bg-indigo-100" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-14 h-14 bg-[#5B45FF] text-white rounded-full flex items-center justify-center text-xl font-extrabold shadow-lg shadow-[#5B45FF]/30 mb-8 border-[5px] border-white ring-1 ring-gray-100 relative z-10">
                 1
               </div>
               <h3 className="text-[20px] font-extrabold mb-3 text-gray-900">Natisnite QR kodo</h3>
               <p className="text-gray-500 font-medium px-4 mb-10 leading-relaxed text-[16px] md:min-h-[80px]">
                 QR kodo natisnete in postavite na mize, pri vhodu ali kamorkoli na dogodku.
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
               <h3 className="text-[20px] font-extrabold mb-3 text-gray-900">Gosti slikajo in delijo</h3>
               <p className="text-gray-500 font-medium px-4 mb-10 leading-relaxed text-[16px] md:min-h-[80px]">
                 Gosti skenirajo QR kodo in takoj začnejo dodajati svoje fotografije in videe - brez prijav.
               </p>
               <div className="mt-auto w-full max-w-[280px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] mx-auto border-[10px] border-gray-900 relative">
                 {LANDING_IMAGES.guestTakingPhoto ? (
                   <img src={LANDING_IMAGES.guestTakingPhoto} alt="Guest taking photo" className="w-full h-[360px] object-cover" />
                 ) : (
                   <div className="w-full h-[360px] p-6 pt-12 flex flex-col bg-white">
                    <p className="text-center font-bold text-lg mb-8">Dodaj svojo fotografijo</p>
                    <div className="bg-gray-900 text-white p-4 rounded-full text-center font-bold mb-4 shadow-xl">Izberi iz galerije</div>
                    <div className="text-center text-sm font-bold text-gray-400 mb-4">ali</div>
                    <div className="bg-gray-100 text-gray-600 p-4 rounded-full text-center font-bold">Posnemi s kamero</div>
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
               <h3 className="text-[20px] font-extrabold mb-3 text-gray-900">Vse na enem mestu</h3>
               <p className="text-gray-500 font-medium px-4 mb-10 leading-relaxed text-[16px] md:min-h-[80px]">
                 Vse fotografije in videi se zbirajo v vaši zasebni galeriji, ki jo po dogodku preneseš v 1 klik.
               </p>
               <div className="mt-auto w-full max-w-[280px] bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-5 flex flex-col mx-auto h-[360px]">
                 <div className="flex justify-between items-center mb-5">
                   <div className="text-left">
                     <p className="text-[14px] font-extrabold text-gray-900">Vsa zbirka</p>
                     <p className="text-[#5B45FF] font-bold text-[11px] mt-1 pt-1 opacity-80">182 fotografij • 24 videov</p>
                   </div>
                   <div className="px-3 py-1.5 border-2 border-indigo-50 rounded-full">
                     <p className="text-[#5B45FF] font-bold text-[11px]">Prenesi vse</p>
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
            Ustvari svoj dogodek zdaj <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Zakaj izbrati Kliksy? */}
      <section id="prednosti-dodatne" className="py-24 bg-[#FDFCFB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-[32px] md:text-[44px] font-extrabold mb-12 md:mb-20 text-gray-900 tracking-tight text-center">Zakaj izbrati Kliksy?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-y-16 gap-x-12">
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <LayoutGrid className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Boljše kot Photo Booth</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Brez omejitev, brez rekvizitov in čakanja v vrsti. Gosti fotografirajo vse, kar želijo.</p>
               </div>
            </div>
            
            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Smartphone className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Vse slike na enem mestu</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Ni več iskanja po telefonih in klepetih. Vse je urejeno na enem mestu.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Zap className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Takojšen dostop</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Med dogodkom že vidite nove vsebine. Popolno za deljenje z gosti.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Shield className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">100% zasebnost</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Galerija je samo za vas in vaše izbrane goste. Brez javnih povezav.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Camera className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Polna kvaliteta</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Fotografije in videi so shranjeni v originalni kvaliteti. Brez stiskanja in izgube kakovosti.</p>
               </div>
            </div>

            <div className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center">
               <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center mr-4 md:mr-0 mb-0 md:mb-6 rounded-[16px] border-2 border-indigo-100 bg-[#F3F1FF] text-[#5B45FF]">
                 <Smile className="w-6 h-6 md:w-8 md:h-8 stroke-[1.5]" />
               </div>
               <div>
                 <h3 className="font-extrabold text-[18px] md:text-[20px] mb-1.5 md:mb-3 text-gray-900">Zabavno za vse</h3>
                 <p className="text-gray-500 font-medium leading-relaxed text-[15px] md:text-[16px]">Enostavno za vse generacije – od otrok do babic in dedkov.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mnenja */}
      <section id="mnenja" className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-blue-50/20"></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <h2 className="text-[32px] md:text-[44px] font-extrabold mb-12 md:mb-16 text-center text-gray-900 tracking-tight">Mnenja naših kupcev</h2>
          
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
                Naloži več mnenj
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
            <h2 className="text-[36px] md:text-[44px] font-extrabold mb-4 text-gray-900 tracking-tight">Preprosti paketi</h2>
            <p className="text-[15px] md:text-[16px] text-gray-500 font-medium mb-6">Izberite paket, ki najbolj ustreza vašemu dogodku.</p>
            
            <div className="lg:hidden inline-block bg-purple-100 text-[#5B45FF] font-bold px-4 py-1.5 rounded-full text-[12px] uppercase shadow-sm">
              -30% s kodo POMLAD30
            </div>
            
            {/* Arrow annotation for sale */}
            <div className="hidden lg:flex absolute right-4 top-0 translate-y-8 flex-col items-center text-[#5B45FF] w-48">
               <span className="font-bold tracking-tight text-[13px] mb-2 uppercase text-center">-30% s kodo<br/>POMLAD30</span>
               <svg viewBox="0 0 100 100" className="w-12 h-12 opacity-80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M 20 20 Q 80 20 80 80" />
                 <path d="M 60 80 L 80 80 L 80 60" />
               </svg>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
            {/* Basic */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden">
              <h3 className="text-[18px] font-extrabold mb-1 text-gray-900 tracking-tight">BASIC</h3>
              <p className="text-gray-500 text-[13px] mb-8 font-medium">Za manjše dogodke</p>
              <div className="flex items-baseline gap-3 mb-8">
                <div className="text-[48px] font-extrabold text-gray-900 tracking-tight leading-none">39<span className="text-[32px]">€</span></div>
                <div className="text-[20px] text-gray-400 font-bold line-through">55€</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Unikatna QR koda', 
                  'Do 50 gostov', 
                  'Do 200 fotografij', 
                  'Dostop do galerije 1 mesec',
                  'Prenos vseh slik (ZIP)'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700 font-medium">
                    <Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=basic" className="block w-full py-4 text-center rounded-full border border-gray-200 font-bold text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors text-[15px]">
                Izberi Basic
              </Link>
            </div>
            
            {/* Plus */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgb(91,69,255,0.12)] border-2 border-[#5B45FF] flex flex-col z-10 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[2px] bg-[#5B45FF] text-white text-[11px] font-extrabold px-6 py-1.5 rounded-b-xl uppercase shadow-sm whitespace-nowrap">
                NAJBOLJ PRILJUBLJENO
              </div>
              <h3 className="text-[18px] font-extrabold mb-1 text-gray-900 tracking-tight pt-2">PLUS</h3>
              <p className="text-gray-500 text-[13px] mb-8 font-medium">Za večje dogodke in poroke</p>
              <div className="flex items-baseline gap-3 mb-8">
                <div className="text-[48px] font-extrabold text-[#5B45FF] tracking-tight leading-none">49<span className="text-[32px]">€</span></div>
                <div className="text-[20px] text-gray-400 font-bold line-through">69€</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Unikatna QR koda', 
                  'Neomejeno število gostov', 
                  'Neomejeno fotografij', 
                  'Dostop do galerije 1 leto', 
                  'Prenos vseh slik (ZIP)', 
                  'Live galerija (projekcija)',
                  'Personalizirana stran z imeni'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700 font-medium">
                    <Check className="w-4 h-4 text-[#5B45FF] shrink-0 mt-0.5" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=plus" className="block w-full py-4 text-center rounded-full bg-[#5B45FF] text-white font-bold hover:bg-[#4E3BE0] transition-colors shadow-lg shadow-[#5B45FF]/20 mt-auto text-[15px]">
                Izberi Plus
              </Link>
            </div>
            
            {/* Premium */}
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
              <h3 className="text-[18px] font-extrabold mb-1 text-gray-900 tracking-tight">PREMIUM</h3>
              <p className="text-gray-500 text-[13px] mb-8 font-medium">Za tiste, ki želite vse</p>
              <div className="flex items-baseline gap-3 mb-8">
                <div className="text-[48px] font-extrabold text-gray-900 tracking-tight leading-none">79<span className="text-[32px]">€</span></div>
                <div className="text-[20px] text-gray-400 font-bold line-through">109€</div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Unikatna QR koda', 
                  'Neomejeno število gostov', 
                  'Neomejeno fotografij', 
                  'Do 100 videoposnetkov',
                  'Dostop do galerije 2 leti', 
                  'Prenos vseh slik (ZIP)', 
                  'Live galerija (projekcija)',
                  'Personalizirana stran z imeni',
                  'Premium design predloge',
                  'Prioritetna podpora'
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-gray-700 font-medium">
                    <Check className="w-4 h-4 text-gray-900 shrink-0 mt-0.5" /> 
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/create?plan=premium" className="block w-full py-4 text-center rounded-full border border-gray-200 font-bold text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-colors mt-auto text-[15px]">
                Izberi Premium
              </Link>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-[14px] text-gray-500 font-medium">
             <Shield className="w-5 h-5 text-gray-400" /> 30-dnevna garancija vračila denarja – brez vprašanj.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white relative">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-[36px] md:text-[44px] font-extrabold mb-16 text-center text-gray-900 tracking-tight">Pogosta vprašanja</h2>
          
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
            <h2 className="text-[32px] sm:text-[36px] md:text-[44px] font-extrabold mb-4 sm:mb-6 text-white tracking-tight leading-[1.1] relative z-10">Ste pripravljeni na<br/>zbiranje spominov?</h2>
            <p className="text-[15px] sm:text-[17px] text-gray-400 mb-8 sm:mb-10 max-w-lg mx-auto font-medium leading-relaxed relative z-10">
              Ustvari svojo galerijo in ne izgubi niti ene fotografije s svojega posebnega dne.
            </p>
            <Link to="/create" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-[#5B45FF] text-white px-8 py-4 rounded-full text-[15px] sm:text-[17px] font-bold hover:bg-[#4E3BE0] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#5B45FF]/30 relative z-10 mb-12">
              Ustvari svojo galerijo zdaj <ArrowRight className="w-5 h-5" />
            </Link>
          
          <div className="relative w-full flex justify-center gap-3 sm:gap-6 px-4 pb-0 -mb-8 sm:-mb-12 mt-4 z-0">
             <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=300" className="w-[100px] sm:w-[180px] h-[120px] sm:h-[200px] object-cover rounded-xl shadow-2xl transform rotate-[-4deg] translate-y-4" alt="Spomini iz zabave" />
             <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=300" className="w-[120px] sm:w-[220px] h-[140px] sm:h-[240px] object-cover rounded-xl shadow-2xl z-10" alt="Vrhunski spomini" />
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
                Zbiranje spominov še nikoli ni bilo tako enostavno.
              </p>
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="font-extrabold text-gray-900 mb-6 text-[15px]">Povezave</h4>
              <ul className="space-y-4 text-gray-500 font-medium text-[15px]">
                <li><a href="#kako-deluje" className="hover:text-gray-900 transition-colors">Kako deluje</a></li>
                <li><a href="#paketi" className="hover:text-gray-900 transition-colors">Paketi</a></li>
                <li><a href="#mnenja" className="hover:text-gray-900 transition-colors">Mnenja</a></li>
                <li><a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div className="md:col-span-2 lg:col-span-2">
              <h4 className="font-extrabold text-gray-900 mb-6 text-[15px]">Pravno</h4>
              <ul className="space-y-4 text-gray-500 font-medium text-[15px]">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Pogoji uporabe</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Zasebnost</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Piškotki</a></li>
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
