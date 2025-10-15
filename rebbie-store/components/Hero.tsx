"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CustomButton } from "@/components";
import { IoSparklesSharp, IoHeartSharp, IoStarSharp } from "react-icons/io5";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 dark:from-black dark:via-purple-900 dark:to-purple-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating beauty elements */}
        <div
          className="absolute top-20 left-10 w-8 h-8 text-pink-300 opacity-60 animate-bounce"
          style={{ animationDelay: '0s', transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        >
          <IoSparklesSharp className="w-full h-full" />
        </div>
        <div
          className="absolute top-40 right-20 w-6 h-6 text-purple-300 opacity-50 animate-bounce"
          style={{ animationDelay: '1s', transform: `translate(-${mousePosition.x}px, ${mousePosition.y}px)` }}
        >
          <IoHeartSharp className="w-full h-full" />
        </div>
        <div
          className="absolute bottom-40 left-20 w-5 h-5 text-pink-400 opacity-60 animate-bounce"
          style={{ animationDelay: '2s', transform: `translate(${mousePosition.x * 0.5}px, -${mousePosition.y}px)` }}
        >
          <IoStarSharp className="w-full h-full" />
        </div>
        <div
          className="absolute top-60 right-40 w-7 h-7 text-purple-200 opacity-40 animate-bounce"
          style={{ animationDelay: '1.5s', transform: `translate(-${mousePosition.x * 0.8}px, ${mousePosition.y * 0.6}px)` }}
        >
          <IoSparklesSharp className="w-full h-full" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>

            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <IoSparklesSharp className="w-4 h-4 text-pink-300 mr-2" />
              <span className="text-white text-sm font-medium">Nigeria's Premium Beauty Store</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Unveil Your
                <span className="block bg-gradient-to-r from-pink-300 via-purple-300 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Natural Glow
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-purple-100 font-light max-w-lg">
                Discover premium hair care, stunning jewelry, and beauty essentials crafted for the modern Nigerian woman.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/80">
              <div className="flex items-center space-x-2">
                <IoSparklesSharp className="w-5 h-5 text-pink-300" />
                <span className="text-sm">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <IoHeartSharp className="w-5 h-5 text-purple-300" />
                <span className="text-sm">Trusted by 10k+</span>
              </div>
              <div className="flex items-center space-x-2">
                <IoStarSharp className="w-5 h-5 text-pink-300" />
                <span className="text-sm">5-Star Rated</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/shop">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center">
                    Shop Collection
                    <IoSparklesSharp className="ml-2 w-5 h-5" />
                  </span>
                </button>
              </Link>

              <Link href="/about">
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  Our Story
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8 text-white/60">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10,000+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-sm">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>

            {/* Main Product Image */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse scale-110"></div>

              {/* Product grid */}
              <div className="relative grid grid-cols-2 gap-4 p-6">

                {/* Main featured product */}
                <div className="col-span-2 relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 hover:scale-105 transition-all duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      alt="Premium Beauty Collection"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="mt-4 text-center">
                      <h3 className="text-white font-semibold">Signature Collection</h3>
                      <p className="text-purple-200 text-sm">Complete Beauty Set</p>
                      <div className="mt-2 text-pink-300 font-bold">₦25,000</div>
                    </div>

                    {/* Floating discount badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
                      20% OFF
                    </div>
                  </div>
                </div>

                {/* Secondary products */}
                <div className="relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 hover:scale-105 transition-all duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Hair Care Products"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="mt-2 text-center">
                      <h4 className="text-white text-sm font-medium">Hair Care</h4>
                      <p className="text-purple-200 text-xs">Premium Line</p>
                    </div>
                  </div>
                </div>

                <div className="relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 hover:scale-105 transition-all duration-500">
                    <img
                      src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                      alt="Jewelry Collection"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="mt-2 text-center">
                      <h4 className="text-white text-sm font-medium">Jewelry</h4>
                      <p className="text-purple-200 text-xs">Luxury Pieces</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating review */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-2xl max-w-xs animate-float">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
                    alt="Customer"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Adunni K.</div>
                    <div className="flex text-yellow-400 text-xs">
                      ★★★★★
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600">&quot;Amazing quality! My skin has never looked better. Rebbie&apos;s Store is now my go-to!&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
