"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

interface PaymentData {
  reference: string;
  amount: number;
  currency: string;
  status: string;
  customer: {
    email: string;
  };
  paid_at: string;
}

const CheckoutSuccess = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!reference) {
      setError('No payment reference found');
      setIsLoading(false);
      return;
    }

    verifyPayment(reference);
  }, [reference]);

  const verifyPayment = async (paymentReference: string) => {
    try {
      const response = await fetch(`/api/paystack/verify?reference=${paymentReference}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      if (data.data.status === 'success') {
        setPaymentData(data.data);
      } else {
        setError('Payment was not successful');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment verification failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verifying Payment...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <FaExclamationTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {error}
          </p>
          <div className="space-y-4">
            <Link
              href="/checkout"
              className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 text-center">
          <FaCheckCircle className="h-20 w-20 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-purple-100">
            Thank you for your purchase from Rebbie's Store
          </p>
        </div>

        <div className="p-8">
          {paymentData && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Payment Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                    <p className="font-medium text-gray-900 dark:text-white break-all">
                      {paymentData.reference}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ₦{(paymentData.amount / 100).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <p className="font-medium text-gray-900 dark:text-white break-all">
                      {paymentData.customer.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(paymentData.paid_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      What happens next?
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      You will receive an email confirmation shortly. Your order will be processed and shipped within 2-3 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <Link
              href="/account"
              className="block w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-purple-700 transition-colors duration-200"
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;