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

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const currentSession = sessionData?.session ?? null;

        if (!mounted) return;

        if (!currentSession || !currentSession.user) {
          // Invalid session, force sign-out
          console.warn("Invalid session: signing out");
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          navigate("/login");
          return;
        }

        setSession(currentSession);

        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", currentSession.user.id)
          .single();

        const extendedUser: ExtendedUser = {
          ...currentSession.user,
          username: profile?.username ?? undefined,
        };

        setUser(extendedUser);
      } catch (err) {
        console.error("Error checking session", err);
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        navigate("/login");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    // Auth change listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);

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
      }
    );

    checkSession();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message || "Login failed");
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
      toast.error(error.message || "Signup failed");
      throw error;
    }

    toast.success("Check your email to verify.");
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
