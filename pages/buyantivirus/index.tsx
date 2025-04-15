import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import ProductSection from "./components/ProductSection";
import BenefitsSection from "./components/BenefitsSection";
import TrustSection from "./components/TrustSection";
import FaqSection from "./components/FaqSection";
import Footer from "@components/Footer";

export default function BuyAntivirusPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <ProductSection />
      <BenefitsSection />
      <TestimonialsSection />
      <TrustSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
