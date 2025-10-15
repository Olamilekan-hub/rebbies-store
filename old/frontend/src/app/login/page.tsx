'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

// Create a separate component for the login form that uses useSearchParams
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, user, error: authError, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    // Check for success messages from other pages
    const message = searchParams.get('message');
    if (message === 'password-reset-sent') {
      setSuccess('Password reset email sent! Check your inbox.');
    } else if (message === 'verification-sent') {
      setSuccess('Verification email sent! Please check your inbox.');
    } else if (message === 'registration-success') {
      setSuccess('Registration successful! Please verify your email address.');
    }

    // Load remembered email
    const rememberedEmail = localStorage.getItem('remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError('');
    setSuccess('');
    clearError(); // Clear auth context errors

    try {
      await login(email, password);
      
      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      
      router.push(redirectTo);
    } catch (error: any) {
      // Error is already handled in AuthContext and displayed via authError
      // Just stop loading
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Message */}
      {success && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {authError && (
        <ErrorAlert 
          message={authError.message}
          type={authError.type}
          action={authError.action}
          onClose={clearError}
          className="mb-4"
        />
      )}

      {/* Local Error Message (fallback) */}
      {localError && !authError && (
        <ErrorAlert 
          message={localError}
          type="error"
          onClose={() => setLocalError('')}
          className="mb-4"
        />
      )}

      {/* Login Form */}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">
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
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 transition-colors border rounded-lg border-neutral-300 focus:ring-2 focus:ring-rebbie-500 focus:border-rebbie-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transform -translate-y-1/2 right-3 top-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-5 rounded text-rebbie-600 focus:ring-rebbie-500 border-neutral-300"
            />
            <label htmlFor="remember-me" className="block ml-2 text-sm text-neutral-700">
              Remember me
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-rebbie-600 hover:text-rebbie-500"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
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
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </>
  );
};

// Loading fallback component
const LoginFormFallback = () => (
  <div className="mt-8 space-y-6">
    <div className="space-y-4">
      <div>
        <div className="block mb-2 text-sm font-medium text-neutral-700">
          Email address
        </div>
        <div className="w-full h-12 rounded-lg bg-neutral-200 animate-pulse" />
      </div>
      <div>
        <div className="block mb-2 text-sm font-medium text-neutral-700">
          Password
        </div>
        <div className="w-full h-12 rounded-lg bg-neutral-200 animate-pulse" />
      </div>
    </div>
    <div className="w-full h-12 rounded-lg bg-neutral-200 animate-pulse" />
  </div>
);

const LoginPage: React.FC = () => {
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
            Welcome back
          </h2>
          <p className="mt-2 text-neutral-600">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Wrap the form component in Suspense */}
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-neutral-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium transition-colors text-rebbie-600 hover:text-rebbie-500"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-neutral-200">
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/products"
              className="flex items-center justify-center px-4 py-2 transition-colors border rounded-lg border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Continue Shopping
            </Link>
            <a
              href="https://wa.me/2349023821968?text=Hello%20Rebbie's%20Store!%20I%20need%20help%20with%20my%20account."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-2 transition-colors border rounded-lg border-nigeria-whatsapp text-nigeria-whatsapp hover:bg-green-50"
            >
              Need Help?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;