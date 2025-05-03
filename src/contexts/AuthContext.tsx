
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

// Define an extended user type to include username
interface ExtendedUser extends User {
  username?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
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
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider initialized");
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        
        if (!mounted) return;
        
        if (newSession) {
          setSession(newSession);
          
          // Fetch user profile data if signed in
          if (newSession.user) {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', newSession.user.id)
                .single();
                
              // Extend the user object with the username
              if (mounted) {
                const extendedUser: ExtendedUser = {
                  ...newSession.user,
                  username: profile?.username
                };
                
                setUser(extendedUser);
              }
            } catch (error) {
              console.error("Error fetching profile:", error);
            }
          }
        } else {
          if (mounted) {
            setSession(null);
            setUser(null);
          }
        }
        
        if (event === 'SIGNED_IN' && mounted) {
          toast.success("Signed in successfully");
        } else if (event === 'SIGNED_OUT' && mounted) {
          toast.success("Signed out successfully");
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;

      if (currentSession) {
        setSession(currentSession);
        
        // Fetch user profile if we have a session
        if (currentSession.user) {
          (async () => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', currentSession.user.id)
      .single();

    if (error) throw error;

    if (mounted) {
      setUser({
        ...currentSession.user,
        username: profile?.username
      });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    if (mounted) {
      setUser(currentSession.user); // fallback
    }
  } finally {
    if (mounted) {
      setIsLoading(false);
    }
  }
})();
        }
      } else {
        if (mounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) throw error;
      toast.success("Signed up successfully! Please check your email for verification.");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to sign up");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  console.log("Auth provider rendering with state:", { isAuthenticated: !!user, isLoading });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
