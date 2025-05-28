
import { useState, useEffect, useRef } from "react";
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
      <NavBar onGetStartedClick={handleGetStartedClick} />

      <main className="relative">
        {/* Animated background elements with parallax */}
        <div 
          className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/30 transition-transform duration-1000 ease-out"
          style={{
            transform: `translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`
          }}
        />
        <div 
          className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/20 transition-transform duration-1000 ease-out"
          style={{
            transform: `translateY(${scrollY * -0.2}px) scale(${1 + scrollY * 0.0001})`
          }}
        />

        {/* Hero Section with enhanced animations */}
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

        {/* Features Section with scroll animations */}
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
            className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/50 transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.1}deg)`,
              opacity: isFeaturesVisible ? 0.5 : 0
            }}
          />
          <div 
            className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/50 transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * -0.05}deg)`,
              opacity: isFeaturesVisible ? 0.5 : 0
            }}
          />
          <FeaturesSection />
        </div>

        {/* Pricing Section with powerful entrance */}
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
            className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/60 transition-all duration-1200"
            style={{
              transform: `translateY(${scrollY * 0.2}px) scale(${isPricingVisible ? 1 : 0.5})`,
              opacity: isPricingVisible ? 0.6 : 0
            }}
          />
          <div 
            className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/50 transition-all duration-1200"
            style={{
              transform: `translateY(${scrollY * -0.15}px) scale(${isPricingVisible ? 1 : 0.7})`,
              opacity: isPricingVisible ? 0.5 : 0
            }}
          />
          <PricingSection />
        </div>

        {/* FAQ Section with dramatic entrance */}
        <div className="relative">
          <div 
            className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/30 blur-3xl transition-all duration-1500"
            style={{
              transform: `translateY(${scrollY * 0.25}px) scale(${isFaqVisible ? 1.2 : 0.3})`,
              opacity: isFaqVisible ? 0.3 : 0
            }}
          />
          <div 
            className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/20 blur-3xl transition-all duration-1500"
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

      {/* Footer with fade-in animation */}
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
