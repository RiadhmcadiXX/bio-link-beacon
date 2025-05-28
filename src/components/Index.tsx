
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import CustomizableBioSection from "@/components/sections/CustomizableBioSection";
import LinkManagerSection from "@/components/sections/LinkManagerSection";
import ShareProfileSection from "@/components/sections/ShareProfileSection";
import AnalyticsSection from "@/components/sections/AnalyticsSection";
import LinkTypesSection from "@/components/sections/LinkTypesSection";
import PreviewSection from "@/components/sections/PreviewSection";
import TemplateSection from "@/components/sections/TemplateSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/Footer";
import SignUpModal from "@/components/SignUpModal";

const Index = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleGetStartedClick = () => {
    setIsSignUpModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar onGetStartedClick={handleGetStartedClick} />
      </div>

      <main className="relative">
        {/* Hero Section */}
        <HeroSection onGetStartedClick={handleGetStartedClick} />

        {/* Feature Mockup Sections - Each full screen */}
        <CustomizableBioSection />
        <LinkManagerSection />
        <ShareProfileSection />
        <AnalyticsSection />
        <LinkTypesSection />
        <PreviewSection />
        <TemplateSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </div>
  );
};

export default Index;
