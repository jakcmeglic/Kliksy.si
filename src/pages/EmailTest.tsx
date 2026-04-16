import React, { useState } from 'react';
import { Loader2, Mail, Check, AlertCircle } from 'lucide-react';

export default function EmailTest() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const sendTestEmail = async () => {
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'ancisinigoj@gmail.com', 
          displayName: 'Testni Uporabnik' 
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage('Email je bil uspešno poslan na ancisinigoj@gmail.com!');
      } else {
        setStatus('error');
        setMessage(data.message || 'Napaka pri pošiljanju. Preverite SMTP nastavitve.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Prišlo je do napake pri povezavi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Test pošiljanja e-pošte</h1>
        <p className="text-gray-600 mb-8">
          S klikom na spodnji gumb boste poslali testni welcome email na <strong>ancisinigoj@gmail.com</strong>.
        </p>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-left">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        <button
          onClick={sendTestEmail}
          disabled={status === 'loading'}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Pošiljam...
            </>
          ) : (
            'Pošlji testni email'
          )}
        </button>
      </div>
    </div>
  );
}
