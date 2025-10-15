"use client";
import React, { useState } from 'react';
import { IoSparklesSharp, IoMailSharp } from "react-icons/io5";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add subscription logic here
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 relative overflow-hidden">

      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium">
              <IoSparklesSharp className="w-4 h-4 mr-2" />
              Beauty Newsletter
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Get Beauty Tips &
                <span className="block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Exclusive Deals
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Join over 10,000 Nigerian beauty enthusiasts! Get weekly beauty tips,
                early access to new products, and exclusive discounts delivered to your inbox.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                "Weekly beauty tips from certified consultants",
                "Early access to new product launches",
                "Exclusive subscriber-only discounts up to 30%",
                "Nigerian beauty trends and tutorials"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Newsletter Form */}
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-3xl"></div>

            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">

              {!isSubscribed ? (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4">
                      <IoMailSharp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Join the Beauty Community
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get your free beauty guide when you subscribe!
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-6 py-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <IoMailSharp className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
                    >
                      <span>Subscribe & Get Beauty Guide</span>
                      <IoSparklesSharp className="ml-2 w-5 h-5" />
                    </button>
                  </form>

                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                    We respect your privacy. Read our{' '}
                    <a href="/legal" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                      privacy policy
                    </a>
                    . Unsubscribe anytime.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to the Family! 💕
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Check your email for your free beauty guide and first exclusive deal!
                  </p>
                </div>
              )}
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter