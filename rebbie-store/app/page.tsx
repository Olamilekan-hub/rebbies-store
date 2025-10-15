import { CategoryMenu, Hero, Incentives, Newsletter, ProductsSection } from "@/components";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";

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
