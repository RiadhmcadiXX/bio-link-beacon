
import { useState } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SignUpModal from "@/components/SignUpModal";
import { useIsVisible } from "@/hooks/useIsVisible";

const Index = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [heroRef, isHeroVisible] = useIsVisible<HTMLDivElement>();

  const handleGetStartedClick = () => {
    setIsSignUpModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar onGetStartedClick={handleGetStartedClick} />

      <main className="">
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/30" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/20" />
        {/* Hero with visibility tracking */}
        <div ref={heroRef}>
          <HeroSection onGetStartedClick={handleGetStartedClick} />
        </div>

        {/* Features Section - added z-10 to ensure it stays above background effects */}
        <div className="relative z-10">
          <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/50 " />
          <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/50 " />
          <FeaturesSection />
        </div>

        {/* Pricing Section - added z-10 to ensure it stays above background effects */}
        <div className="relative z-10">
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/60 " />
        <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/50 " />
          <PricingSection />
        </div>

        {/* FAQ Section - added z-10 to ensure it stays above background effects */}
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/30 blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/20 blur-3xl" />
        
        <div className="relative z-10">
          <FAQSection />
        </div>
      </main>

      <Footer />

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </div>
  );
};

export default Index;
