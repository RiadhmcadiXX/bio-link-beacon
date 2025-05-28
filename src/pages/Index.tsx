import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { MobileNav } from "@/components/MobileNav";
import { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import NavBar from "@/components/NavBar";
import { useIsVisible } from "@/hooks/useIsVisible";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SignUpModal from "@/components/SignUpModal";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, logout } = useAuthContext();
  const [heroRef, isHeroVisible] = useIsVisible<HTMLDivElement>();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleGetStartedClick = () => {
    setIsSignUpModalOpen(true);
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  console.log("Index page rendering with auth state:", { isAuthenticated, isLoading });

  const phrase = "One Link for All Your Content";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header/Navigation */}
      <NavBar onGetStartedClick={function (): void {
        throw new Error("Function not implemented.");
      }} />

      <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/30" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/20" />

      <div ref={heroRef}>
        <HeroSection onGetStartedClick={handleGetStartedClick} />
      </div>

      <div className="relative z-10">
        <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-brand-lime/50 " />
        <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-brand-blue/50 " />
        <FeaturesSection />
      </div>


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

      <Footer />

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />



      
      
    </div>
  );
};

// Feature card component
const FeatureCard = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 transition-all hover:shadow-md">
      <div className="w-10 h-10 bg-brand-purple/10 rounded-full flex items-center justify-center mb-4">
        <div className="w-5 h-5 bg-brand-purple rounded-full"></div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
