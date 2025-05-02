
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user session on app load
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation. In a real app, this would use Supabase Auth
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock successful login (in real app, validate with Supabase)
      const mockUser = {
        id: "123",
        email,
        username: email.split('@')[0],
      };

      // Store user in local storage (temporary for our mock)
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // This is a mock implementation. In a real app, this would use Supabase Auth
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock successful signup (in real app, register with Supabase)
      const mockUser = {
        id: "123",
        email,
        username,
      };

      // Store user in local storage (temporary for our mock)
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      return Promise.resolve();
    } catch (error) {
      console.error("Signup error:", error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // This is a mock implementation. In a real app, this would sign out with Supabase Auth
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Clear user from local storage
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Logout error:", error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
