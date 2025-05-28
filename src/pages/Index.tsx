
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";
import IndexComponent from "@/components/Index";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  console.log("Index page rendering with auth state:", { isAuthenticated, isLoading });

  return <IndexComponent />;
};

export default Index;
