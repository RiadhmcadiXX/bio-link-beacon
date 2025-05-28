
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/Footer";
import SignUpModal from "@/components/SignUpModal";
import { useIsVisible } from "@/hooks/useIsVisible";

const Index = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [heroRef, isHeroVisible] = useIsVisible<HTMLDivElement>();
  const [featuresRef, isFeaturesVisible] = useIsVisible<HTMLDivElement>();
  const [pricingRef, isPricingVisible] = useIsVisible<HTMLDivElement>();
  const [faqRef, isFaqVisible] = useIsVisible<HTMLDivElement>();
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

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <NavBar onGetStartedClick={handleGetStartedClick} />

      <main className="relative">
        {/* Global animated background elements */}
        <div 
          className="fixed top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/30 transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`
          }}
        />
        <div 
          className="fixed bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/20 transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            transform: `translateY(${scrollY * -0.2}px) scale(${1 + scrollY * 0.0001})`
          }}
        />

        {/* Hero Section */}
        <div 
          ref={heroRef} 
          className={`transition-all duration-1000 ease-out ${
            isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transform: `translateY(${scrollY * -0.1}px)`
          }}
        >
          <HeroSection onGetStartedClick={handleGetStartedClick} />
        </div>

        {/* Features Section */}
        <div 
          ref={featuresRef}
          className={`relative z-10 transition-all duration-1000 ease-out ${
            isFeaturesVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
          }`}
          style={{
            transform: `translateY(${scrollY * -0.05}px)`
          }}
        >
          <div 
            className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/50 transition-all duration-1000 pointer-events-none"
            style={{
              transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.1}deg)`,
              opacity: isFeaturesVisible ? 0.5 : 0
            }}
          />
          <div 
            className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/50 transition-all duration-1000 pointer-events-none"
            style={{
              transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * -0.05}deg)`,
              opacity: isFeaturesVisible ? 0.5 : 0
            }}
          />
          <FeaturesSection />
        </div>

        {/* Pricing Section */}
        <div 
          ref={pricingRef}
          className={`relative z-10 transition-all duration-1200 ease-out ${
            isPricingVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-16 scale-90'
          }`}
          style={{
            transform: `translateY(${scrollY * -0.03}px)`
          }}
        >
          <div 
            className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/60 transition-all duration-1200 pointer-events-none"
            style={{
              transform: `translateY(${scrollY * 0.2}px) scale(${isPricingVisible ? 1 : 0.5})`,
              opacity: isPricingVisible ? 0.6 : 0
            }}
          />
          <div 
            className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/50 transition-all duration-1200 pointer-events-none"
            style={{
              transform: `translateY(${scrollY * -0.15}px) scale(${isPricingVisible ? 1 : 0.7})`,
              opacity: isPricingVisible ? 0.5 : 0
            }}
          />
          <PricingSection />
        </div>

        {/* FAQ Section */}
        <div className="relative">
          <div 
            className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/30 blur-3xl transition-all duration-1500 pointer-events-none"
            style={{
              transform: `translateY(${scrollY * 0.25}px) scale(${isFaqVisible ? 1.2 : 0.3})`,
              opacity: isFaqVisible ? 0.3 : 0
            }}
          />
          <div 
            className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/20 blur-3xl transition-all duration-1500 pointer-events-none"
            style={{
              transform: `translateY(${scrollY * -0.2}px) scale(${isFaqVisible ? 1.1 : 0.4})`,
              opacity: isFaqVisible ? 0.2 : 0
            }}
          />
          
          <div 
            ref={faqRef}
            className={`relative z-10 transition-all duration-1500 ease-out ${
              isFaqVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-85'
            }`}
            style={{
              transform: `translateY(${scrollY * -0.02}px)`
            }}
          >
            <FAQSection />
          </div>
        </div>
      </main>

      {/* Footer */}
      <div 
        className={`transition-all duration-1000 ease-out ${
          isFaqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <Footer />
      </div>

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </div>
  );
};

export default Index;
