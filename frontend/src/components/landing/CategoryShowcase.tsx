'use client';

import React from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  description: string;
  link: string;
  icon: string;
  itemCount: number;
  priceRange: string;
  specialOffer?: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  isThrift?: boolean;
}

interface CategoryShowcaseProps {
  className?: string;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ className }) => {
  
  // Category data
  const categories: Category[] = [
    {
      id: 'fashion-bags',
      name: 'Fashion Bags',
      description: 'Luxury handbags, totes, and accessories for every occasion',
      link: '/products/category/fashion-bags',
      icon: '👜',
      itemCount: 150,
      priceRange: '₦25,000 - ₦500,000',
      specialOffer: 'Free Lagos delivery',
      gradient: 'from-rebbie-600 to-rebbie-800',
      textColor: 'text-white',
      accentColor: 'text-rebbie-200'
    },
    {
      id: 'thrift-bags',
      name: 'Thrift Collection',
      description: 'Authentic pre-owned designer bags with certificates',
      link: '/products/category/thrift-fashion-bags',
      icon: '♻️',
      itemCount: 85,
      priceRange: '₦15,000 - ₦450,000',
      specialOffer: 'Up to 60% off retail',
      gradient: 'from-emerald-600 to-teal-700',
      textColor: 'text-white',
      accentColor: 'text-emerald-200',
      isThrift: true
    },
    {
      id: 'jewelry',
      name: 'Jewelry',
      description: 'Stunning necklaces, earrings, rings & African pieces',
      link: '/products/category/jewelry',
      icon: '💎',
      itemCount: 200,
      priceRange: '₦8,000 - ₦300,000',
      specialOffer: 'Gift wrapping included',
      gradient: 'from-accent-gold to-yellow-600',
      textColor: 'text-white',
      accentColor: 'text-yellow-200'
    },
    {
      id: 'fragrances',
      name: 'Fragrances',
      description: 'Premium perfumes, colognes & body mists',
      link: '/products/category/fragrances',
      icon: '🌸',
      itemCount: 120,
      priceRange: '₦12,000 - ₦350,000',
      specialOffer: 'Sample with purchase',
      gradient: 'from-pink-600 to-rose-700',
      textColor: 'text-white',
      accentColor: 'text-pink-200'
    }
  ];

  return (
    <section className={clsx('py-20 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <SparklesIcon className="w-4 h-4" />
            Shop by Category
          </div>
          
          <h2 className="text-display-md font-bold text-neutral-900 mb-4">
            Find Your Perfect <span className="text-rebbie-600">Style</span>
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            From luxury fashion bags to stunning jewelry and premium fragrances - 
            discover collections curated for the modern Nigerian woman
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Main Featured Category - Fashion Bags */}
          <div className="md:row-span-2">
            <div className={clsx(
              'relative h-full min-h-[500px] rounded-3xl overflow-hidden',
              'bg-gradient-to-br', categories[0].gradient,
              'group cursor-pointer transition-transform duration-300 hover:scale-[1.02]'
            )}>
              <Link href={categories[0].link} className="block h-full">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 text-9xl">
                    {categories[0].icon}
                  </div>
                  <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/20 rounded-full" />
                  <div className="absolute top-32 left-20 w-16 h-16 bg-white/10 rounded-full" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8">
                  
                  {/* Header */}
                  <div>
                    <div className="text-6xl mb-4">{categories[0].icon}</div>
                    <h3 className={clsx('text-3xl font-bold mb-3', categories[0].textColor)}>
                      {categories[0].name}
                    </h3>
                    <p className={clsx('text-lg leading-relaxed mb-6', categories[0].accentColor)}>
                      {categories[0].description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className={clsx('flex items-center gap-2', categories[0].accentColor)}>
                        <span className="w-2 h-2 bg-current rounded-full" />
                        {categories[0].itemCount}+ Items
                      </div>
                      <div className={clsx('flex items-center gap-2', categories[0].accentColor)}>
                        <span className="w-2 h-2 bg-current rounded-full" />
                        {categories[0].priceRange}
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className={clsx('text-sm font-medium mb-2', categories[0].textColor)}>
                        Special Offer
                      </div>
                      <div className={clsx('text-xs', categories[0].accentColor)}>
                        {categories[0].specialOffer}
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="lg"
                      rightIcon={<ArrowRightIcon className="w-5 h-5" />}
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      Explore Collection
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Secondary Categories */}
          <div className="space-y-6">
            {categories.slice(1).map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 0.2}s` }}
              >
                <div className={clsx(
                  'relative h-48 rounded-2xl overflow-hidden',
                  'bg-gradient-to-r', category.gradient,
                  'group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
                )}>
                  <Link href={category.link} className="block h-full">
                    
                    {/* Background Elements */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute -top-4 -right-4 text-6xl">
                        {category.icon}
                      </div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 rounded-full" />
                    </div>

                    {/* Special Badge for Thrift */}
                    {category.isThrift && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          Sustainable Choice
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between p-6">
                      
                      <div>
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <h3 className={clsx('text-xl font-bold mb-2', category.textColor)}>
                          {category.name}
                        </h3>
                        <p className={clsx('text-sm leading-relaxed', category.accentColor)}>
                          {category.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className={clsx('text-xs', category.accentColor)}>
                            {category.itemCount} items • {category.priceRange}
                          </div>
                          <div className={clsx('text-xs font-medium', category.textColor)}>
                            {category.specialOffer}
                          </div>
                        </div>

                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <ArrowRightIcon className={clsx('w-4 h-4', category.textColor)} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nigerian Shopping Benefits */}
        <div className="bg-gradient-to-r from-neutral-50 to-rebbie-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Why Shop with Rebbie's Store?
            </h3>
            <p className="text-neutral-600">
              We understand Nigerian shopping preferences and deliver accordingly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 bg-rebbie-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-rebbie-200 transition-colors">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Fast Delivery</h4>
              <p className="text-sm text-neutral-600">Same-day in Lagos, 2-5 days nationwide</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">✅</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">100% Authentic</h4>
              <p className="text-sm text-neutral-600">Certificates for all luxury items</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Flexible Payment</h4>
              <p className="text-sm text-neutral-600">Paystack, bank transfer, pay on delivery</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-nigeria-whatsapp/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-nigeria-whatsapp/20 transition-colors">
                <span className="text-2xl">📱</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">24/7 WhatsApp</h4>
              <p className="text-sm text-neutral-600">Instant support via WhatsApp</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-6">
            Can't decide? Browse our complete collection or chat with our style consultants
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" rightIcon={<ArrowRightIcon className="w-5 h-5" />}>
                Browse All Products
              </Button>
            </Link>
            
            <a
              href="https://wa.me/2349023821968?text=Hi%20Rebbie's%20Store!%20I%20need%20help%20choosing%20products"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                variant="outline" 
                size="lg"
                leftIcon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                  </svg>
                }
              >
                Get Style Advice
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;