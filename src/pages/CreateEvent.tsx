import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CreditCard, Calendar, Users, LogIn, Mail, Loader2, ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { db, handleFirestoreError, OperationType, signInWithApple, signUpWithEmail, signInWithEmail } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ImageViewer from '../components/ImageViewer';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

type Plan = 'basic' | 'plus' | 'premium';

function CreateEventContent() {
  const stripe = useStripe();
  const elements = useElements();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPlan = (searchParams.get('plan') as Plan) || 'plus';
  
  const { user, signIn, signOut } = useAuth();
  const [step, setStep] = useState(1);
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
    companyTaxId: ''
  });
  const [expandedPlan, setExpandedPlan] = useState<Plan | null>(initialPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Auth states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Upsell states
  const [deliveryMode, setDeliveryMode] = useState<'self_print' | 'home_delivery'>('self_print');
  const [standsQuantity, setStandsQuantity] = useState<0 | 5 | 10 | 20 | 30>(0);
  const [printedQrQuantity, setPrintedQrQuantity] = useState<5 | 10 | 20 | 30>(5);
  const [selectedStand, setSelectedStand] = useState<number>(0);
  const [viewingImage, setViewingImage] = useState<number | null>(null);

  const standImages = [
    "/hf_20260402_042506_9c8ed65f-ea7f-49b0-a82b-514d73de11e0.png",
    "/hf_20260402_042524_4ac5d4b1-0070-45c3-b3c4-75f0f1a9fb14.png",
    "/hf_20260402_042605_6a668101-3fa9-4d41-849a-41503b830156.png"
  ];

  // Discount states
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [stripeError, setStripeError] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const stripeElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#111827',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  const plans = {
    basic: { 
      name: 'Basic', 
      price: 39,
      features: ['Unikatna QR koda', 'Do 50 gostov', 'Do 200 fotografij', 'Dostop do galerije 1 mesec', 'Prenos vseh slik (ZIP)']
    },
    plus: { 
      name: 'Plus', 
      price: 49,
      features: ['Unikatna QR koda', 'Neomejeno število gostov', 'Neomejeno fotografij', 'Dostop do galerije 1 leto', 'Prenos vseh slik (ZIP)', 'Live galerija (projekcija)', 'Personalizirana stran z imeni']
    },
    premium: { 
      name: 'Premium', 
      price: 79,
      features: ['Unikatna QR koda', 'Neomejeno število gostov', 'Neomejeno fotografij', 'Dostop do galerije 2 leti', 'Prenos vseh slik (ZIP)', 'Live galerija (projekcija)', 'Personalizirana stran z imeni', 'Premium design predloge', 'Prioritetna podpora']
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      if (user && !user.isAnonymous) {
        setStep(4);
      }
      return;
    }
  };



  const handleBack = () => {
    if (step === 4 && (!user || user.isAnonymous)) {
      setStep(3);
    } else if (step === 4 && user && !user.isAnonymous) {
      setStep(2);
    } else {
      setStep(s => Math.max(s - 1, 1));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'register') {
        await signUpWithEmail(authEmail, authPassword);
      } else {
        await signInWithEmail(authEmail, authPassword);
      }
    } catch (error: any) {
      setAuthError(error.message || 'Prišlo je do napake pri prijavi.');
    }
  };

  const handleAppleAuth = async () => {
    try {
      await signInWithApple();
    } catch (error: any) {
      setAuthError(error.message || 'Prišlo je do napake pri prijavi z Apple.');
    }
  };

  const handleCheckout = async () => {
    if (!user || user.isAnonymous) {
      setAuthError("Prosimo, prijavite se za nadaljevanje.");
      return;
    }
    
    setIsProcessing(true);
    setStripeError('');
    
    try {
      const docRef = await addDoc(collection(db, "events"), {
        eventType: formData.eventType,
        eventName: formData.eventName,
        partner1: formData.partner1,
        partner2: formData.partner2,
        date: formData.date,
        email: user.email || '',
        plan: formData.plan,
        deliveryMode,
        standsQuantity,
        printedQrQuantity: deliveryMode === 'home_delivery' ? printedQrQuantity : 0,
        selectedStand: standsQuantity > 0 ? standImages[selectedStand] : null,
        isCompanyInvoice: formData.isCompanyInvoice,
        companyName: formData.isCompanyInvoice ? formData.companyName : null,
        companyAddress: formData.isCompanyInvoice ? formData.companyAddress : null,
        companyTaxId: formData.isCompanyInvoice ? formData.companyTaxId : null,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        paymentStatus: finalPrice > 0 ? 'pending' : 'paid'
      });

      if (finalPrice === 0) {
        setIsProcessing(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate(`/dashboard?eventId=${docRef.id}&success=true`);
        }, 3000);
        return;
      }

      if (!stripe || !elements) {
        setStripeError('Stripe ni naložen. Prosimo, osvežite stran.');
        setIsProcessing(false);
        return;
      }

      // Call payment intent endpoint
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: formData.plan, 
          discountCode: discountApplied ? 'test99' : '',
          deliveryMode,
          standsQuantity,
          printedQrQuantity
        })
      });
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        const text = await res.text();
        const snippet = text.substring(0, 100).replace(/<[^>]*>?/gm, '');
        throw new Error(`Strežnik je vrnil neveljaven odgovor: ${snippet ? snippet : 'Prazno'}. Status: ${res.status}`);
      }

      if (data.error) {
        setStripeError(data.error);
        setIsProcessing(false);
        return;
      }

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        throw new Error('Kartica ni najdena.');
      }

      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardName,
              email: user.email || '',
            },
          },
        }
      );

      if (stripeErr) {
        setStripeError(stripeErr.message || 'Plačilo ni uspelo.');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate(`/dashboard?eventId=${docRef.id}&success=true`);
        }, 3000);
      }
    } catch (error: any) {
      console.error(error);
      setStripeError(error.message || 'Napaka pri povezovanju s plačilnim sistemom.');
      setIsProcessing(false);
    }
  };

  const originalPrice = plans[formData.plan].price;
  
  let upsellPrice = 0;
  if (deliveryMode === 'home_delivery') {
    if (printedQrQuantity === 5) upsellPrice += 19.99;
    else if (printedQrQuantity === 10) upsellPrice += 29.99;
    else if (printedQrQuantity === 20) upsellPrice += 39.99;
    else if (printedQrQuantity === 30) upsellPrice += 49.99;

    if (standsQuantity === 5) upsellPrice += 4.99;
    else if (standsQuantity === 10) upsellPrice += 9.99;
    else if (standsQuantity === 20) upsellPrice += 12.99;
    else if (standsQuantity === 30) upsellPrice += 14.99;
  } else {
    if (standsQuantity === 5) upsellPrice += 19.99;
    else if (standsQuantity === 10) upsellPrice += 24.99;
    else if (standsQuantity === 20) upsellPrice += 29.99;
    else if (standsQuantity === 30) upsellPrice += 34.99;
  }

  const finalPrice = (discountApplied ? 0 : originalPrice) + upsellPrice;

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
                  {['poroka', 'poslovni_dogodek', 'rojstni_dan', 'teambuilding'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, eventType: type })}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.eventType === type ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-bold text-lg">
                        {type === 'poroka' ? 'Poroka' : type === 'poslovni_dogodek' ? 'Poslovni dogodek' : type === 'rojstni_dan' ? 'Rojstni dan' : 'Teambuilding'}
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
                        onClick={() => setStep(4)}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors mb-3"
                      >
                        Nadaljuj na plačilo
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
                      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                        <button 
                          onClick={() => setAuthMode('register')}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${authMode === 'register' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                          Registracija
                        </button>
                        <button 
                          onClick={() => setAuthMode('login')}
                          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${authMode === 'login' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                        >
                          Prijava
                        </button>
                      </div>

                      {authError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">
                          {authError}
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
                        <button 
                          type="submit"
                          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                          {authMode === 'register' ? 'Ustvari račun' : 'Prijavi se'}
                        </button>
                      </form>

                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">ali nadaljujte z</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
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
                        <button 
                          onClick={handleAppleAuth}
                          className="flex items-center justify-center gap-2 border border-gray-200 bg-white text-black px-4 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.76 1.56.04 2.87.74 3.65 1.9-3.13 1.86-2.61 5.98.43 7.21-.73 1.76-1.66 3.04-2.75 3.82zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                          </svg>
                          Apple
                        </button>
                      </div>
                    </>
                  )}
                </div>
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

                <div className="mb-8">
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
                          <div className="text-2xl font-bold">{plans[planKey].price}€</div>
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

                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-bold mb-4">Dodatne storitve</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        deliveryMode === 'self_print' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      onClick={() => setDeliveryMode('self_print')}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          deliveryMode === 'self_print' ? 'border-indigo-600' : 'border-gray-300'
                        }`}>
                          {deliveryMode === 'self_print' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                        </div>
                        <h4 className="font-bold">Sprintal bom sam</h4>
                      </div>
                      <p className="text-sm text-gray-500 pl-8">Brezplačno. QR kodo boste prejeli v PDF formatu za lastno tiskanje.</p>
                    </div>

                    <div 
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        deliveryMode === 'home_delivery' ? 'border-indigo-600 bg-indigo-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div 
                        className="flex items-center justify-between mb-2 cursor-pointer"
                        onClick={() => setDeliveryMode('home_delivery')}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            deliveryMode === 'home_delivery' ? 'border-indigo-600' : 'border-gray-300'
                          }`}>
                            {deliveryMode === 'home_delivery' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                          </div>
                          <h4 className="font-bold">All in one dostava na dom</h4>
                        </div>
                        <span className="font-bold">
                          +{printedQrQuantity === 5 ? '19.99' : printedQrQuantity === 10 ? '29.99' : printedQrQuantity === 20 ? '39.99' : '49.99'}€
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 pl-8 mb-4 cursor-pointer" onClick={() => setDeliveryMode('home_delivery')}>Vključuje printanje QR kod na premium trd papir in dostavo na dom.</p>
                      
                      <AnimatePresence>
                        {deliveryMode === 'home_delivery' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-8 overflow-hidden"
                          >
                            <div className="pt-2 border-t border-indigo-100/50">
                              <p className="text-sm font-medium mb-2 text-gray-700">Število natisnjenih QR kod:</p>
                              <div className="grid grid-cols-4 gap-2">
                                {[5, 10, 20, 30].map((qty) => (
                                  <button
                                    key={qty}
                                    onClick={() => setPrintedQrQuantity(qty as any)}
                                    className={`py-2 px-1 rounded-lg text-sm font-medium border transition-colors ${
                                      printedQrQuantity === qty ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {qty}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

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
                        const price = deliveryMode === 'home_delivery' 
                          ? (qty === 5 ? 4.99 : qty === 10 ? 9.99 : qty === 20 ? 12.99 : 14.99)
                          : (qty === 5 ? 19.99 : qty === 10 ? 24.99 : qty === 20 ? 29.99 : 34.99);
                        
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
                          setDiscountCode(e.target.value);
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
                            setDiscountCode('');
                          } else {
                            if (discountCode.toLowerCase() === 'test99') {
                              setDiscountApplied(true);
                              setDiscountError('');
                            } else {
                              setDiscountError('Neveljavna koda za popust');
                            }
                          }
                        }}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap w-full sm:w-auto ${discountApplied ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-900 text-white hover:bg-black'}`}
                      >
                        {discountApplied ? 'Odstrani' : 'Uporabi'}
                      </button>
                    </div>
                    {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
                    {discountApplied && <p className="text-green-600 text-sm mt-2">Koda uspešno unovčena! (-100%)</p>}
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
                    
                    {finalPrice > 0 && (
                      <div className="mb-6 p-5 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
                        <h4 className="font-medium text-gray-900 mb-2">Podatki o kartici</h4>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Ime na kartici</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Janez Novak"
                            className="w-full bg-white p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-gray-900"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Številka kartice</label>
                          <div className="bg-white p-3 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                            <CardNumberElement options={stripeElementOptions} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Datum poteka</label>
                            <div className="bg-white p-3 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                              <CardExpiryElement options={stripeElementOptions} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">CVC</label>
                            <div className="bg-white p-3 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                              <CardCvcElement options={stripeElementOptions} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={handleCheckout}
                      disabled={isProcessing || !user || user.isAnonymous}
                      className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Obdelujem...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {finalPrice === 0 ? 'Ustvari dogodek brezplačno' : 'Nadaljuj na plačilo'} <Check className="w-5 h-5" />
                        </span>
                      )}
                    </button>
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
    </div>
  );
}

export default function CreateEvent() {
  return (
    <Elements stripe={stripePromise}>
      <CreateEventContent />
    </Elements>
  );
}
