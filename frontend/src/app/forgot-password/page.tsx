'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { resetPassword, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      if (error.message) {
        setError(error.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-neutral-50 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rebbie-600">
                <span className="text-lg font-bold text-white">R</span>
              </div>
              <span className="text-2xl font-bold text-neutral-900">Rebbie's Store</span>
            </Link>
            
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
              <EnvelopeIcon className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-neutral-900">
              Check your email
            </h2>
            <p className="mt-2 text-neutral-600">
              We've sent a password reset link to
            </p>
            <p className="font-medium text-neutral-900">{email}</p>
          </div>

          {/* Instructions */}
          <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="mb-2 font-semibold text-blue-900">What's next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Check your email inbox (and spam folder)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Click the reset password link in the email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Create a new password</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Sign in with your new password</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => setSuccess(false)}
              className="w-full px-4 py-3 font-medium transition-colors border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Try a different email
            </button>
            
            <Link
              href="/login"
              className="flex items-center justify-center w-full px-4 py-3 font-medium text-white transition-colors rounded-lg bg-rebbie-600 hover:bg-rebbie-700"
            >
              Back to Sign In
            </Link>
          </div>

          {/* Help */}
          <div className="pt-4 text-center border-t border-neutral-200">
            <p className="mb-4 text-sm text-neutral-600">
              Didn't receive the email?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm transition-colors border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                {loading ? 'Sending...' : 'Resend Email'}
              </button>
              <a
                href="https://wa.me/2349023821968?text=Hello%20Rebbie's%20Store!%20I%20need%20help%20resetting%20my%20password."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 text-sm transition-colors border rounded-lg border-nigeria-whatsapp text-nigeria-whatsapp hover:bg-green-50"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-neutral-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rebbie-600">
              <span className="text-lg font-bold text-white">R</span>
            </div>
            <span className="text-2xl font-bold text-neutral-900">Rebbie's Store</span>
          </Link>
          
          <h2 className="text-3xl font-bold text-neutral-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-neutral-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Reset Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-neutral-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 transition-colors border rounded-lg border-neutral-300 focus:ring-2 focus:ring-rebbie-500 focus:border-rebbie-500"
              placeholder="Enter your email address"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white transition-colors border border-transparent rounded-lg bg-rebbie-600 hover:bg-rebbie-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rebbie-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending reset email...
              </>
            ) : (
              'Send Reset Email'
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-medium transition-colors text-rebbie-600 hover:text-rebbie-500"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>

        {/* Help Section */}
        <div className="pt-6 border-t border-neutral-200">
          <div className="text-center">
            <p className="mb-4 text-sm text-neutral-600">
              Need immediate assistance?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/register"
                className="flex items-center justify-center px-4 py-2 transition-colors border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Create Account
              </Link>
              <a
                href="https://wa.me/2349023821968?text=Hello%20Rebbie's%20Store!%20I%20need%20help%20with%20password%20reset."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 transition-colors border rounded-lg border-nigeria-whatsapp text-nigeria-whatsapp hover:bg-green-50"
              >
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-4 border rounded-lg bg-neutral-50 border-neutral-200">
          <h3 className="mb-2 font-semibold text-neutral-900">Security Notice</h3>
          <p className="text-sm text-neutral-600">
            For your security, password reset links expire after 1 hour. If you don't receive the email within a few minutes, please check your spam folder or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;