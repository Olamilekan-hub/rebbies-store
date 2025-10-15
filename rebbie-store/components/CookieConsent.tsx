"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCookie, FaTimes, FaCog } from 'react-icons/fa';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        applyCookieSettings(savedPreferences);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const applyCookieSettings = (cookiePreferences: CookiePreferences) => {
    // Apply analytics cookies
    if (cookiePreferences.analytics) {
      // Enable Google Analytics or other analytics tools
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    // Apply marketing cookies
    if (cookiePreferences.marketing) {
      // Enable marketing tracking
      enableMarketing();
    } else {
      disableMarketing();
    }

    // Apply preference cookies
    if (cookiePreferences.preferences) {
      // Enable preference tracking
      enablePreferences();
    } else {
      disablePreferences();
    }

    // Essential cookies are always enabled
    enableEssential();
  };

  const enableAnalytics = () => {
    // Implementation for enabling analytics
    document.cookie = "analytics_enabled=true; path=/; max-age=31536000"; // 1 year
    console.log('Analytics cookies enabled');
  };

  const disableAnalytics = () => {
    // Remove analytics cookies
    document.cookie = "analytics_enabled=; path=/; max-age=0";
    console.log('Analytics cookies disabled');
  };

  const enableMarketing = () => {
    // Implementation for enabling marketing cookies
    document.cookie = "marketing_enabled=true; path=/; max-age=31536000"; // 1 year
    console.log('Marketing cookies enabled');
  };

  const disableMarketing = () => {
    // Remove marketing cookies
    document.cookie = "marketing_enabled=; path=/; max-age=0";
    console.log('Marketing cookies disabled');
  };

  const enablePreferences = () => {
    // Implementation for enabling preference cookies
    document.cookie = "preferences_enabled=true; path=/; max-age=31536000"; // 1 year
    console.log('Preference cookies enabled');
  };

  const disablePreferences = () => {
    // Remove preference cookies
    document.cookie = "preferences_enabled=; path=/; max-age=0";
    console.log('Preference cookies disabled');
  };

  const enableEssential = () => {
    // Essential cookies are always enabled
    document.cookie = "essential_enabled=true; path=/; max-age=31536000"; // 1 year
    console.log('Essential cookies enabled');
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    applyCookieSettings(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    setPreferences(onlyEssential);
    localStorage.setItem('cookie-consent', JSON.stringify(onlyEssential));
    applyCookieSettings(onlyEssential);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    applyCookieSettings(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'essential') return; // Can't disable essential cookies

    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 transform translate-y-0">
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {!showSettings ? (
              /* Basic Cookie Notice */
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <FaCookie className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      We use cookies to enhance your experience
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      We use essential cookies to make our site work. We'd also like to set optional cookies
                      to help us improve our website and show you relevant content. You can choose which
                      cookies to accept below, or{' '}
                      <Link
                        href="/legal"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                        target="_blank"
                      >
                        learn more about our cookie policy
                      </Link>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 lg:flex-shrink-0">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                  >
                    <FaCog className="mr-2" />
                    Customize
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            ) : (
              /* Detailed Cookie Settings */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Cookie Preferences
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Essential Cookies */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Essential Cookies
                      </h4>
                      <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded text-xs font-medium">
                        Always Active
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Required for the website to function properly. These include shopping cart,
                      user authentication, and security features.
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Analytics Cookies
                      </h4>
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          preferences.analytics ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Help us understand how visitors use our site to improve performance and user experience.
                    </p>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Marketing Cookies
                      </h4>
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          preferences.marketing ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Used to show relevant advertisements and track the effectiveness of our marketing campaigns.
                    </p>
                  </div>

                  {/* Preference Cookies */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Preference Cookies
                      </h4>
                      <button
                        onClick={() => handlePreferenceChange('preferences')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          preferences.preferences ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            preferences.preferences ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Remember your choices like language, currency, and theme preferences for a personalized experience.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleRejectAll}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;