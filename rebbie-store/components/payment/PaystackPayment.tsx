"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaystackPaymentProps {
  email: string;
  amount: number;
  currency?: string;
  onSuccess?: (reference: string) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (options: any) => {
        openIframe: () => void;
      };
    };
  }
}

const PaystackPayment: React.FC<PaystackPaymentProps> = ({
  email,
  amount,
  currency = 'NGN',
  onSuccess,
  onError,
  onClose,
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const initializePayment = async () => {
    setIsLoading(true);
    try {
      // Initialize payment with our API
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount,
          currency,
          callback_url: `${window.location.origin}/checkout/success`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      // Load Paystack script if not already loaded
      if (!window.PaystackPop) {
        await loadPaystackScript();
      }

      // Configure Paystack popup
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: Math.round(amount * 100), // Convert to kobo
        currency: currency,
        ref: data.data.reference,
        callback: function(response: any) {
          setIsProcessing(true);
          verifyPayment(response.reference);
        },
        onClose: function() {
          setIsLoading(false);
          setIsProcessing(false);
          if (onClose) onClose();
        }
      });

      // Open the payment modal
      handler.openIframe();

    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Payment initialization failed';
      console.error('Payment initialization error:', errorMessage);
      if (onError) onError(errorMessage);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/paystack/verify?reference=${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      if (data.data.status === 'success') {
        if (onSuccess) onSuccess(reference);
        router.push(`/checkout/success?reference=${reference}`);
      } else {
        throw new Error('Payment was not successful');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
      console.error('Payment verification error:', errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const loadPaystackScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paystack-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'paystack-script';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.head.appendChild(script);
    });
  };

  return (
    <button
      onClick={initializePayment}
      disabled={isLoading || isProcessing || !email || !amount}
      className={`
        relative flex items-center justify-center w-full py-4 px-6
        bg-purple-600 hover:bg-purple-700
        text-white font-semibold text-lg rounded-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${className}
      `}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {isProcessing && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      <span>
        {isLoading
          ? 'Initializing Payment...'
          : isProcessing
          ? 'Processing Payment...'
          : children || `Pay ₦${amount.toLocaleString()}`}
      </span>
    </button>
  );
};

export default PaystackPayment;