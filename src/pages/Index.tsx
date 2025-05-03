
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, isLoading } = useAuthContext();
  
  console.log("Index page rendering with auth state:", { isAuthenticated, isLoading });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header/Navigation */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-hero-pattern">LinkBeacon</h1>
        </div>
        <div className="flex gap-4 items-center">
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
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 space-y-6 mb-10 lg:mb-0">
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            One Link for All Your <span className="bg-clip-text text-transparent bg-hero-pattern">Content</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-lg">
            Connect your audience to everything you share. Create a customizable page for all your links, and manage them in one place.
          </p>
          <div className="pt-4">
            <Button 
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/signup")} 
              size="lg" 
              className="bg-brand-purple hover:bg-brand-purple/90 text-white"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="relative w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 transform -rotate-3 absolute top-4 left-4">
              <div className="w-12 h-12 rounded-full bg-brand-pink mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
                <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 transform rotate-3 relative">
              <div className="w-12 h-12 rounded-full bg-brand-blue mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-brand-purple/10 rounded-lg w-full"></div>
                <div className="h-10 bg-brand-blue/10 rounded-lg w-full"></div>
                <div className="h-10 bg-brand-pink/10 rounded-lg w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need for your link hub</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Customizable Profile" 
              description="Personalize your profile with custom themes, colors, and images to match your brand."
            />
            <FeatureCard 
              title="Link Management" 
              description="Add, edit, and organize your links easily through our intuitive dashboard."
            />
            <FeatureCard 
              title="Analytics" 
              description="Track views and clicks on your links to understand what content resonates."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-hero-pattern">LinkBeacon</h3>
              <p className="text-gray-600 mt-2">© 2025 LinkBeacon. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-brand-purple">Terms</a>
              <a href="#" className="text-gray-600 hover:text-brand-purple">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-brand-purple">Contact</a>
            </div>
          </div>
        </div>
      </footer>
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
