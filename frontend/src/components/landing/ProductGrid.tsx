'use client';

import React from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface GridItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
  size: 'small' | 'large';
  type: 'product' | 'category' | 'feature';
}

const ProductGrid: React.FC = () => {
  const gridItems: GridItem[] = [
    {
      id: '1',
      title: 'Discover New Collections',
      subtitle: 'LATEST ARRIVALS',
      description: 'Explore our newest fashion pieces and trending accessories',
      ctaText: 'View Collection',
      ctaLink: '/products/new-arrivals',
      backgroundColor: 'bg-gradient-to-br from-neutral-900 to-neutral-800',
      textColor: 'text-white',
      size: 'large',
      type: 'category'
    },
    {
      id: '2',
      title: 'Check out the New Arrivals',
      subtitle: '',
      description: '',
      ctaText: 'Discover',
      ctaLink: '/products/new-arrivals',
      backgroundColor: 'bg-gradient-to-br from-accent-coral to-red-400',
      textColor: 'text-white',
      size: 'large',
      type: 'feature'
    },
    {
      id: '3',
      title: 'Best for Athletes',
      subtitle: '',
      description: 'Performance gear for active lifestyle',
      ctaText: 'Shop Now',
      ctaLink: '/products/category/athletic',
      backgroundColor: 'bg-gradient-to-br from-neutral-800 to-neutral-900',
      textColor: 'text-white',
      size: 'small',
      type: 'category'
    },
    {
      id: '4',
      title: 'Feel Premium',
      subtitle: '',
      description: 'Luxury fashion pieces for discerning taste',
      ctaText: 'Explore',
      ctaLink: '/products/category/premium',
      backgroundColor: 'bg-gradient-to-br from-neutral-200 to-neutral-300',
      textColor: 'text-neutral-900',
      size: 'small',
      type: 'feature'
    }
  ];

  const GridCard: React.FC<{ item: GridItem; className?: string }> = ({ item, className }) => (
    <Link href={item.ctaLink} className={clsx('group block', className)}>
      <div className={clsx(
        'relative h-full p-6 overflow-hidden rounded-3xl transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl',
        item.backgroundColor,
        item.size === 'large' ? 'min-h-[400px] lg:min-h-[500px]' : 'min-h-[300px]'
      )}>
        
        {/* Background Pattern/Image Placeholder */}
        <div className="absolute inset-0 opacity-10">
          {item.type === 'product' && (
            <div className="absolute w-32 h-32 bg-current rounded-full bottom-4 right-4 animate-pulse-slow" />
          )}
          {item.type === 'category' && (
            <div className="absolute inset-0 bg-gradient-to-t from-current/20 to-transparent" />
          )}
          {item.type === 'feature' && (
            <>
              <div className="absolute w-24 h-24 bg-current rounded-full top-4 right-4" />
              <div className="absolute w-16 h-16 bg-current rounded-full bottom-8 left-8 animate-bounce-gentle" />
            </>
          )}
        </div>

        {/* Content */}
        <div className={clsx('relative z-10 flex flex-col h-full justify-between', item.textColor)}>
          
          {/* Top Content */}
          <div className="space-y-3">
            {item.subtitle && (
              <div className="text-sm font-semibold tracking-wider uppercase opacity-70">
                {item.subtitle}
              </div>
            )}
            
            <h3 className={clsx(
              'font-bold leading-tight',
              item.size === 'large' ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'
            )}>
              {item.title}
            </h3>
            
            {item.description && (
              <p className="max-w-md text-base opacity-80">
                {item.description}
              </p>
            )}
          </div>

          {/* Product Image Placeholder (for specific items) */}
          {(item.id === '2' || item.id === '4') && (
            <div className="flex justify-center my-8">
              <div className="relative">
                {/* Shoe placeholder for item 2 */}
                {item.id === '2' && (
                  <div className="flex items-center justify-center w-48 h-32 bg-black/20 rounded-xl">
                    <div className="text-6xl opacity-50">👟</div>
                  </div>
                )}
                {/* Luxury item placeholder for item 4 */}
                {item.id === '4' && (
                  <div className="flex items-center justify-center w-40 h-32 bg-white/20 rounded-xl">
                    <div className="text-5xl opacity-50">👜</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-auto">
            <Button
              variant={item.textColor === 'text-white' ? 'secondary' : 'primary'}
              size="lg"
              className="transition-transform group-hover:scale-105"
            >
              {item.ctaText}
            </Button>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/10 to-transparent group-hover:opacity-100" />
      </div>
    </Link>
  );

  return (
    <section className="py-20 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-neutral-900 lg:text-5xl">
            Explore Our <span className="text-rebbie-600">Collections</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-neutral-600">
            From premium fashion bags to luxury jewelry and authentic thrift pieces, 
            discover everything you need to express your unique style.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Large Item 1 - Spans 2 columns */}
          <GridCard 
            item={gridItems[0]} 
            className="md:col-span-2"
          />
          
          {/* Small Item 1 */}
          <GridCard 
            item={gridItems[2]} 
            className=""
          />
          
          {/* Small Item 2 */}
          <GridCard 
            item={gridItems[3]} 
            className=""
          />
          
          {/* Large Item 2 - Spans 2 columns */}
          <GridCard 
            item={gridItems[1]} 
            className="md:col-span-2"
          />
          
          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 gap-6 md:col-span-2 sm:grid-cols-2">
            
            {/* Free Delivery Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rebbie-50 to-rebbie-100">
              <div className="space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rebbie-600">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-neutral-900">Free Delivery</h4>
                <p className="text-neutral-600">Free shipping on orders above ₦50,000 within Lagos</p>
              </div>
            </div>

            {/* Authentic Guarantee Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-accent-gold/10 to-accent-gold/20">
              <div className="space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-gold">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-neutral-900">100% Authentic</h4>
                <p className="text-neutral-600">All products verified with authenticity certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link href="/products">
            <Button size="xl" className="group">
              View All Products
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;