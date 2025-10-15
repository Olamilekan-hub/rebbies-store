"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaShieldAlt, FaFileContract, FaCookie, FaArrowLeft } from 'react-icons/fa';

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  const lastUpdated = "September 21, 2024";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Legal Information
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Privacy Policy, Terms of Service, and Cookie Policy
              </p>
            </div>
            <Link
              href="/"
              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-200"
            >
              <FaArrowLeft />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                    activeTab === 'privacy'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaShieldAlt />
                  <span>Privacy Policy</span>
                </button>
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                    activeTab === 'terms'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaFileContract />
                  <span>Terms of Service</span>
                </button>
                <button
                  onClick={() => setActiveTab('cookies')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                    activeTab === 'cookies'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaCookie />
                  <span>Cookie Policy</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              {/* Privacy Policy */}
              {activeTab === 'privacy' && (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="flex items-center space-x-3 mb-6">
                    <FaShieldAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Privacy Policy</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Last updated: {lastUpdated}
                  </p>

                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Information We Collect
                      </h3>
                      <p className="mb-4">
                        At Rebbie&apos;s Store, we collect information to provide better services to our customers. We collect:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
                        <li><strong>Payment Information:</strong> Processed securely through Paystack (we don&apos;t store card details)</li>
                        <li><strong>Order Information:</strong> Purchase history, preferences, and order tracking data</li>
                        <li><strong>Technical Information:</strong> IP address, browser type, device information for security and analytics</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        How We Use Your Information
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Process and fulfill your orders</li>
                        <li>Communicate about your orders and account</li>
                        <li>Provide customer support</li>
                        <li>Improve our products and services</li>
                        <li>Send promotional emails (with your consent)</li>
                        <li>Prevent fraud and ensure security</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Information Sharing
                      </h3>
                      <p className="mb-4">
                        We do not sell, trade, or rent your personal information. We may share information with:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Payment Processors:</strong> Paystack for secure payment processing</li>
                        <li><strong>Shipping Partners:</strong> For order delivery within Nigeria</li>
                        <li><strong>Legal Requirements:</strong> When required by Nigerian law or to protect our rights</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Data Security
                      </h3>
                      <p>
                        We implement strong security measures to protect your personal information, including encryption,
                        secure servers, and regular security audits. However, no internet transmission is 100% secure.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Your Rights
                      </h3>
                      <p className="mb-4">Under Nigerian data protection laws, you have the right to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate information</li>
                        <li>Delete your account and data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Data portability</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Contact Us
                      </h3>
                      <p>
                        For privacy-related questions, contact us at{' '}
                        <a href="mailto:privacy@rebbiestore.com" className="text-purple-600 dark:text-purple-400 hover:underline">
                          privacy@rebbiestore.com
                        </a>
                      </p>
                    </section>
                  </div>
                </div>
              )}

              {/* Terms of Service */}
              {activeTab === 'terms' && (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="flex items-center space-x-3 mb-6">
                    <FaFileContract className="text-purple-600 dark:text-purple-400 text-xl" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Terms of Service</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Last updated: {lastUpdated}
                  </p>

                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Acceptance of Terms
                      </h3>
                      <p>
                        By accessing and using Rebbie&apos;s Store, you accept and agree to be bound by these Terms of Service.
                        If you do not agree to these terms, please do not use our services.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Products and Services
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>We sell authentic hair and jewelry products</li>
                        <li>Product descriptions and images are as accurate as possible</li>
                        <li>Prices are in Nigerian Naira (₦) and include applicable taxes</li>
                        <li>We reserve the right to modify prices and availability</li>
                        <li>All sales are subject to product availability</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Ordering and Payment
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Orders are confirmed upon successful payment processing</li>
                        <li>Payment is processed securely through Paystack</li>
                        <li>We accept major Nigerian payment methods including bank transfers and cards</li>
                        <li>Order confirmation will be sent to your email address</li>
                        <li>We reserve the right to cancel orders for various reasons</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Shipping and Delivery
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>We ship within Nigeria with varying delivery times based on location</li>
                        <li>Lagos deliveries: 1-2 business days</li>
                        <li>Other Nigerian cities: 2-5 business days</li>
                        <li>International shipping available on request</li>
                        <li>Shipping costs are calculated at checkout</li>
                        <li>Risk of loss passes to customer upon delivery</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Returns and Refunds
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Returns accepted within 14 days of delivery</li>
                        <li>Items must be in original condition with tags attached</li>
                        <li>Customer pays return shipping costs unless item is defective</li>
                        <li>Refunds processed within 5-10 business days</li>
                        <li>Custom or personalized items are not returnable</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        User Conduct
                      </h3>
                      <p className="mb-4">You agree not to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Use the site for any illegal purposes</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Upload malicious code or interfere with site functionality</li>
                        <li>Create false accounts or provide inaccurate information</li>
                        <li>Violate any applicable Nigerian laws or regulations</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Limitation of Liability
                      </h3>
                      <p>
                        Rebbie&apos;s Store shall not be liable for any indirect, incidental, special, or consequential damages.
                        Our total liability is limited to the amount you paid for the product in question.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Governing Law
                      </h3>
                      <p>
                        These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes will be
                        resolved in Nigerian courts.
                      </p>
                    </section>
                  </div>
                </div>
              )}

              {/* Cookie Policy */}
              {activeTab === 'cookies' && (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="flex items-center space-x-3 mb-6">
                    <FaCookie className="text-purple-600 dark:text-purple-400 text-xl" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Cookie Policy</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    Last updated: {lastUpdated}
                  </p>

                  <div className="space-y-6 text-gray-700 dark:text-gray-300">
                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        What Are Cookies?
                      </h3>
                      <p>
                        Cookies are small text files stored on your device when you visit our website. They help us
                        provide you with a better browsing experience and allow certain features to function properly.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Types of Cookies We Use
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Essential Cookies</h4>
                          <p>Required for the website to function properly. These include:</p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Shopping cart functionality</li>
                            <li>User authentication and login sessions</li>
                            <li>Security and fraud prevention</li>
                            <li>Form submission and validation</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Preference Cookies</h4>
                          <p>Remember your choices and preferences such as:</p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Language and region settings</li>
                            <li>Dark/light mode preference</li>
                            <li>Currency display preferences</li>
                            <li>Previous search and filter selections</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</h4>
                          <p>Help us understand how visitors use our site:</p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Page visit statistics</li>
                            <li>User behavior patterns</li>
                            <li>Performance monitoring</li>
                            <li>Error tracking and debugging</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Marketing Cookies</h4>
                          <p>Used to show relevant advertisements and track campaign effectiveness:</p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Social media integration</li>
                            <li>Targeted advertising</li>
                            <li>Conversion tracking</li>
                            <li>Email marketing optimization</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Third-Party Cookies
                      </h3>
                      <p className="mb-4">We use third-party services that may set their own cookies:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Paystack:</strong> For secure payment processing</li>
                        <li><strong>Google Analytics:</strong> For website analytics and insights</li>
                        <li><strong>Social Media Platforms:</strong> For social sharing functionality</li>
                        <li><strong>Customer Support:</strong> For chat and support features</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Managing Your Cookie Preferences
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Browser Settings</h4>
                          <p>You can control cookies through your browser settings:</p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Block all cookies</li>
                            <li>Block third-party cookies only</li>
                            <li>Delete existing cookies</li>
                            <li>Set preferences for specific websites</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Cookie Consent Banner</h4>
                          <p>
                            When you first visit our site, you&apos;ll see a cookie consent banner where you can:
                          </p>
                          <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Accept all cookies</li>
                            <li>Reject non-essential cookies</li>
                            <li>Customize your cookie preferences</li>
                            <li>Learn more about each cookie type</li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Cookie Retention
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                        <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 1-2 years)</li>
                        <li><strong>Essential Cookies:</strong> Kept only as long as necessary for functionality</li>
                        <li><strong>Analytics Cookies:</strong> Typically stored for 1-2 years</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Impact of Blocking Cookies
                      </h3>
                      <p className="mb-4">
                        While you can block cookies, this may affect your experience:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Shopping cart may not work properly</li>
                        <li>You may need to log in repeatedly</li>
                        <li>Preferences won't be remembered</li>
                        <li>Some features may not function correctly</li>
                        <li>Website performance may be impacted</li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Updates to This Policy
                      </h3>
                      <p>
                        We may update this Cookie Policy periodically. Changes will be posted on this page with an
                        updated &quot;Last Modified&quot; date. Continued use of our website after changes constitutes acceptance
                        of the updated policy.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Contact Us
                      </h3>
                      <p>
                        If you have questions about our cookie practices, contact us at{' '}
                        <a href="mailto:cookies@rebbiestore.com" className="text-purple-600 dark:text-purple-400 hover:underline">
                          cookies@rebbiestore.com
                        </a>
                      </p>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;