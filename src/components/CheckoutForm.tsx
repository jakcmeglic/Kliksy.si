import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Check, Loader2 } from 'lucide-react';

export default function CheckoutForm({ amount, onSuccess, isProcessing, setIsProcessing }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Prišlo je do napake pri plačilu.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <PaymentElement />
      {errorMessage && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{errorMessage}</div>}
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 flex justify-center">
        <div className="w-full max-w-xl">
          <button 
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Obdelujem...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Plačaj <Check className="w-5 h-5" />
              </span>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
            Varno plačilo zagotavlja Stripe
          </p>
        </div>
      </div>
    </form>
  );
}
