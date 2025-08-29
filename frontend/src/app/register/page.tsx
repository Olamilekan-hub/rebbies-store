'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    // Calculate password strength
    const strength = passwordRequirements.reduce((acc, req) => {
      return acc + (req.test(formData.password) ? 1 : 0);
    }, 0);
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (passwordStrength < 4) {
      setError('Password does not meet security requirements');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      
      // Registration successful, redirect to dashboard or home
      router.push('/');
    } catch (error: any) {
      if (error.message) {
        setError(error.message);
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

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
            Create your account
          </h2>
          <p className="mt-2 text-neutral-600">
            Join thousands of satisfied customers
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-neutral-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-black transition-colors border rounded-lg border-neutral-300 focus:ring-2 focus:ring-rebbie-500 focus:border-rebbie-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-neutral-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-black transition-colors border rounded-lg border-neutral-300 focus:ring-2 focus:ring-rebbie-500 focus:border-rebbie-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email */}
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
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-black transition-colors border rounded-lg border-neutral-300 focus:ring-2 focus:ring-rebbie-500 focus:border-rebbie-500"
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 text-black transition-colors border rounded-lg border-neutral-300 focus:ring-2 focus:ring-rebbie-500 focus:border-rebbie-500"
                  placeholder="Create a password"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 rounded-full bg-neutral-200">
                      <div
                        className={`h-2 rounded-full transition-all ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / passwordRequirements.length) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength <= 2 ? 'text-red-600' :
                      passwordStrength <= 3 ? 'text-yellow-600' :
                      passwordStrength <= 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>

                  {/* Password Requirements */}
                  <div className="space-y-1">
                    {passwordRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-black">
                        {requirement.test(formData.password) ? (
                          <CheckIcon className="w-3 h-3 text-green-500" />
                        ) : (
                          <XMarkIcon className="w-3 h-3 text-neutral-400" />
                        )}
                        <span className={requirement.test(formData.password) ? 'text-green-600' : 'text-neutral-500'}>
                          {requirement.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-black">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-rebbie-500 transition-colors text-black ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-neutral-300 focus:border-rebbie-500'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute transform -translate-y-1/2 right-3 top-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-rebbie-600 focus:ring-rebbie-500 border-neutral-300"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-neutral-700">
                I agree to the{' '}
                <Link href="/terms" className="underline text-rebbie-600 hover:text-rebbie-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline text-rebbie-600 hover:text-rebbie-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Newsletter Opt-in */}
            <div className="flex items-start">
              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                className="w-4 h-4 mt-1 rounded text-rebbie-600 focus:ring-rebbie-500 border-neutral-300"
              />
              <label htmlFor="newsletter" className="ml-2 text-sm text-neutral-700">
                Subscribe to our newsletter for exclusive offers and new arrivals
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !agreedToTerms}
            className="flex items-center justify-center w-full px-4 py-3 text-base font-medium text-white transition-colors border border-transparent rounded-lg bg-rebbie-600 hover:bg-rebbie-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rebbie-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-neutral-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium transition-colors text-rebbie-600 hover:text-rebbie-500"
            >
              Sign in here
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
              href="https://wa.me/2349023821968?text=Hello%20Rebbie's%20Store!%20I%20need%20help%20creating%20an%20account."
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

export default RegisterPage;