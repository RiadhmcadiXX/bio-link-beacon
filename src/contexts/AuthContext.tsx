import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";

// Extend user type with custom data
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

  // Check session and user on load
  useEffect(() => {
    let mounted = true;

    // Force redirect if auth hangs too long
    const maxWaitTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("Auth timeout: redirecting to login");
        setUser(null);
        setSession(null);
        setIsLoading(false);
        navigate("/login");
      }
    }, 8000);

    // Auth state listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        setSession(session);
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.user.id)
            .single();

          setUser({
            ...session.user,
            username: profile?.username ?? undefined,
          });
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    // Initial load
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!mounted) return;

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single();

        setUser({
          ...session.user,
          username: profile?.username ?? undefined,
        });
        setSession(session);
      } else {
        setUser(null);
        setSession(null);
      }

      setIsLoading(false);
    };

    init();

    return () => {
      mounted = false;
      clearTimeout(maxWaitTimeout);
      listener?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Login failed");
      throw error;
    }

    navigate("/dashboard");
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      toast.error("Signup failed");
      throw error;
    }

    toast.success("Signup successful — check your email!");
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate("/login");
    setIsLoading(false);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
