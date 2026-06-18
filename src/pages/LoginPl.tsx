import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { signInWithGoogle, signInWithEmail } from "../firebase";

export default function LoginHr() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user && !user.isAnonymous && authMode !== 'register') {
      navigate("/dashboard");
    }
  }, [user, navigate, authMode]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      if (authMode === 'forgot_password') {
        const { resetPassword } = await import('../firebase');
        await resetPassword(email);
        setSuccessMsg("Link do resetowania hasła został wysłany na Twój adres e-mail.");
        setAuthMode('login');
      } else if (authMode === 'register') {
        const { signUpWithEmail } = await import('../firebase');
        await signUpWithEmail(email, password, 'pl');
        setIsVerificationModalOpen(true);
        setSuccessMsg('');
        setPassword('');
        setAuthMode('login');
      } else {
        const { signInWithEmail } = await import('../firebase');
        await signInWithEmail(email, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (authMode === 'forgot_password') {
        setError("Błąd podczas wysyłania linku. Sprawdź adres e-mail.");
      } else {
        if (err.code === 'auth/email-not-verified') {
          setError('Prosimy, sprawdź swoją skrzynkę e-mail i potwierdź konto przed zalogowaniem.');
        } else {
          setError(authMode === 'register' ? "Błąd rejestracji. Być może konto już istnieje lub hasło jest za krótkie (minimum 6 znaków)." : "Nieprawidłowy adres e-mail lub hasło.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Google login error:", err);
      setError("Błąd podczas logowania przez Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <nav className="w-full p-6 flex justify-center border-b border-gray-100 bg-white relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Link to="/" className="font-serif text-2xl tracking-tight text-gray-900">
          Kliksy<span className="text-[var(--color-wedding-gold)]">.</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-gray-900 mb-2">
              {authMode === 'login' ? 'Witaj ponownie' : authMode === 'forgot_password' ? 'Resetowanie hasła' : 'Utwórz konto'}
            </h1>
            <p className="text-gray-500">
              {authMode === 'login' ? 'Zaloguj się, aby uzyskać dostęp do swojego wydarzenia' : authMode === 'forgot_password' ? 'Wpisz adres e-mail, a wyślemy Ci link do zresetowania hasła' : 'Dołącz do nas i twórz niezapomniane wspomnienia'}
            </p>
          </div>

          {authMode !== 'forgot_password' && (
            <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
              <button 
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${authMode === 'login' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Logowanie
              </button>
              <button 
                onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${authMode === 'register' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
              >
                Rejestracja
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm text-center">
              {successMsg}
            </div>
          )}

          {authMode !== 'forgot_password' && (
            <>
              <div className="grid grid-cols-1 gap-4 mb-8">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {authMode === 'login' ? 'Zaloguj przez Google' : 'Zarejestruj przez Google'}
                </button>
              </div>

              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative bg-white px-4 text-sm text-gray-500">lub przez e-mail</span>
              </div>
            </>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adres e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
                placeholder="twoj@email.com"
              />
            </div>
            
            {authMode !== 'forgot_password' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-wedding-gold)] focus:ring-1 focus:ring-[var(--color-wedding-gold)] outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            {authMode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setAuthMode('forgot_password'); setError(null); setSuccessMsg(null); }}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Zapomniałem/am hasła
                </button>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'login' ? 'Zaloguj' : authMode === 'forgot_password' ? 'Wyślij link' : 'Zarejestruj')}
            </button>
          </form>

          {authMode === 'forgot_password' ? (
            <div className="mt-8 text-center text-sm">
              <button
                onClick={() => { setAuthMode('login'); setError(null); setSuccessMsg(null); }}
                className="text-gray-500 font-medium hover:text-gray-900"
              >
                Powrót do logowania
              </button>
            </div>
          ) : (
            <div className="mt-8 text-center text-sm text-gray-500">
              Nie masz jeszcze wydarzenia?{" "}
              <Link to="/create" className="text-gray-900 font-medium hover:underline">
                Utwórz je tutaj
              </Link>
            </div>
          )}
        </motion.div>

      {isVerificationModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsVerificationModalOpen(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sprawdź swoją skrzynkę e-mail</h2>
            <p className="text-gray-600 mb-4">Konto zostało pomyślnie utworzone! Wysłaliśmy link do potwierdzenia konta na Twój adres e-mail. Prosimy o sprawdzenie skrzynki i potwierdzenie konta.</p>
            <p className="text-sm text-gray-500 mb-6 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">Jeśli nie możesz znaleźć wiadomości, sprawdź również folder ze spamem.</p>
            <button 
              onClick={() => setIsVerificationModalOpen(false)}
              className="w-full bg-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-black transition-colors"
            >
              Rozumiem, zamknij
            </button>
          </div>
        </div>
      )}
  
      </div>
    </div>
  );
}
// translated