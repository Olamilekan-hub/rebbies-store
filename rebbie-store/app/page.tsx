'use client';

import { CategoryMenu, Hero, Incentives, Newsletter } from "@/components";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import dynamic from 'next/dynamic';

// Dynamically import ProductsSection to avoid SSR issues
const ProductsSection = dynamic(() => import('@/components/ProductsSection'), {
  ssr: false,
  loading: () => (
    <div className="bg-purple-50 dark:bg-gray-900 border-t-4 border-purple-200 dark:border-purple-800">
      <div className="max-w-screen-2xl mx-auto pt-20">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <CategoryMenu />
      <ProductsSection />
      <TestimonialsSection />
      <Incentives />
      <Newsletter />
    </>
  );
}
