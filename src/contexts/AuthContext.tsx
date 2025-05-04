
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  console.log("AuthProvider rendering with state:", { user, isLoading });

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state change:", event);
        
        if (!mounted) return;

        if (newSession?.user) {
          setSession(newSession);

          // Use setTimeout to avoid Supabase deadlock
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("username")
                .eq("id", newSession.user.id)
                .maybeSingle();

              if (mounted) {
                setUser({
                  ...newSession.user,
                  username: profile?.username ?? undefined,
                });
              }
            } catch (err) {
              console.error("Error fetching profile:", err);
              if (mounted) {
                setUser(newSession.user);
              }
            }
          }, 0);
        } else {
          setUser(null);
          setSession(null);
        }
        
        if (mounted) setIsLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentSession = sessionData?.session;

        console.log("Initial session check:", { hasSession: !!currentSession });

        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username")
              .eq("id", currentSession.user.id)
              .maybeSingle();

            if (mounted) {
              setUser({
                ...currentSession.user,
                username: profile?.username ?? undefined,
              });
            }
          } catch (err) {
            console.error("Error fetching initial profile:", err);
            if (mounted) {
              setUser(currentSession.user);
            }
          }
        }
      } catch (err) {
        console.error("Error checking session:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message || "Login failed");
        throw error;
      }
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
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
          data: { username },
        },
      });

      if (error) {
        toast.error(error.message || "Signup failed");
        throw error;
      }

      toast.success("Check your email to verify.");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
