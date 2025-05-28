import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";

interface NavBarProps {
  onGetStartedClick: () => void;
}

const NavBar = ({ onGetStartedClick }: NavBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 👇 Récupération de l'état d'auth depuis un hook personnalisé
  const { isAuthenticated, isLoading, logout } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const phrase = "Link Beacon";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            {phrase.split("").map((char, i) => (
              <span
                key={i}
                className="text-2xl font-bold inline-block animate-letter"
                style={{ animationDelay: `${i * 0.10}s` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </Link>

          

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className={`text-gray-700 hover:text-primary transition-colors ${location.hash === "#features" ? "text-primary" : ""}`}>Features</Link>
            <Link to="/pricing" className={`text-gray-700 hover:text-primary transition-colors ${location.pathname === "/pricing" ? "text-primary" : ""}`}>Pricing</Link>
            <Link to="/faq" className={`text-gray-700 hover:text-primary transition-colors ${location.pathname === "/faq" ? "text-primary" : ""}`}>FAQ</Link>
            <Link to="/contact" className={`text-gray-700 hover:text-primary transition-colors ${location.pathname === "/contact" ? "text-primary" : ""}`}>Contact</Link>

            {/* 🔐 Boutons selon l'état d'authentification */}
            {isLoading ? (
              <div className="w-24 h-9 animate-pulse bg-gray-200 rounded-md"></div>
            ) : isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="text-gray-600 hover:text-brand-purple transition-colors"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={logout}
                  className="bg-brand-purple hover:bg-brand-purple/90"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-brand-purple transition-colors">
                  Log In
                </Link>
                <Button onClick={() => navigate("/signup")} className="bg-brand-purple hover:bg-brand-purple/90">
                  Get Started
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden flex flex-col space-y-4 mt-4 py-4 animate-fade-in">
            <Link to="/#features" className="text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            <Link to="/faq" className="text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>

            {/* Mobile buttons */}
            {isLoading ? (
              <div className="w-full h-9 animate-pulse bg-gray-200 rounded-md"></div>
            ) : isAuthenticated ? (
              <>
                <Button onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }} className="bg-brand-purple w-full">Dashboard</Button>
                <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full">Log Out</Button>
              </>
            ) : (
              <>
                <Button onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }} className="bg-brand-purple w-full">Get Started</Button>
                <Link to="/login" className="text-center text-gray-600 hover:text-brand-purple" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default NavBar;
