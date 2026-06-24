import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CreditCard, Calendar, Users, LogIn, Mail, Loader2, ChevronDown, ChevronUp, Maximize2, ShieldCheck, Lock, Star, ChevronLeft, ChevronRight, Shield } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { db, handleFirestoreError, OperationType, signUpWithEmail, signInWithEmail } from "../firebase";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import ImageViewer from '../components/ImageViewer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { DESIGNS } from '../components/QRDesigns';
import { QRCodeSVG } from 'qrcode.react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const TESTIMONIALS = [
  { 
    text: "Najboljša odločitev za poroko! Dobili smo toliko spontanih trenutkov, ki jih fotograf sploh ni ujel.", 
    names: "Ana & Luka", 
    subtitle: "Poročena 2026"
  },
  { 
    text: "Gosti so bili navdušeni, mi pa smo imeli vse slike zbrane na enem mestu! Priporočava vsem.", 
    names: "Maja & Tadej", 
    subtitle: "Poročena 2026"
  },
  { 
    text: "Enostavno za uporabo in popolna preglednost. Najlepši spomini ostanejo vedno z vami.", 
    names: "Nika & Jure", 
    subtitle: "Poročena 2026"
  }
];

type Plan = 'basic' | 'plus' | 'premium';

export default function CreateEvent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPlan = (searchParams.get('plan') as Plan) || 'plus';
  const existingEventId = searchParams.get('eventId');
  
  const { user, signIn, signOut } = useAuth();
  const [step, setStep] = useState<number | 'animation'>(1);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [formData, setFormData] = useState({
    eventType: '',
    eventName: '',
    partner1: '',
    partner2: '',
    date: '',
    plan: initialPlan,
    isCompanyInvoice: false,
    companyName: '',
    companyAddress: '',
    companyTaxId: '',
    deliveryName: '',
    deliverySurname: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPostcode: ''
  });
  const [expandedPlan, setExpandedPlan] = useState<Plan | null>(initialPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAcceptedFree, setTermsAcceptedFree] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  
  // Auth states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('register');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Upsell states
  const [standsQuantity, setStandsQuantity] = useState<0 | 5 | 10 | 20 | 30>(0);
  const [selectedStand, setSelectedStand] = useState<number>(0);
  const [viewingImage, setViewingImage] = useState<number | null>(null);

  const standImages = [
    "https://i.postimg.cc/BQH9hJr5/hf-20260402-042506-9c8ed65f-ea7f-49b0-a82b-514d73de11e0.png",
    "https://i.postimg.cc/Qx1G6j2S/hf-20260402-042524-4ac5d4b1-0070-45c3-b3c4-75f0f1a9fb14.png",
    "https://i.postimg.cc/HsXDSTqz/hf-20260402-042605-6a668101-3fa9-4d41-849a-41503b830156.png"
  ];

  // Discount states
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [activeDiscount, setActiveDiscount] = useState<any>(null);
  const [stripeError, setStripeError] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [stripePaymentIntentId, setStripePaymentIntentId] = useState('');
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  const plans = {
    basic: { 
      name: 'Basic', 
      price: 39,
      features: ['Unikatna QR koda', 'Do 50 gostov', 'Do 200 fotografij', 'Dostop do galerije 1 mesec', 'Prenos vseh slik (ZIP)']
    },
    plus: { 
      name: 'Plus', 
      price: 49,
      features: ['Unikatna QR koda', 'Neomejeno število gostov', 'Neomejeno fotografij', 'Dostop do galerije 1 leto po zaključku dogodka', 'Prenos vseh slik (ZIP)', 'Live galerija (projekcija)', 'Personalizirana stran z imeni', 'Kupi zdaj, uporabi kadarkoli potrebuješ (brez časovne omejitve)']
    },
    premium: { 
      name: 'Premium', 
      price: 79,
      features: ['Unikatna QR koda', 'Neomejeno število gostov', 'Neomejeno fotografij', 'Do 100 videoposnetkov', 'Dostop do galerije 2 leti po zaključku dogodka', 'Prenos vseh slik (ZIP)', 'Live galerija (projekcija)', 'Personalizirana stran z imeni', 'Premium design predloge', 'Prioritetna podpora', 'Kupi zdaj, uporabi kadarkoli potrebuješ (brez časovne omejitve)']
    }
  };

  const [demoEventId, setDemoEventId] = useState<string | null>(null);

  useEffect(() => {
    if (existingEventId && user && step !== 4) {
      const loadEvent = async () => {
        try {
          const docRef = doc(db, 'events', existingEventId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().ownerId === user.uid) {
            const data = docSnap.data();
            setFormData(prev => ({
              ...prev,
              eventType: data.eventType || '',
              eventName: data.eventName || '',
              partner1: data.partner1 || '',
              partner2: data.partner2 || '',
              date: data.date || '',
              plan: data.plan || initialPlan,
              isCompanyInvoice: data.isCompanyInvoice || false,
            }));
            setStep(4);
          }
        } catch (error) {
          console.error("Error loading event:", error);
        }
      };
      loadEvent();
    }
  }, [existingEventId, user, step]);

  const handleCreateDemoEvent = async () => {
    if (!user || user.isAnonymous) return;
    setIsProcessing(true);
    setAuthError('');
    try {
      const docRef = await addDoc(collection(db, "events"), {
        eventType: formData.eventType,
        eventName: formData.eventName,
        partner1: formData.partner1,
        partner2: formData.partner2,
        date: formData.date,
        email: user.email || '',
        plan: formData.plan || 'basic',
        deliveryMode: 'self_print',
        standsQuantity: 0,
        printedQrQuantity: 0,
        selectedStand: null,
        isCompanyInvoice: false,
        companyName: null,
        companyAddress: null,
        companyTaxId: null,
        deliveryName: null,
        deliverySurname: null,
        deliveryAddress: null,
        deliveryCity: null,
        deliveryPostcode: null,
        selectedDesignId: null,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        paymentStatus: 'pending',
        amountPaid: 0,
        isDemo: true
      });
      setDemoEventId(docRef.id);
      setStep('animation');
      
      // Send event created email
      try {
        fetch('/api/send-event-created-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            eventName: formData.eventName || (formData.partner1 ? `${formData.partner1} & ${formData.partner2}` : 'Vaš dogodek')
          })
        }).catch(err => console.error("Failed to trigger event created email:", err));
      } catch (e) {
        console.error("Error triggering event created email:", e);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError('Napaka pri ustvarjanju dogodka: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart');
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout');
      }
      if (user && !user.isAnonymous) {
        handleCreateDemoEvent();
      } else {
        setStep(3);
      }
      return;
    }

    if (step === 3) {
      if (user && !user.isAnonymous) {
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'InitiateCheckout');
        }
        handleCreateDemoEvent();
      }
      return;
    }
  };

  const handleBack = () => {
    if (existingEventId && step === 4) {
      navigate(`/dashboard?eventId=${existingEventId}`);
      return;
    }
    if (step === 4 && (!user || user.isAnonymous)) {
      setStep(3);
    } else if (step === 4 && user && !user.isAnonymous) {
      setStep(2);
    } else if (typeof step === 'number' && step > 1) {
      setStep(step - 1);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      if (authMode === 'forgot_password') {
        const { resetPassword } = await import('../firebase');
        await resetPassword(authEmail);
        setAuthSuccess("Povezava za ponastavitev gesla je bila poslana na vaš elektronski naslov.");
        setAuthMode('login');
      } else if (authMode === 'register') {
        await signUpWithEmail(authEmail, authPassword, 'sl');
        setIsVerificationModalOpen(true);
        setAuthMode('login');
      } else {
        await signInWithEmail(authEmail, authPassword);
      }
    } catch (error: any) {
      if (authMode === 'forgot_password') {
        setAuthError("Napaka pri pošiljanju povezave. Preverite elektronski naslov.");
      } else {
        if (error.code === 'auth/email-not-verified') {
          setAuthError('Prosimo, preverite svoj e-poštni predal in potrdite svoj račun pred prijavo.');
        } else {
          setAuthError(authMode === 'register' ? 'Napaka pri registraciji. Morda račun že obstaja ali je geslo prekratko (vsaj 6 znakov).' : 'Neveljaven e-poštni naslov ali geslo.');
        }
      }
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountError('');
    setIsUpdatingPrice(true);
    
    const codeNormalized = discountCode.trim().toLowerCase();
    
    // Simulate slight network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (codeNormalized === 'test99') {
      setDiscountApplied(true);
      setActiveDiscount({ code: 'TEST99', value: 100, discountType: 'percentage', appliesTo: 'packages_only' });
      setDiscountError('');
    } else {
      setDiscountError('Neveljavna koda.');
      setDiscountApplied(false);
      setActiveDiscount(null);
    }
    
    setIsUpdatingPrice(false);
  };

  const originalPrice = plans[formData.plan].price;
  
  let upsellPrice = 0;
  // Always use self_print logic since home_delivery is removed
  if (standsQuantity === 5) upsellPrice += 19.99;
  else if (standsQuantity === 10) upsellPrice += 24.99;
  else if (standsQuantity === 20) upsellPrice += 29.99;
  else if (standsQuantity === 30) upsellPrice += 34.99;

  let finalPrice = originalPrice + upsellPrice;
  if (discountApplied && activeDiscount) {
    const value = activeDiscount.value || 0;
    const type = activeDiscount.discountType || 'percentage';
    const appliesTo = activeDiscount.appliesTo || 'all';

    if (appliesTo === 'packages_only') {
      const discountAmount = type === 'percentage' ? (originalPrice * value / 100) : value;
      finalPrice = Math.max(0, originalPrice - discountAmount) + upsellPrice;
    } else {
      const discountAmount = type === 'percentage' ? (finalPrice * value / 100) : value;
      finalPrice = Math.max(0, finalPrice - discountAmount);
    }
  } else if (discountApplied) {
    // Legacy support for hardcoded codes if needed, but we'll prefer the Firestore ones
    if (discountCode.toLowerCase() === 'test99') {
      finalPrice = upsellPrice;
    }
  }

  useEffect(() => {
    if (step >= 3 && finalPrice > 0) {
      let isSubscribed = true;
      setIsUpdatingPrice(true);
      
      const fetchClientSecret = async () => {
        try {
          setStripeError('');
          const res = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              plan: formData.plan, 
              discountCode: discountApplied ? discountCode : '',
              deliveryMode: 'self_print',
              standsQuantity,
              printedQrQuantity: 0
            })
          });
          
          if (!isSubscribed) return;

          const contentType = res.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await res.json();
            if (data.clientSecret) {
              setClientSecret(data.clientSecret);
              if (data.clientSecret.includes('_secret_')) {
                setStripePaymentIntentId(data.clientSecret.split('_secret_')[0]);
              }
            } else if (data.error) {
              setStripeError(data.error);
            }
          } else {
            const text = await res.text();
            console.error("Server returned non-JSON response:", text.substring(0, 200));
            setStripeError(`Napaka strežnika: API zahtevki ne pridejo do Node.js zaledja. Hostinger (Apache/Nginx) verjetno prestreza zahtevek in vrača HTML. Preverite .htaccess ali nastavitve usmerjanja na Hostingerju.`);
          }
        } catch (err: any) {
          if (!isSubscribed) return;
          console.error(err);
          setStripeError(err.message || 'Napaka pri povezavi s strežnikom.');
        } finally {
          if (isSubscribed) {
            setIsUpdatingPrice(false);
          }
        }
      };
      
      // Debounce the fetch slightly to avoid multiple calls when user is clicking around
      const timeoutId = setTimeout(() => {
        fetchClientSecret();
      }, 500);
      
      return () => {
        clearTimeout(timeoutId);
        isSubscribed = false;
      };
    }
  }, [step, finalPrice, formData.plan, discountApplied, discountCode, standsQuantity]);

  const handleCheckoutFree = async () => {
    if (!user || user.isAnonymous) {
      setAuthError("Prosimo, prijavite se za nadaljevanje.");
      return;
    }
    
    if (
      standsQuantity > 0 &&
      (!formData.deliveryName || !formData.deliverySurname || !formData.deliveryAddress || !formData.deliveryPostcode || !formData.deliveryCity)
    ) {
      setStripeError('Za dostavo podstavkov morate izpolniti vse podatke o prejemniku in naslovu za dostavo!');
      return;
    }
    
    setIsProcessing(true);
    setStripeError('');
    
    const requiresDelivery = standsQuantity > 0;
    
    try {
      let docId = existingEventId;
      const eventData = {
        eventType: formData.eventType,
        eventName: formData.eventName,
        partner1: formData.partner1,
        partner2: formData.partner2,
        date: formData.date,
        email: user.email || '',
        plan: formData.plan,
        deliveryMode: 'self_print',
        standsQuantity,
        printedQrQuantity: 0,
        selectedStand: standsQuantity > 0 ? standImages[selectedStand] : null,
        isCompanyInvoice: formData.isCompanyInvoice,
        companyName: formData.isCompanyInvoice ? formData.companyName : null,
        companyAddress: formData.isCompanyInvoice ? formData.companyAddress : null,
        companyTaxId: formData.isCompanyInvoice ? formData.companyTaxId : null,
        deliveryName: requiresDelivery ? formData.deliveryName : null,
        deliverySurname: requiresDelivery ? formData.deliverySurname : null,
        deliveryAddress: requiresDelivery ? formData.deliveryAddress : null,
        deliveryCity: requiresDelivery ? formData.deliveryCity : null,
        deliveryPostcode: requiresDelivery ? formData.deliveryPostcode : null,
        selectedDesignId: null,
        ownerId: user.uid,
        paymentStatus: 'pending',
        amountPaid: finalPrice,
        discountCode: discountApplied ? discountCode : null,
        isDemo: false
      };

      if (docId) {
        await updateDoc(doc(db, "events", docId), eventData);
      } else {
        const docRef = await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: serverTimestamp()
        });
        docId = docRef.id;
      }

      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate(`/dashboard?eventId=${docId}&success=true`);
      }, 3000);
    } catch (error: any) {
      setStripeError(error.message || 'Prišlo je do napake.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 border-b border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                } else {
                  navigate(-1);
                }
              }}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Link to="/" className="font-bold text-2xl tracking-tight text-gray-900">
              Kliksy<span className="text-indigo-600">.</span>
            </Link>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Korak {step} od 4
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Vrsta dogodka</h2>
                  <p className="text-gray-600">Izberite vrsto vašega dogodka.</p>
                </div>

                <div className="space-y-4">
                  {['poroka', 'poslovni_dogodek', 'rojstni_dan', 'baby_shower', 'teambuilding', 'drugo'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, eventType: type })}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.eventType === type ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-bold text-lg">
                        {type === 'poroka' ? 'Poroka' : type === 'poslovni_dogodek' ? 'Poslovni dogodek' : type === 'rojstni_dan' ? 'Rojstni dan' : type === 'baby_shower' ? 'Baby shower' : type === 'teambuilding' ? 'Teambuilding' : 'Drugo'}
                      </span>
                    </button>
                  ))}

                  <button 
                    onClick={handleNext}
                    disabled={!formData.eventType}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                  >
                    Nadaljuj <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <button onClick={handleBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Nazaj
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">
                    {formData.eventType === 'poroka' ? 'Vaš veliki dan' : 'Podrobnosti dogodka'}
                  </h2>
                  <p className="text-gray-600">
                    {formData.eventType === 'poroka' ? 'Vnesite osnovne podatke o vajini poroki.' : 'Vnesite osnovne podatke o dogodku.'}
                  </p>
                </div>

                <div className="space-y-6">
                  {formData.eventType === 'poroka' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ime (Partner 1)</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input 
                            type="text" 
                            value={formData.partner1}
                            onChange={e => setFormData({...formData, partner1: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                            placeholder="Ana"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Ime (Partner 2)</label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input 
                            type="text" 
                            value={formData.partner2}
                            onChange={e => setFormData({...formData, partner2: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                            placeholder="Luka"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-2">Ime dogodka</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text" 
                          value={formData.eventName}
                          onChange={e => setFormData({...formData, eventName: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                          placeholder="Ime vašega dogodka"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Datum dogodka</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleNext}
                    disabled={
                      (formData.eventType === 'poroka' && (!formData.partner1 || !formData.partner2 || !formData.date)) ||
                      (formData.eventType !== 'poroka' && (!formData.eventName || !formData.date))
                    }
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                  >
                    Nadaljuj <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <button onClick={handleBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Nazaj
                </button>

                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold mb-2">Ustvarite račun</h2>
                  <p className="text-gray-600">Za upravljanje vašega dogodka potrebujemo vaš račun.</p>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-2xl">
                  {user && !user.isAnonymous ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Uspešno prijavljeni</h3>
                      <p className="text-gray-600 mb-6">Prijavljeni ste kot <span className="font-medium text-gray-900">{user.email || 'uporabnik'}</span>.</p>
                      
                      <button 
                        onClick={handleNext}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors mb-3"
                      >
                        Ustvari moj dogodek
                      </button>
                      <button 
                        onClick={() => signOut()}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        Odjava
                      </button>
                    </div>
                  ) : (
                    <>
                      {authMode !== 'forgot_password' && (
                        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                          <button 
                            onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${authMode === 'register' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                          >
                            Registracija
                          </button>
                          <button 
                            onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${authMode === 'login' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                          >
                            Prijava
                          </button>
                        </div>
                      )}

                      {authError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                          {authError}
                        </div>
                      )}

                      {authSuccess && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-xl">
                          {authSuccess}
                        </div>
                      )}

                      <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                        <div>
                          <input 
                            type="email" 
                            placeholder="Email naslov"
                            value={authEmail}
                            onChange={e => setAuthEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                            required
                          />
                        </div>
                        
                        {authMode !== 'forgot_password' && (
                          <div>
                            <input 
                              type="password" 
                              placeholder="Geslo"
                              value={authPassword}
                              onChange={e => setAuthPassword(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                              required
                            />
                          </div>
                        )}
                        
                        {authMode === 'login' && (
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => { setAuthMode('forgot_password'); setAuthError(''); setAuthSuccess(''); }}
                              className="text-sm text-gray-500 hover:text-gray-900 transition-colors -mt-2"
                            >
                              Pozabil sem geslo
                            </button>
                          </div>
                        )}

                        <button 
                          type="submit"
                          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                          {authMode === 'register' ? 'Ustvari račun' : authMode === 'forgot_password' ? 'Pošlji povezavo' : 'Prijavi se'}
                        </button>
                      </form>

                      {authMode === 'forgot_password' ? (
                        <div className="text-center text-sm">
                          <button
                            onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                            className="text-gray-500 font-medium hover:text-gray-900"
                          >
                            Nazaj na prijavo
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-white text-gray-500">ali nadaljujte z</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <button 
                              type="button"
                              onClick={async () => {
                                try {
                                  setAuthError('');
                                  await signIn();
                                } catch (error: any) {
                                  setAuthError(error.message || 'Prišlo je do napake pri prijavi z Google.');
                                }
                              }}
                              className="flex items-center justify-center gap-2 border border-gray-200 bg-white text-black px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                              Google
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'animation' && (
              <motion.div
                key="step-animation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Vaš dogodek je ustvarjen! 🎉</h2>
                <div className="text-left bg-gray-50 rounded-2xl p-6 mb-8 max-w-sm mx-auto">
                  <p className="font-semibold text-gray-900 mb-4">Tukaj lahko:</p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="text-green-500">✅</span> preizkusite galerijo
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="text-green-500">✅</span> naložite do 5 slik
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <span className="text-green-500">✅</span> vidite, kako bo Kliksy izgledal na vašem dogodku 😊
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate(`/dashboard?eventId=${demoEventId}`)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                >
                  Odpri moj dogodek
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
              >
                <button onClick={handleBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Nazaj
                </button>

                <div className="mb-8 relative">
                  <div className="inline-block bg-[#F3F1FF] text-[#5B45FF] px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wider uppercase mb-3 border border-[#5B45FF]/10 shadow-sm">
                    -30% Samo še danes!
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Izbira paketa in plačilo</h2>
                  <p className="text-gray-600">Izberite paket in zaključite nakup.</p>
                </div>

                <div className="space-y-4 mb-8">
                  {(Object.keys(plans) as Plan[]).map((planKey) => (
                    <div 
                      key={planKey}
                      className={`block rounded-2xl border-2 transition-all overflow-hidden ${
                        formData.plan === planKey 
                          ? 'border-indigo-600 bg-indigo-50/50' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div 
                        className="p-6 flex items-center justify-between cursor-pointer"
                        onClick={() => {
                          setFormData({...formData, plan: planKey});
                          setExpandedPlan(expandedPlan === planKey ? null : planKey);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.plan === planKey ? 'border-indigo-600' : 'border-gray-300'
                          }`}>
                            {formData.plan === planKey && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg uppercase">{plans[planKey].name}</h3>
                            <p className="text-sm text-gray-500">
                              {planKey === 'basic' && 'Osnovne funkcionalnosti'}
                              {planKey === 'plus' && 'Live galerija + personalizacija'}
                              {planKey === 'premium' && 'Vse + premium podpora'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold">{plans[planKey].price}€</span>
                              <span className="text-sm font-bold text-gray-400 line-through">
                                {planKey === 'basic' ? '55€' : planKey === 'plus' ? '69€' : '109€'}
                              </span>
                            </div>
                          </div>
                          {expandedPlan === planKey ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedPlan === planKey && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6 border-t border-indigo-100/50 pt-4"
                          >
                            <ul className="space-y-2">
                              {plans[planKey].features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                  <Check className="w-4 h-4 text-indigo-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-col gap-4 mb-8">
                  {/* Badge 1 - Social Proof */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 flex flex-col items-center text-center border border-purple-100/50 shadow-sm">
                    <div className="flex -space-x-3 shrink-0 mb-3">
                      <div className="w-12 h-12 rounded-full bg-pink-100 border-2 border-white shadow-sm flex items-center justify-center text-[20px] z-10">📸</div>
                      <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-[20px] z-0">🎉</div>
                    </div>
                    <div>
                      <p className="font-bold text-[#5B45FF] text-[16px] leading-tight uppercase tracking-wide">200+ dogodkov</p>
                      <p className="text-[14px] text-gray-600 font-medium mt-1">je bilo že ustvarjenih letos 💜</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Badge 2 */}
                    <div className="bg-white rounded-2xl p-4 flex flex-col items-center text-center border border-gray-100 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mb-3">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-[13px] leading-tight mb-1">30-dnevna<br/>garancija</p>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">Brez vprašanj,<br/>vračilo kupnine</p>
                      </div>
                    </div>

                    {/* Badge 3 */}
                    <div className="bg-white rounded-2xl p-4 flex flex-col items-center text-center border border-gray-100 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mb-3">
                        <Lock className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-[13px] leading-tight mb-1">100% varno<br/>plačilo</p>
                        <p className="text-[11px] text-gray-500 font-medium leading-tight">Zavarovano z<br/>Stripe zaščito</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Slider */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm text-center relative mb-12">
                   <p className="font-bold text-gray-900 mb-4 text-[15px]">Kaj pravijo naši uporabniki? 💜</p>
                   
                   <div className="flex justify-center gap-1 mb-6">
                     {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 text-[#5B45FF] fill-[#5B45FF]" />)}
                   </div>

                   <div className="relative px-6 md:px-12">
                     <button 
                       onClick={(e) => {
                         e.preventDefault();
                         setCurrentTestimonialIndex(prev => prev === 0 ? TESTIMONIALS.length - 1 : prev - 1);
                       }}
                       className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                     >
                       <ChevronLeft className="w-5 h-5" />
                     </button>

                     <AnimatePresence mode="wait">
                       <motion.div
                         key={currentTestimonialIndex}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         transition={{ duration: 0.2 }}
                         className="flex flex-col items-center"
                       >
                         <p className="text-gray-600 font-medium italic mb-6 min-h-[60px] text-[15px] max-w-lg mx-auto">
                           "{TESTIMONIALS[currentTestimonialIndex].text}"
                         </p>

                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm bg-blue-100 shrink-0">
                              <span className="text-[18px]">👫</span>
                            </div>
                            <div className="text-left">
                              <p className="text-[13px] font-bold text-gray-900">{TESTIMONIALS[currentTestimonialIndex].names}</p>
                              <p className="text-[12px] text-gray-500 font-medium">{TESTIMONIALS[currentTestimonialIndex].subtitle}</p>
                            </div>
                         </div>
                       </motion.div>
                     </AnimatePresence>

                     <button 
                       onClick={(e) => {
                         e.preventDefault();
                         setCurrentTestimonialIndex(prev => prev === TESTIMONIALS.length - 1 ? 0 : prev + 1);
                       }}
                       className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-900 transition-colors"
                     >
                       <ChevronRight className="w-5 h-5" />
                     </button>
                   </div>

                   <div className="flex justify-center gap-1.5 mt-8">
                     {TESTIMONIALS.map((_, idx) => (
                       <button 
                         key={idx}
                         onClick={(e) => {
                           e.preventDefault();
                           setCurrentTestimonialIndex(idx);
                         }}
                         className={`h-1.5 rounded-full transition-all ${idx === currentTestimonialIndex ? 'bg-[#5B45FF] w-4' : 'bg-gray-200 w-1.5'}`}
                       />
                     ))}
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-bold mb-4">Morda potrebujete še to?</h3>
                  
                  <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                    <h4 className="font-bold mb-2">Podstavki za mizo (opcijsko)</h4>
                    <p className="text-sm text-gray-600 mb-4">Izberite količino podstavkov za vaše QR kode.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {standImages.map((img, idx) => (
                        <div 
                          key={idx} 
                          className={`rounded-xl border-2 overflow-hidden transition-all relative ${selectedStand === idx ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                          <div 
                            className="w-full aspect-square relative cursor-pointer group"
                            onClick={() => setViewingImage(idx)}
                          >
                            <img src={img} alt={`Podstavek ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                              <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100 shadow-sm">
                                <Maximize2 className="w-5 h-5 text-gray-700" />
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className="p-3 bg-white border-t border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedStand(idx)}
                          >
                            <span className="text-sm font-medium text-gray-700">Podstavek {idx + 1}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedStand === idx ? 'border-indigo-600' : 'border-gray-300'
                            }`}>
                              {selectedStand === idx && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <button
                        onClick={() => setStandsQuantity(0)}
                        className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                          standsQuantity === 0 ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        Brez
                      </button>
                      {[5, 10, 20, 30].map((qty) => {
                        const price = (qty === 5 ? 19.99 : qty === 10 ? 24.99 : qty === 20 ? 29.99 : 34.99);
                        
                        return (
                          <button
                            key={qty}
                            onClick={() => setStandsQuantity(qty as any)}
                            className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors flex flex-col items-center justify-center ${
                              standsQuantity === qty ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <span>{qty} kosov</span>
                            <span className={standsQuantity === qty ? 'text-gray-300 text-xs' : 'text-gray-500 text-xs'}>+{price}€</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence>
                    {(standsQuantity > 0) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-8 overflow-hidden"
                      >
                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                          <h4 className="font-bold mb-4 text-indigo-900">Prejemnik in naslov za dostavo</h4>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Ime"
                                value={formData.deliveryName}
                                onChange={(e) => setFormData({...formData, deliveryName: e.target.value})}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Priimek"
                                value={formData.deliverySurname}
                                onChange={(e) => setFormData({...formData, deliverySurname: e.target.value})}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Ulica in hišna številka"
                                value={formData.deliveryAddress}
                                onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Poštna številka"
                                value={formData.deliveryPostcode}
                                onChange={(e) => setFormData({...formData, deliveryPostcode: e.target.value})}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                              />
                              <input
                                type="text"
                                placeholder="Mesto"
                                value={formData.deliveryCity}
                                onChange={(e) => setFormData({...formData, deliveryCity: e.target.value})}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-all text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="font-medium">Paket {plans[formData.plan].name}</span>
                    <span className="font-medium">{originalPrice}€</span>
                  </div>
                  
                  {upsellPrice > 0 && (
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                      <span className="font-medium text-gray-600">Dodatne storitve</span>
                      <span className="font-medium">+{upsellPrice.toFixed(2)}€</span>
                    </div>
                  )}

                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <label className="block text-sm font-medium mb-2">Koda za popust</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text" 
                        value={discountCode}
                        onChange={(e) => {
                          setDiscountCode(e.target.value.toUpperCase());
                          setDiscountError('');
                        }}
                        disabled={discountApplied}
                        placeholder="Vnesite kodo"
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all uppercase"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (discountApplied) {
                            setDiscountApplied(false);
                            setActiveDiscount(null);
                            setDiscountCode('');
                          } else {
                            handleApplyDiscount();
                          }
                        }}
                        disabled={isUpdatingPrice}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap w-full sm:w-auto ${discountApplied ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-900 text-white hover:bg-black disabled:opacity-50'}`}
                      >
                        {isUpdatingPrice ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (discountApplied ? 'Odstrani' : 'Uporabi')}
                      </button>
                    </div>
                    {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
                    {discountApplied && activeDiscount && (
                      <p className="text-green-600 text-sm mt-2">
                        Koda {activeDiscount.code} uspešno unovčena! (-{activeDiscount.value}{activeDiscount.discountType === 'percentage' ? '%' : '€'} {activeDiscount.appliesTo === 'packages_only' ? 'na paket' : 'na celoten znesek'})
                      </p>
                    )}
                  </div>

                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer mb-4">
                      <input 
                        type="checkbox" 
                        checked={formData.isCompanyInvoice}
                        onChange={(e) => setFormData({...formData, isCompanyInvoice: e.target.checked})}
                        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <span className="font-medium text-gray-900">Potrebujem račun na podjetje</span>
                    </label>

                    <AnimatePresence>
                      {formData.isCompanyInvoice && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          <div>
                            <label className="block text-sm font-medium mb-1">Ime podjetja</label>
                            <input 
                              type="text" 
                              value={formData.companyName}
                              onChange={e => setFormData({...formData, companyName: e.target.value})}
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                              placeholder="Podjetje d.o.o."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Naslov podjetja</label>
                            <input 
                              type="text" 
                              value={formData.companyAddress}
                              onChange={e => setFormData({...formData, companyAddress: e.target.value})}
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                              placeholder="Slovenska cesta 1, 1000 Ljubljana"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Davčna številka</label>
                            <input 
                              type="text" 
                              value={formData.companyTaxId}
                              onChange={e => setFormData({...formData, companyTaxId: e.target.value})}
                              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                              placeholder="SI12345678"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Skupaj za plačilo</span>
                    <div className="text-right">
                      {discountApplied && <span className="text-gray-400 line-through mr-2">{(originalPrice + upsellPrice).toFixed(2)}€</span>}
                      <span className="text-xl font-bold text-black">{finalPrice.toFixed(2)}€</span>
                    </div>
                  </div>
                </div>

                {paymentSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Plačilo uspešno!</h3>
                    <p className="text-gray-600">Pripravljamo vaš dogodek...</p>
                  </motion.div>
                ) : (
                  <>
                    {stripeError && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm mb-4 flex flex-col gap-3">
                        <p>{stripeError}</p>
                      </div>
                    )}
                    
                    {finalPrice > 0 ? (
                      clientSecret ? (
                        <Elements key={clientSecret} stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' }, locale: 'sl' }}>
                          <StripePaymentForm 
                            user={user}
                            formData={formData}
                            standsQuantity={standsQuantity}
                            standImages={standImages}
                            selectedStand={selectedStand}
                            onError={setStripeError}
                            finalPrice={finalPrice}
                            discountApplied={discountApplied}
                            discountCode={discountCode}
                            stripePaymentIntentId={stripePaymentIntentId}
                            isUpdatingPrice={isUpdatingPrice}
                            existingEventId={existingEventId}
                            onOpenTerms={() => setIsTermsModalOpen(true)}
                          />
                        </Elements>
                      ) : stripeError ? (
                        <div className="flex flex-col items-center justify-center p-8 border border-red-200 rounded-xl bg-red-50">
                          <p className="text-sm text-red-600 font-medium mb-2">Plačilnega okna ni bilo mogoče naložiti</p>
                          <button 
                            onClick={() => setStep(3)}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                          >
                            Nazaj na izbiro paketa
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-xl bg-gray-50">
                          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
                          <p className="text-sm text-gray-500">Pripravljam varno plačilo...</p>
                        </div>
                      )
                    ) : (
                      <div className="mt-8">
                        <div className="flex items-start gap-2 mb-4">
                          <input 
                            type="checkbox" 
                            id="terms_free" 
                            checked={termsAcceptedFree} 
                            onChange={(e) => setTermsAcceptedFree(e.target.checked)} 
                            className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                          />
                          <label htmlFor="terms_free" className="text-sm text-gray-700 cursor-pointer">
                            Strinjam se s <button type="button" onClick={() => setIsTermsModalOpen(true)} className="text-indigo-600 hover:text-indigo-800 hover:underline">splošnimi pogoji</button>*
                          </label>
                        </div>
                        <button 
                          onClick={handleCheckoutFree}
                          disabled={isProcessing || !user || user.isAnonymous || !termsAcceptedFree}
                          className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {isProcessing ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Obdelujem...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              Ustvari dogodek brezplačno <Check className="w-5 h-5" />
                            </span>
                          )}
                        </button>
                      </div>
                    )}
                    {finalPrice > 0 && (
                      <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                        Varno plačilo zagotavlja Stripe
                      </p>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {viewingImage !== null && (
        <ImageViewer
          images={standImages.map((url, idx) => ({ id: String(idx), url }))}
          initialIndex={viewingImage}
          onClose={() => setViewingImage(null)}
        />
      )}

      
      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsVerificationModalOpen(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Preverite vaš e-poštni predal</h2>
            <p className="text-gray-600 mb-4">Račun je bil uspešno ustvarjen! Na vaš elektronski naslov smo poslali povezavo za potrditev računa. Prosimo, preverite svoj nabiralnik in potrdite račun.</p>
            <p className="text-sm text-gray-500 mb-6 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">Če sporočila ne najdete, prosimo preverite tudi mapo z vsiljeno pošto (Spam).</p>
            <button 
              onClick={() => setIsVerificationModalOpen(false)}
              className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-colors"
            >
              Razumem, zapri okno
            </button>
          </div>
        </div>
      )}
  
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsTermsModalOpen(false)}>
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl relative"
          >
            <div className="sticky top-0 bg-white/90 backdrop-blur-md pb-4 pt-2 -mt-4 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-900">Splošni pogoji uporabe</h2>
              <button 
                onClick={() => setIsTermsModalOpen(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="prose prose-sm md:prose-base text-gray-600 mt-6 pb-8">
              <p className="mb-4">Splošni pogoji poslovanja in uporabe spletne strani kliksy.si so sestavljeni v skladu z Zakonom o varstvu potrošnikov (ZVPot), Zakonom o varstvu osebnih podatkov (ZVOP-1), Splošno uredbo o varstvu podatkov (GDPR) in Zakonom o elektronskih komunikacijah (ZEKom-1).</p>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">1. Splošne določbe</h3>
              <p className="mb-4">Z uporabo spletnega mesta kliksy.si potrjujete, da ste seznanjeni in se strinjate z navedenimi pogoji uporabe. Storitev omogoča ustvarjanje virtualnih galerij za shranjevanje in deljenje fotografij iz dogodkov.</p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">2. Uporaba storitve in ustvarjanje dogodkov</h3>
              <p className="mb-4">Z ustvarjanjem dogodka na naši platformi zakupljate dostop do virtualne galerije, kjer vaše stranke/gosti lahko nalagajo fotografije. Uporabnik je dolžan platformo uporabljati v skladu s predpisi.</p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2 bg-yellow-100 px-3 py-1 rounded-md inline-block">3. Odgovornost za naložene vsebine (Pomembno)</h3>
              <p className="mb-4 font-medium text-gray-800">
                Organizatorji oziroma tisti ponudniki (uporabniki), ki na naši platformi ustvarijo in odprejo dogodek, prevzemajo popolno in izključno odgovornost za vse fotografije, videoposnetke ter druge vsebine, ki jih njim ali njihovim gostom uspe naložiti v dotično virtualno galerijo. 
              </p>
              <p className="mb-4">
                Kliksy.si (upravljavec platforme) nastopa zgolj kot ponudnik tehnološke rešitve oz. informacijske infrastrukture za lažje zbiranje slik in pri tem ročno ne pregleduje vsake naložene fotografije. V kolikor se v galeriji znajdejo neprimerne, avtorsko sporne ali nezakonite vsebine (npr. golota, nasilje, protipravne vsebine), je dolžnost in odgovornost ustvarjalca dogodka, da te slike redno pregleduje in s pomočjo orodij (ki so na voljo v nadzorni plošči) nemudoma izbriše.
              </p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">4. Cene in plačilo</h3>
              <p className="mb-4">Vse cene na spletnem mestu so navedene v evrih. Plačila se izvajajo prek varne povezave (Stripe). Za vsa vplačila izdamo ustrezne račune, ki so v skladu s slovensko zakonodajo.</p>
              
              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">5. Pravica do odstopa od pogodbe in reklamacije</h3>
              <p className="mb-4">Uporabnik ima v skladu z ZVPot pravico, da nas v 14 dneh obvesti, če odstopa od pogodbe, in zahteva vračilo kupnine znotraj naše reklamacijske sheme in naše 30-dnevne garancije nezadovoljstva. Vračilo bo izvedeno na isto transakcijsko sredstvo.</p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">6. Omejitev odgovornosti upravljavca</h3>
              <p className="mb-4">Platforma zagotavlja visoko zanesljivost dostopanja do podatkov, kljub temu pa upravljavec ne prevzema odgovornosti za morebitne izpade delovanja strežnikov izven lastnega nadzora.</p>

              <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">7. Končne določbe</h3>
              <p className="mb-4">Pogoji uporabe pričnejo veljati z dnem objave. Upravljavec si pridržuje pravico do spremembe pogojev, o čemer se uporabnike pravočasno seznani.</p>
            </div>
            
            <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-4 pb-2 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsTermsModalOpen(false)}
                className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-colors"
              >
                Zapri in nadaljuj
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StripePaymentForm({ 
  user, 
  formData, 
  standsQuantity, 
  standImages, 
  selectedStand, 
  onError,
  finalPrice,
  discountApplied,
  discountCode,
  stripePaymentIntentId,
  isUpdatingPrice,
  existingEventId,
  onOpenTerms
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAcceptedStripe, setTermsAcceptedStripe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user) return;

    if (
      standsQuantity > 0 &&
      (!formData.deliveryName || !formData.deliverySurname || !formData.deliveryAddress || !formData.deliveryPostcode || !formData.deliveryCity)
    ) {
      onError('Za dostavo podstavkov morate izpolniti vse podatke o prejemniku in naslovu za dostavo!');
      return;
    }

    setIsProcessing(true);
    onError('');

    const requiresDelivery = standsQuantity > 0;

    try {
      let docId = existingEventId;
      const eventData = {
        eventType: formData.eventType,
        eventName: formData.eventName,
        partner1: formData.partner1,
        partner2: formData.partner2,
        date: formData.date,
        email: user.email || '',
        plan: formData.plan,
        deliveryMode: 'self_print',
        standsQuantity,
        printedQrQuantity: 0,
        selectedStand: standsQuantity > 0 ? standImages[selectedStand] : null,
        isCompanyInvoice: formData.isCompanyInvoice,
        companyName: formData.isCompanyInvoice ? formData.companyName : null,
        companyAddress: formData.isCompanyInvoice ? formData.companyAddress : null,
        companyTaxId: formData.isCompanyInvoice ? formData.companyTaxId : null,
        deliveryName: requiresDelivery ? formData.deliveryName : null,
        deliverySurname: requiresDelivery ? formData.deliverySurname : null,
        deliveryAddress: requiresDelivery ? formData.deliveryAddress : null,
        deliveryCity: requiresDelivery ? formData.deliveryCity : null,
        deliveryPostcode: requiresDelivery ? formData.deliveryPostcode : null,
        selectedDesignId: null,
        ownerId: user.uid,
        paymentStatus: 'pending',
        amountPaid: finalPrice,
        discountCode: discountApplied ? discountCode : null,
        stripePaymentIntentId: stripePaymentIntentId || null,
        isDemo: false
      };

      if (docId) {
        await updateDoc(doc(db, "events", docId), eventData);
      } else {
        const docRef = await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: serverTimestamp()
        });
        docId = docRef.id;
      }

      const { error: stripeErr } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?eventId=${docId}&success=true`,
          payment_method_data: {
            billing_details: {
              email: user.email || undefined,
            }
          }
        },
      });

      if (stripeErr) {
        onError(stripeErr.message || 'Plačilo ni uspelo.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      onError(err.message || 'Prišlo je do napake.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-6 p-5 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
        <h4 className="font-medium text-gray-900 mb-2">Podatki za plačilo</h4>
        <div className="bg-white p-3 rounded-lg border border-gray-300">
          <PaymentElement options={{ 
            layout: 'accordion',
            defaultValues: {
              billingDetails: {
                address: {
                  country: 'SI'
                }
              }
            },
            fields: {
              billingDetails: {
                email: 'never'
              }
            }
          }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-4 mt-2 border-b border-gray-100">
        <div className="flex items-center justify-center gap-2">
          <Lock className="w-6 h-6 text-gray-400 shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-bold text-gray-900 leading-none">SSL</p>
            <p className="text-[11px] text-gray-500 font-medium leading-tight">zaščita</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-6 h-6 text-indigo-500 shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-bold text-gray-900 leading-none">Stripe</p>
            <p className="text-[11px] text-gray-500 font-medium leading-tight">varno plačilo</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-gray-400 shrink-0" />
          <div className="text-left">
            <p className="text-[11px] font-bold text-gray-900 leading-none">PCI DSS</p>
            <p className="text-[11px] text-gray-500 font-medium leading-tight">certificirano</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2">
        <input 
          type="checkbox" 
          id="terms_stripe" 
          checked={termsAcceptedStripe} 
          onChange={(e) => setTermsAcceptedStripe(e.target.checked)} 
          className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
        />
        <label htmlFor="terms_stripe" className="text-sm text-gray-700 cursor-pointer">
          Strinjam se s <button type="button" onClick={onOpenTerms} className="text-indigo-600 hover:text-indigo-800 hover:underline">splošnimi pogoji</button>*
        </label>
      </div>

      <button 
        type="submit"
        disabled={isProcessing || !stripe || !elements || isUpdatingPrice || !termsAcceptedStripe}
        className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 shadow-lg"
      >
        {isProcessing || isUpdatingPrice ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {isUpdatingPrice ? 'Osvežujem ceno...' : 'Obdelujem...'}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Potrdi in ustvari galerijo <Check className="w-5 h-5" />
          </span>
        )}
      </button>

      <div className="mt-4 bg-[#F8F7FF] rounded-xl p-4 flex items-start gap-4">
        <div className="bg-white rounded-full p-2 shadow-sm shrink-0">
          <ShieldCheck className="w-6 h-6 text-[#5B45FF]" />
        </div>
        <div className="pt-0.5">
          <p className="font-bold text-[#5B45FF] text-[13px] leading-tight mb-0.5">30-dnevna garancija vračila denarja</p>
          <p className="text-[12px] text-gray-500 font-medium leading-tight">Če z izdelkom niste 100% zadovoljni, vam vrnemo denar – brez vprašanj.</p>
        </div>
      </div>
    </form>
  );
}
