import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getPasswordResetRedirectTo, supabase } from "@/lib/supabase";

export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user ?? null);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email: email.trim(), password });
  };

  const signUpWithPassword = async (email: string, password: string, displayName?: string) => {
    return supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: displayName?.trim() ? { display_name: displayName.trim() } : undefined,
      },
    });
  };

  const sendPasswordReset = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getPasswordResetRedirectTo(),
    });
  };

  const signOut = async () => supabase.auth.signOut();

  return {
    user,
    isAuthLoading,
    signInWithPassword,
    signUpWithPassword,
    sendPasswordReset,
    signOut,
  };
};
