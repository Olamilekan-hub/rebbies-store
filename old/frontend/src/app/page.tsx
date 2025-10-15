// app/page.tsx (Updated to include Header with auth)
import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroSection from '@/components/landing/HeroSection';
import FeaturedProducts from '@/components/landing/FeaturedProducts';
import CategoryShowcase from '@/components/landing/CategoryShowcase';
import BrandStory from '@/components/landing/BrandStory';
import Testimonials from '@/components/landing/Testimonials';
import Newsletter from '@/components/landing/Newsletter';

// SEO Metadata for Nigerian market
export const metadata: Metadata = {
  title: "Rebbie's Store - Nigeria's Premier Fashion & Beauty Destination",
  description: "Discover luxury fashion bags, stunning jewelry, and premium fragrances. Shop authentic thrift pieces and new designer collections with same-day Lagos delivery.",
  keywords: [
    "fashion bags Nigeria",
    "luxury handbags Lagos",
    "Nigerian jewelry",
    "designer fragrances Nigeria",
    "thrift designer bags",
    "authentic luxury items",
    "same day delivery Lagos",
    "Nigerian fashion store",
    "luxury accessories Nigeria",
    "designer perfume Nigeria"
  ],
  authors: [{ name: "Rebbie's Store" }],
  creator: "Rebbie's Store",
  publisher: "Rebbie's Store",
  robots: "index, follow",
  
  // Open Graph for social sharing
  openGraph: {
    title: "Rebbie's Store - Nigeria's Premier Fashion & Beauty Destination",
    description: "Discover luxury fashion bags, stunning jewelry, and premium fragrances with authentic thrift pieces and same-day Lagos delivery.",
    url: "https://rebbies-store.com",
    siteName: "Rebbie's Store",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rebbie's Store - Luxury Fashion & Beauty",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Rebbie's Store - Nigeria's Premier Fashion & Beauty Destination",
    description: "Luxury fashion bags, jewelry & fragrances with same-day Lagos delivery",
    images: ["/twitter-image.jpg"],
    creator: "@rebbiesstore",
  },
  
  // Additional metadata for Nigerian market
  other: {
    "geo.region": "NG",
    "geo.placename": "Nigeria",
    "geo.position": "9.082;8.6753", // Nigeria center coordinates
    "ICBM": "9.082, 8.6753",
    "currency": "NGN",
    "price-range": "₦8,000-₦500,000",
    "contact": "+234-806-577-6378",
    "payment-methods": "Paystack, Bank Transfer, Cash on Delivery",
    "delivery-areas": "Lagos, Abuja, Port Harcourt, All Nigeria",
  },
};

// Structured Data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "Rebbie's Store",
  "description": "Nigeria's premier destination for luxury fashion bags, jewelry, and fragrances",
  "url": "https://rebbies-store.com",
  "logo": "https://rebbies-store.com/logo.png",
  "image": "https://rebbies-store.com/og-image.jpg",
  "telephone": "+234-806-577-6378",
  "email": "contact@rebbies-store.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Victoria Island",
    "addressLocality": "Lagos",
    "addressRegion": "Lagos State",
    "addressCountry": "NG"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "6.4281",
    "longitude": "3.4219"
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "paymentAccepted": ["Credit Card", "Bank Transfer", "Cash"],
  "priceRange": "₦₦₦",
  "currenciesAccepted": "NGN",
  "areaServed": {
    "@type": "Country",
    "name": "Nigeria"
  },
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "9.082",
      "longitude": "8.6753"
    },
    "geoRadius": "1000000"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Rebbie's Store Products",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Fashion Bags",
          "category": "Fashion Accessories"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Product",
          "name": "Jewelry",
          "category": "Jewelry"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product", 
          "name": "Fragrances",
          "category": "Beauty Products"
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2500",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Adunni Olatunji"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "Amazing authentic designer bags with certificates. Same-day delivery in Lagos is fantastic!"
    }
  ],
  "sameAs": [
    "https://instagram.com/rebbiesstore",
    "https://facebook.com/rebbiesstore",
    "https://twitter.com/rebbiesstore"
  ]
};

// Client component wrapper for auth-aware header
function HomePageContent() {
  return (
    <>
      {/* Header with auth integration */}
      <Header />

      {/* Main Landing Content */}
      <main className="overflow-x-hidden">
        
        {/* Hero Section - First impression with featured product */}
        <HeroSection />

        {/* Featured Products - Direct integration with store catalog */}
        <FeaturedProducts />

        {/* Category Showcase - Navigation to specific product categories */}
        <CategoryShowcase />

        {/* Brand Story - Build trust and connection */}
        <BrandStory />

        {/* Testimonials - Social proof from Nigerian customers */}
        <Testimonials />

        {/* Newsletter - Email collection for marketing */}
        <Newsletter />

        {/* Final CTA Section before footer */}
        <section className="py-16 text-white bg-neutral-900">
          <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Ready to Discover Your Next Favorite Piece?
            </h2>
            <p className="mb-8 text-xl text-neutral-300">
              Join thousands of satisfied customers who trust Rebbie's Store for authentic luxury fashion
            </p>
            
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a 
                href="/products"
                className="btn btn-primary btn-lg group"
              >
                Browse All Products
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              <a
                href="https://wa.me/2349023821968?text=Hello%20Rebbie's%20Store!%20I'm%20interested%20in%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="text-white border-white btn btn-outline hover:bg-white hover:text-neutral-900 btn-lg"
              >
                Chat on WhatsApp
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                </svg>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 mt-12 border-t border-neutral-700">
              <div className="grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
                <div>
                  <div className="text-2xl font-bold text-rebbie-400">4.9⭐</div>
                  <div className="text-sm text-neutral-400">Customer Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rebbie-400">10K+</div>
                  <div className="text-sm text-neutral-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rebbie-400">36</div>
                  <div className="text-sm text-neutral-400">States Delivered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-rebbie-400">24/7</div>
                  <div className="text-sm text-neutral-400">WhatsApp Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with comprehensive links */}
      <Footer />
    </>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <HomePageContent />

      {/* Performance and Analytics Scripts */}
      {/* Google Analytics - Add your GA tracking ID */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel - Add your pixel ID */}
      {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* Nigerian-specific optimizations */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Preconnect to Nigerian payment providers
            if (typeof window !== 'undefined') {
              const paystack = document.createElement('link');
              paystack.rel = 'preconnect';
              paystack.href = 'https://api.paystack.co';
              document.head.appendChild(paystack);
              
              // Preload critical Nigerian fonts
              const font = document.createElement('link');
              font.rel = 'preload';
              font.as = 'font';
              font.type = 'font/woff2';
              font.href = '/fonts/inter-nigerian.woff2';
              font.crossOrigin = 'anonymous';
              document.head.appendChild(font);
            }
          `,
        }}
      />
    </>
  );
}