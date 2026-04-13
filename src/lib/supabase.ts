import { createClient } from "@supabase/supabase-js";

/**
 * Base URL for auth redirects. Must appear in Supabase → Authentication → URL Configuration → Redirect URLs.
 * Optional: VITE_AUTH_REDIRECT_URL=http://localhost:3000 in .env
 */
export function getAuthEmailRedirectTo(): string {
  const fromEnv = import.meta.env.VITE_AUTH_REDIRECT_URL as string | undefined;
  if (fromEnv?.trim()) {
    return `${fromEnv.trim().replace(/\/+$/, "")}/`;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}/`;
  }
  return "/";
}

/** Password reset emails should open the login page so we can show “choose new password”. */
export function getPasswordResetRedirectTo(): string {
  const base = getAuthEmailRedirectTo().replace(/\/+$/, "");
  return `${base}/login`;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined);

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL or key. Set VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY).",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});

