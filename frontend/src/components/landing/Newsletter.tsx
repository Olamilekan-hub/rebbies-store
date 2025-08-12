'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  EnvelopeIcon, 
  GiftIcon, 
  SparklesIcon,
  CheckCircleIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface NewsletterProps {
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({ className }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    earlyAccess: true,
    weeklyDeals: true,
    styleGuides: false,
    smsUpdates: false
  });

  const benefits = [
    {
      icon: <GiftIcon className="w-6 h-6" />,
      title: "Exclusive Discounts",
      description: "Get 15% off your first purchase + early access to sales"
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "New Arrivals First",
      description: "Be the first to see new collections and limited items"
    },
    {
      icon: <EnvelopeIcon className="w-6 h-6" />,
      title: "Style Insights",
      description: "Weekly style guides and fashion tips from our experts"
    },
    {
      icon: <PhoneIcon className="w-6 h-6" />,
      title: "WhatsApp Updates",
      description: "Optional SMS alerts for flash sales and restocks"
    }
  ];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      // In production, integrate with email service (Mailchimp, ConvertKit, etc.)
    }, 2000);
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isSubscribed) {
    return (
      <section className={clsx('py-20 bg-gradient-primary', className)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/20">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to the Family! 🎉
            </h2>
            
            <p className="text-xl text-rebbie-100 mb-8">
              You're now part of our exclusive community. Check your email for your 15% discount code!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🎁</div>
                <div className="text-white font-medium">15% Off</div>
                <div className="text-rebbie-200 text-sm">First Purchase</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-white font-medium">Early Access</div>
                <div className="text-rebbie-200 text-sm">New Collections</div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-white font-medium">VIP Support</div>
                <div className="text-rebbie-200 text-sm">WhatsApp Priority</div>
              </div>
            </div>
            
            <div className="mt-8">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = '/products'}
              >
                Start Shopping Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={clsx('py-20 bg-gradient-primary relative overflow-hidden', className)}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full animate-float" />
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-white rounded-full animate-bounce-gentle" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <EnvelopeIcon className="w-4 h-4" />
              Join Our Community
            </div>
            
            <h2 className="text-display-md font-bold mb-6">
              Stay in the Loop with
              <span className="text-rebbie-200"> Exclusive Perks</span>
            </h2>
            
            <p className="text-xl text-rebbie-100 mb-8 leading-relaxed">
              Join over 5,000 Nigerian fashion lovers getting exclusive access to new arrivals, 
              flash sales, and style insights. Plus, get 15% off your first purchase!
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-sm text-rebbie-200">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-rebbie-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GiftIcon className="w-8 h-8 text-rebbie-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                Get 15% Off Your First Order
              </h3>
              
              <p className="text-neutral-600">
                Subscribe to our newsletter and never miss a deal
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-6">
              
              {/* Email Input */}
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                required
                size="lg"
              />

              {/* Phone Input (Optional) */}
              <Input
                type="tel"
                label="Phone Number (Optional)"
                placeholder="+234-XXX-XXX-XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<PhoneIcon className="w-5 h-5" />}
                nigerianPhone
                hint="For exclusive WhatsApp deals"
                size="lg"
              />

              {/* Preferences */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  What would you like to receive?
                </label>
                
                <div className="space-y-3">
                  {[
                    { key: 'earlyAccess', label: 'Early access to new collections', recommended: true },
                    { key: 'weeklyDeals', label: 'Weekly deals and discounts', recommended: true },
                    { key: 'styleGuides', label: 'Style guides and fashion tips' },
                    { key: 'smsUpdates', label: 'SMS updates for flash sales' }
                  ].map((pref) => (
                    <label key={pref.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[pref.key as keyof typeof preferences]}
                        onChange={() => handlePreferenceChange(pref.key as keyof typeof preferences)}
                        className="rounded border-neutral-300 text-rebbie-600 focus:ring-rebbie-500"
                      />
                      <span className="text-sm text-neutral-700">
                        {pref.label}
                        {pref.recommended && (
                          <span className="ml-2 bg-rebbie-100 text-rebbie-800 text-xs px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subscribe Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={!email}
                rightIcon={<GiftIcon className="w-5 h-5" />}
              >
                {isLoading ? 'Subscribing...' : 'Get My 15% Discount'}
              </Button>

              {/* Privacy Note */}
              <p className="text-xs text-neutral-500 text-center">
                We respect your privacy. Unsubscribe at any time. 
                <br />
                By subscribing, you agree to our{' '}
                <a href="/privacy" className="text-rebbie-600 hover:underline">
                  Privacy Policy
                </a>
                {' '}and{' '}
                <a href="/terms" className="text-rebbie-600 hover:underline">
                  Terms of Service
                </a>
                .
              </p>
            </form>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 inline-block">
            <div className="flex items-center justify-center gap-8 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">5,000+</div>
                <div className="text-rebbie-200 text-sm">Subscribers</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-2xl font-bold">15%</div>
                <div className="text-rebbie-200 text-sm">Welcome Discount</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-2xl font-bold">4.9⭐</div>
                <div className="text-rebbie-200 text-sm">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;