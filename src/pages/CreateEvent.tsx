import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CreditCard, Calendar, Users, LogIn, Mail } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { db, handleFirestoreError, OperationType, signInWithApple, signUpWithEmail, signInWithEmail } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type Plan = 'basic' | 'plus' | 'premium';

export default function CreateEvent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPlan = (searchParams.get('plan') as Plan) || 'plus';
  
  const { user, signIn } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    partner1: '',
    partner2: '',
    date: '',
    email: '',
    plan: initialPlan
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Auth states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Discount states
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.isAnonymous) {
      setAuthError("Prosimo, prijavite se za nadaljevanje.");
      return;
    }
    
    setIsProcessing(true);
    // Simulate Stripe payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const docRef = await addDoc(collection(db, "events"), {
        partner1: formData.partner1,
        partner2: formData.partner2,
        date: formData.date,
        email: formData.email,
        plan: formData.plan,
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });
      setIsProcessing(false);
      navigate(`/dashboard?eventId=${docRef.id}&success=true`);
    } catch (error) {
      setIsProcessing(false);
      handleFirestoreError(error, OperationType.CREATE, "events");
    }
  };

  const plans = {
    basic: { name: 'Basic', price: 29 },
    plus: { name: 'Plus', price: 49 },
    premium: { name: 'Premium', price: 79 }
  };

  const originalPrice = plans[formData.plan].price;
  const finalPrice = discountApplied ? 0 : originalPrice;

  return (
    <div className="min-h-screen bg-[var(--color-wedding-beige)] flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[var(--color-wedding-sand)]/30 bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl tracking-tight text-[var(--color-wedding-dark)]">
            Kliksy<span className="text-[var(--color-wedding-gold)]">.</span>
          </Link>
          <div className="text-sm font-medium text-[var(--color-wedding-text)]/60">
            Korak {step} od 3
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
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-[var(--color-wedding-sand)]/20 border border-[var(--color-wedding-sand)]/50"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-serif mb-2">Vaš veliki dan</h2>
                  <p className="text-[var(--color-wedding-text)]/70">Vnesite osnovne podatke o vajini poroki.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ime (Partner 1)</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                          type="text" 
                          value={formData.partner1}
                          onChange={e => setFormData({...formData, partner1: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
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
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
                          placeholder="Luka"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Datum poroke</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="date" 
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email naslov</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
                      placeholder="ana.luka@primer.si"
                    />
                    <p className="text-xs text-gray-500 mt-2">Na ta naslov boste prejeli dostop do nadzorne plošče.</p>
                  </div>

                  <button 
                    onClick={handleNext}
                    disabled={!formData.partner1 || !formData.partner2 || !formData.date || !formData.email}
                    className="w-full bg-[var(--color-wedding-dark)] text-white py-4 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
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
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-[var(--color-wedding-sand)]/20 border border-[var(--color-wedding-sand)]/50"
              >
                <button onClick={handleBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Nazaj
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-serif mb-2">Izbira paketa</h2>
                  <p className="text-[var(--color-wedding-text)]/70">Izberite paket, ki najbolj ustreza vajinim željam.</p>
                </div>

                <div className="space-y-4">
                  {(Object.keys(plans) as Plan[]).map((planKey) => (
                    <label 
                      key={planKey}
                      className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.plan === planKey 
                          ? 'border-[var(--color-wedding-gold)] bg-[var(--color-wedding-gold)]/5' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.plan === planKey ? 'border-[var(--color-wedding-gold)]' : 'border-gray-300'
                          }`}>
                            {formData.plan === planKey && <div className="w-3 h-3 bg-[var(--color-wedding-gold)] rounded-full" />}
                          </div>
                          <div>
                            <h3 className="font-serif text-lg uppercase">{plans[planKey].name}</h3>
                            <p className="text-sm text-gray-500">
                              {planKey === 'basic' && 'Osnovne funkcionalnosti'}
                              {planKey === 'plus' && 'Live galerija + personalizacija'}
                              {planKey === 'premium' && 'Vse + premium podpora'}
                            </p>
                          </div>
                        </div>
                        <div className="text-2xl font-medium">{plans[planKey].price}€</div>
                      </div>
                      <input 
                        type="radio" 
                        name="plan" 
                        value={planKey}
                        checked={formData.plan === planKey}
                        onChange={(e) => setFormData({...formData, plan: e.target.value as Plan})}
                        className="hidden"
                      />
                    </label>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full bg-[var(--color-wedding-dark)] text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 mt-8"
                >
                  Nadaljuj na plačilo <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-[var(--color-wedding-sand)]/20 border border-[var(--color-wedding-sand)]/50"
              >
                <button onClick={handleBack} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Nazaj
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-serif mb-2">Zaključek nakupa</h2>
                  <p className="text-[var(--color-wedding-text)]/70">Varno plačilo preko Stripe.</p>
                </div>

                {(!user || user.isAnonymous) && (
                  <div className="bg-white border border-gray-200 p-6 rounded-2xl mb-8">
                    <div className="text-center mb-6">
                      <h3 className="font-serif text-xl mb-2">Ustvarite profil</h3>
                      <p className="text-sm text-gray-500">Za dostop do nadzorne plošče in upravljanje dogodka.</p>
                    </div>

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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <input 
                          type="password" 
                          placeholder="Geslo"
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
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
                  </div>
                )}

                <div className="bg-[var(--color-wedding-beige)] p-6 rounded-2xl mb-8">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--color-wedding-sand)]/50">
                    <span className="font-medium">Paket {plans[formData.plan].name}</span>
                    <span className="font-medium">{originalPrice}€</span>
                  </div>

                  <div className="mb-4 pb-4 border-b border-[var(--color-wedding-sand)]/50">
                    <label className="block text-sm font-medium mb-2">Koda za popust</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={discountCode}
                        onChange={(e) => {
                          setDiscountCode(e.target.value);
                          setDiscountError('');
                        }}
                        disabled={discountApplied}
                        placeholder="Vnesite kodo"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all uppercase"
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
                        className={`px-4 py-2 rounded-xl font-medium transition-colors ${discountApplied ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-900 text-white hover:bg-black'}`}
                      >
                        {discountApplied ? 'Odstrani' : 'Uporabi'}
                      </button>
                    </div>
                    {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
                    {discountApplied && <p className="text-green-600 text-sm mt-2">Koda uspešno unovčena! (-100%)</p>}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Skupaj za plačilo</span>
                    <div className="text-right">
                      {discountApplied && <span className="text-gray-400 line-through mr-2">{originalPrice}€</span>}
                      <span className="text-xl font-medium text-black">{finalPrice}€</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {finalPrice > 0 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Številka kartice</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="4242 4242 4242 4242"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all font-mono"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Veljavnost</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all font-mono"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVC</label>
                          <input 
                            type="text" 
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isProcessing || !user || user.isAnonymous}
                    className="w-full bg-[var(--color-wedding-dark)] text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Obdelujem...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {finalPrice > 0 ? `Plačaj ${finalPrice}€` : 'Ustvari dogodek brezplačno'} <Check className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                  {finalPrice > 0 && (
                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                      Varno plačilo zagotavlja Stripe
                    </p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
