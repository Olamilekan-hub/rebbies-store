'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline';
import ProductGrid from './ProductGrid';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero content with alternating layouts
  const heroSlides = [
    {
      id: 1,
      title: "Nigeria's Premier Fashion Destination",
      subtitle: "Discover luxury fashion bags, stunning jewelry & premium fragrances",
      description: "From authentic thrift pieces to brand new designer collections, find everything you need to express your unique style.",
      ctaText: "Explore Collection",
      ctaLink: "/products",
      secondaryCtaText: "Watch Story",
      heroImage: "/hero-bag-1.jpg",
      layout: "left", // content on left, image on right
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
      description: "Pre-owned designer bags and jewelry with authenticity certificates. Every piece is carefully curated and verified.",
      ctaText: "Shop Thrift",
      ctaLink: "/products/category/thrift-fashion-bags",
      secondaryCtaText: "Learn More",
      heroImage: "/hero-jewelry.jpg",
      layout: "right", // content on right, image on left
      badge: "Sustainable Choice"
    },
    {
      id: 3,
      title: "Same-Day Delivery in Lagos",
      subtitle: "Get your favorites delivered within hours",
      description: "Order before 3PM and receive your items the same day across Lagos. Fast, reliable, and secure delivery service.",
      ctaText: "Order Now",
      ctaLink: "/products",
      secondaryCtaText: "Delivery Info",
      heroImage: "/hero-fragrance.jpg",
      layout: "left", // content on left, image on right
      badge: "Lagos Express"
    }
  ];

  const currentHero = heroSlides[currentSlide];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const ContentSection = () => (
    <div className="space-y-8 text-white animate-fade-in-up">
      {/* Badge */}
      {currentHero.badge && (
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full bg-white/10 backdrop-blur-sm border-white/20">
          <div className="w-2 h-2 rounded-full bg-rebbie-400"></div>
          {currentHero.badge}
        </div>
      )}

      {/* Main Heading */}
      <div className="space-y-4">
        <h1 className="font-bold leading-tight text-white text-display-xl">
          {currentHero.title.split(' ').slice(0, 2).join(' ')}{' '}
          <span className="text-rebbie-400">
            {currentHero.title.split(' ').slice(2).join(' ')}
          </span>
        </h1>
        
        <p className="text-xl font-light leading-relaxed lg:text-2xl text-rebbie-100">
          {currentHero.subtitle}
        </p>
        
        <p className="max-w-lg text-lg leading-relaxed text-neutral-300">
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
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href={currentHero.ctaLink}>
          <Button
            size="lg"
            className="group"
            rightIcon={
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            }
          >
            {currentHero.ctaText}
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="lg"
          leftIcon={<PlayIcon className="w-5 h-5" />}
          className="text-white border-white/30 hover:bg-white/10"
        >
          {currentHero.secondaryCtaText}
        </Button>
      </div>

      {/* Social Proof */}
      <div className="flex items-center gap-4 pt-4">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white border-2 border-white rounded-full bg-gradient-to-br from-rebbie-400 to-rebbie-600"
            >
              {i}
            </div>
          ))}
        </div>
        <div className="text-sm text-neutral-300">
          <span className="font-semibold text-rebbie-400">4.9/5</span> from 2,500+ reviews
        </div>
      </div>
    </div>
  );

  const ImageSection = () => (
    <div 
      className="relative animate-bounce-gentle" 
      style={{ 
        animationDelay: '0.3s',
        animationDuration: '3s'
      }}
    >
      {/* Hero Image */}
      <div className="relative overflow-hidden aspect-square">
        {/* Placeholder for hero image */}
        <div className="flex items-center justify-center w-full h-full shadow-2xl bg-gradient-to-br from-rebbie-100 via-white to-rebbie-50 rounded-3xl">
          <div className="text-center text-neutral-600">
            <div className="mb-4 text-8xl">
              {currentSlide === 0 && <img src="/image/women_bag.png" alt="Fashion Bags" className="object-cover w-full h-full rounded-3xl" />}
              {currentSlide === 1 && <img src="/image/women_bag.png" alt="Fashion Bags" className="object-cover w-full h-full rounded-3xl" />}
              {currentSlide === 2 && <img src="/image/women_bag.png" alt="Fashion Bags" className="object-cover w-full h-full rounded-3xl" />}
            </div>
            <div className="text-lg font-medium">
              {currentSlide === 0 && 'Fashion Bags'}
              {currentSlide === 1 && 'Luxury Jewelry'}
              {currentSlide === 2 && 'Premium Fragrances'}
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-20 h-20 rounded-full -top-10 -left-10 bg-rebbie-400/20 animate-pulse"></div>
        <div className="absolute w-16 h-16 rounded-full -bottom-8 -right-8 bg-accent-gold/20 animate-bounce-gentle"></div>
      </div>
    </div>
  );

  return (
    <div className={clsx('relative', className)}>
      {/* Main Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rebbie-900 via-rebbie-800 to-neutral-900">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-64 h-64 rounded-full top-10 left-10 bg-gradient-to-br from-rebbie-400 to-rebbie-600 animate-pulse-slow blur-3xl" />
            <div className="absolute rounded-full w-96 h-96 bottom-10 right-10 bg-gradient-to-br from-accent-gold to-rebbie-400 animate-float blur-3xl" />
            <div className="absolute w-32 h-32 rounded-full top-1/2 right-20 bg-rebbie-300 animate-bounce-gentle blur-2xl" />
          </div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" 
               style={{
                 backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                 backgroundSize: '50px 50px'
               }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-20 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center min-h-screen grid-cols-1 gap-12 py-20 transition-all duration-500 lg:grid-cols-2">
            
            {/* Dynamic Layout based on slide */}
            {currentHero.layout === 'left' ? (
              <>
                <ContentSection />
                <ImageSection />
              </>
            ) : (
              <>
                <div className="order-2 lg:order-1">
                  <ImageSection />
                </div>
                <div className="order-1 lg:order-2">
                  <ContentSection />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute z-30 transform -translate-x-1/2 bottom-8 left-1/2">
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={clsx(
                  'h-2 rounded-full transition-all duration-500',
                  index === currentSlide
                    ? 'bg-rebbie-400 w-8'
                    : 'bg-white/30 hover:bg-white/50 w-2'
                )}
              />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce-gentle">
          <div className="text-center text-white/60">
            <div className="mb-2 text-xs tracking-wider uppercase">Scroll</div>
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* WhatsApp Quick Contact */}
        <div className="absolute z-30 bottom-20 right-4 lg:right-8">
          <a
            href="https://wa.me/2349023821968?text=Hello%20Rebbie's%20Store!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 text-white transition-all duration-300 bg-green-600 rounded-full shadow-lg hover:bg-green-700 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            <span className="hidden text-sm font-medium lg:inline">Chat with us</span>
          </a>
        </div>
      </section>

      {/* Product Grid Section */}
      <ProductGrid />
    </div>
  );
};

export default HeroSection;