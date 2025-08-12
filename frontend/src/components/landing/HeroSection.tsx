'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRightIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface HeroProduct {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  category: string;
}

interface HeroSectionProps {
  featuredProduct?: HeroProduct;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProduct,
  className,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Sample hero content - in production, this would come from CMS/API
  const heroSlides = [
    {
      id: 1,
      title: "Nigeria's Premier Fashion Destination",
      subtitle: "Discover luxury fashion bags, stunning jewelry & premium fragrances",
      description: "From authentic thrift pieces to brand new designer collections",
      ctaText: "Explore Collection",
      ctaLink: "/products",
      secondaryCtaText: "Watch Story",
      backgroundImage: "/hero-bg-1.jpg", // Placeholder
      accentText: "Trusted by 10,000+ Nigerians",
      stats: [
        { label: "Products", value: "500+" },
        { label: "Happy Customers", value: "10K+" },
        { label: "States Covered", value: "36" },
      ]
    },
    {
      id: 2,
      title: "Authentic Thrift Collection",
      subtitle: "Sustainable luxury fashion that tells a story",
      description: "Pre-owned designer bags and jewelry with authenticity certificates",
      ctaText: "Shop Thrift",
      ctaLink: "/products/category/thrift-fashion-bags",
      secondaryCtaText: "Learn More",
      backgroundImage: "/hero-bg-2.jpg", // Placeholder
      accentText: "Eco-friendly • Authentic • Affordable",
      badge: "♻️ Sustainable Choice"
    },
    {
      id: 3,
      title: "Same-Day Delivery in Lagos",
      subtitle: "Get your favorites delivered within hours",
      description: "Order before 3PM and receive your items the same day across Lagos",
      ctaText: "Order Now",
      ctaLink: "/products",
      secondaryCtaText: "Delivery Info",
      backgroundImage: "/hero-bg-3.jpg", // Placeholder
      accentText: "🚚 Fast • Reliable • Secure",
      badge: "Lagos Express"
    }
  ];

  const currentHero = heroSlides[currentSlide];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Sample featured product (would come from API)
  const defaultFeaturedProduct: HeroProduct = {
    id: "1",
    name: "Vintage Chanel Quilted Handbag",
    price: "450,000",
    originalPrice: "580,000",
    image: "/featured-product.jpg", // Placeholder
    badge: "Limited Edition",
    category: "Thrift Fashion Bags"
  };

  const product = featuredProduct || defaultFeaturedProduct;

  return (
    <section className={clsx(
      'relative min-h-screen bg-gradient-to-br from-rebbie-900 via-rebbie-800 to-neutral-900',
      'overflow-hidden',
      className
    )}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-10" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-rebbie-400 rounded-full animate-pulse-slow" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent-gold rounded-full animate-float" />
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-rebbie-300 rounded-full animate-bounce-gentle" />
        </div>
        
        {/* Mesh Gradient */}
        <div className="absolute inset-0 bg-mesh-purple opacity-20" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Content */}
          <div className="text-white space-y-8 animate-fade-in-up">
            {/* Badge */}
            {currentHero.badge && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium">
                <SparklesIcon className="w-4 h-4" />
                {currentHero.badge}
              </div>
            )}

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-display-xl font-bold leading-tight text-white">
                {currentHero.title.split(' ').map((word, index) => (
                  <span key={index} className={clsx(
                    index === 0 ? 'text-rebbie-400' : 'text-white'
                  )}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              
              <p className="text-xl lg:text-2xl text-rebbie-100 font-light leading-relaxed">
                {currentHero.subtitle}
              </p>
              
              <p className="text-lg text-neutral-300 leading-relaxed max-w-lg">
                {currentHero.description}
              </p>
            </div>

            {/* Stats */}
            {currentHero.stats && (
              <div className="flex flex-wrap gap-6">
                {currentHero.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-rebbie-400">{stat.value}</div>
                    <div className="text-sm text-neutral-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={currentHero.ctaLink}>
                <Button
                  size="lg"
                  className="group"
                  rightIcon={
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  }
                >
                  {currentHero.ctaText}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => setIsVideoPlaying(true)}
                leftIcon={<PlayIcon className="w-5 h-5" />}
                className="text-white border-white/30 hover:bg-white/10"
              >
                {currentHero.secondaryCtaText}
              </Button>
            </div>

            {/* Accent Text */}
            <p className="text-sm text-rebbie-200 font-medium">
              {currentHero.accentText}
            </p>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-br from-rebbie-400 to-rebbie-600 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-sm text-neutral-300">
                <span className="text-rebbie-400 font-semibold">4.9/5</span> from 2,500+ reviews
              </div>
            </div>
          </div>

          {/* Right Content - Featured Product */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Product Showcase */}
            <div className="relative">
              {/* Main Product Card */}
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl">
                {/* Product Badge */}
                <div className="absolute -top-3 left-6 bg-accent-coral text-white text-sm font-medium px-3 py-1 rounded-full">
                  {product.badge}
                </div>

                {/* Product Image */}
                <div className="aspect-square bg-white rounded-2xl mb-6 overflow-hidden relative group">
                  {/* Placeholder for product image */}
                  <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <div className="text-center text-neutral-400">
                      <div className="text-6xl mb-2">👜</div>
                      <div className="text-sm">Featured Product</div>
                    </div>
                  </div>
                  
                  {/* Quick Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50">
                      <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50">
                      <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="text-white space-y-3">
                  <div className="text-sm text-rebbie-200 font-medium">
                    {product.category}
                  </div>
                  
                  <h3 className="text-xl font-semibold line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-rebbie-400 price-naira">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-neutral-400 line-through price-naira">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    className="mt-4"
                  >
                    View Details
                  </Button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-accent-gold rounded-full flex items-center justify-center text-white font-bold text-sm animate-bounce-gentle">
                HOT
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <div className="text-white text-center">
                  <div className="text-lg font-bold">500+</div>
                  <div className="text-xs text-neutral-300">In Stock</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={clsx(
                'w-3 h-3 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'bg-rebbie-400 w-8'
                  : 'bg-white/30 hover:bg-white/50'
              )}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce-gentle">
        <div className="text-white/60 text-center">
          <div className="text-xs mb-2">Scroll to explore</div>
          <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* WhatsApp Quick Contact */}
      <div className="absolute bottom-20 right-4 lg:right-8 z-30">
        <a
          href="https://wa.me/2348065776378?text=Hello%20Rebbie's%20Store!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-nigeria-whatsapp text-white rounded-full py-3 px-4 shadow-lg hover:scale-105 transition-transform animate-whatsapp-pulse"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
          </svg>
          <span className="hidden lg:inline text-sm font-medium">Chat with us</span>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;