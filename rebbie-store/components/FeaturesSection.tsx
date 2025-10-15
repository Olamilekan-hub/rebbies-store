"use client";
import React from "react";
import { IoShieldCheckmarkSharp, IoRocketSharp, IoHeartSharp, IoSparklesSharp } from "react-icons/io5";

const FeaturesSection = () => {
  const features = [
    {
      icon: <IoSparklesSharp className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Sourced from trusted Nigerian and international suppliers, ensuring authentic beauty products for your skincare and hair care needs.",
      color: "from-pink-500 to-purple-600"
    },
    {
      icon: <IoRocketSharp className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Same-day delivery in Lagos, next-day delivery nationwide. Your beauty essentials delivered when you need them most.",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <IoShieldCheckmarkSharp className="w-8 h-8" />,
      title: "100% Authentic",
      description: "Every product comes with authenticity guarantee. No fake products, just genuine beauty solutions that work.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: <IoHeartSharp className="w-8 h-8" />,
      title: "Made for Nigerian Skin",
      description: "Specially curated collection that works for African skin tones and hair textures. Beauty that celebrates you.",
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Rebbie's Store</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're committed to bringing you the finest beauty products with exceptional service.
            Your glow is our passion, your satisfaction is our promise.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>

              {/* Icon */}
              <div className={`relative mb-6 w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <IoSparklesSharp className="w-5 h-5 mr-2" />
            Experience the Rebbie's Difference
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;