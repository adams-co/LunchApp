import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "signup" | "reset";

function formatAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("rate limit") || m.includes("too many requests") || m.includes("email rate")) {
    return "Supabase is temporarily limiting auth emails. Wait up to an hour, or change settings (see “Email rate limit” below).";
  }
  return message;
}

const Login = () => {
  const { user, isAuthLoading, signInWithPassword, signUpWithPassword, sendPasswordReset } = useAuthUser();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const urlError = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    const q = qs.get("error") || qs.get("error_code");
    const qDesc = qs.get("error_description") || qs.get("msg") || qs.get("message");
    const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    const h = hash.get("error") || hash.get("error_code");
    const hDesc = hash.get("error_description") || hash.get("msg");
    const code = q || h;
    let desc = (qDesc || hDesc || "").replace(/\+/g, " ");
    try {
      if (desc.includes("%")) desc = decodeURIComponent(desc);
    } catch {
      /* keep raw */
    }
    if (!code && !desc) return null;
    return { code, desc };
  }, [location.search, location.hash]);

  useEffect(() => {
    if (!urlError) return;
    toast.error(urlError.desc || urlError.code || "Something went wrong", { duration: 6000 });
  }, [urlError]);

  const onCompleteRecovery = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Your password is updated.");
    setRecoveryMode(false);
    setPassword("");
    setConfirmPassword("");
  };

  if (!isAuthLoading && user && !recoveryMode) {
    return <Navigate to="/" replace />;
  }

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    const { error } = await signInWithPassword(email, password);
    setBusy(false);
    if (error) {
      const msg =
        error.message === "Invalid login credentials" ? "Wrong email or password." : formatAuthError(error.message);
      toast.error(msg, { duration: msg.includes("rate limit") || msg.includes("limiting") ? 12000 : 5000 });
      return;
    }
    toast.success("Welcome back!");
  };

  const onSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { data, error } = await signUpWithPassword(email, password, displayName);
    setBusy(false);
    if (error) {
      toast.error(formatAuthError(error.message), {
        duration: error.message.toLowerCase().includes("rate") ? 12000 : 5000,
      });
      return;
    }
    if (data.session) {
      toast.success("Account created. You are signed in.");
    } else {
      toast.success("Account created. Check your email if confirmation is required, then log in.");
      setMode("login");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const onReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const { error } = await sendPasswordReset(email);
    setBusy(false);
    if (error) {
      toast.error(formatAuthError(error.message), {
        duration: error.message.toLowerCase().includes("rate") ? 12000 : 5000,
      });
      return;
    }
    toast.success("If that email is registered, you will get a reset link shortly.");
    setMode("login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border px-4 py-3">
        <Link to="/" className="text-sm font-heading font-semibold text-primary hover:underline">
          ← Back to home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card/80 p-6 shadow-card">
          <div className="text-center space-y-1">
            <h1 className="font-heading text-2xl font-bold">Roomio</h1>
            <p className="text-sm text-muted-foreground">
              {recoveryMode && "Choose a new password for your account."}
              {!recoveryMode && mode === "login" && "Log in with your email and password."}
              {!recoveryMode && mode === "signup" && "Create an account in a few seconds."}
              {!recoveryMode && mode === "reset" && "We will email you a link to set a new password."}
            </p>
          </div>

          {urlError && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {urlError.desc || urlError.code}
            </div>
          )}

          {recoveryMode && (
            <form onSubmit={onCompleteRecovery} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="new-pass" className="text-xs font-medium text-foreground">
                  New password
                </label>
                <input
                  id="new-pass"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="new-pass2" className="text-xs font-medium text-foreground">
                  Confirm new password
                </label>
                <input
                  id="new-pass2"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl gradient-primary text-primary-foreground font-semibold py-3 text-sm"
              >
                {busy ? "Please wait…" : "Save new password"}
              </button>
            </form>
          )}

          {!recoveryMode && mode !== "reset" && (
            <div className="flex rounded-xl bg-secondary p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  mode === "login" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  mode === "signup" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                Sign up
              </button>
            </div>
          )}

          {!recoveryMode && mode === "login" && (
            <form onSubmit={onLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl gradient-primary text-primary-foreground font-semibold py-3 text-sm"
              >
                {busy ? "Please wait…" : "Log in"}
              </button>
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="w-full text-center text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </form>
          )}

          {!recoveryMode && mode === "signup" && (
            <form onSubmit={onSignup} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-medium text-foreground">
                  Name <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How you want to appear"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="su-email" className="text-xs font-medium text-foreground">
                  Email
                </label>
                <input
                  id="su-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="su-password" className="text-xs font-medium text-foreground">
                  Password
                </label>
                <input
                  id="su-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="su-confirm" className="text-xs font-medium text-foreground">
                  Confirm password
                </label>
                <input
                  id="su-confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Same as above"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl gradient-primary text-primary-foreground font-semibold py-3 text-sm"
              >
                {busy ? "Please wait…" : "Create account"}
              </button>
            </form>
          )}

          {!recoveryMode && mode === "reset" && (
            <form onSubmit={onReset} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="reset-email" className="text-xs font-medium text-foreground">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl gradient-primary text-primary-foreground font-semibold py-3 text-sm"
              >
                {busy ? "Please wait…" : "Send reset link"}
              </button>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="w-full text-center text-xs text-muted-foreground hover:text-primary"
              >
                Back to log in
              </button>
            </form>
          )}

          <details className="rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">
              “Email rate limit exceeded” — how to fix (Supabase)
            </summary>
            <ul className="mt-2 list-disc pl-4 space-y-1.5">
              <li>
                <strong>Wait</strong> — Free projects allow only a small number of auth emails per hour; the window resets
                automatically.
              </li>
              <li>
                <strong>Project Settings → Auth</strong> (gear icon) — Check for rate limits; upgrade plan if you need more
                traffic.
              </li>
              <li>
                <strong>Custom SMTP</strong> — Same Auth settings: add your own email provider (SendGrid, Resend, etc.) for
                higher sending limits.
              </li>
              <li>
                <strong>While developing:</strong> Authentication → Providers → Email → turn off <strong>Confirm email</strong>{" "}
                so sign-up does not send a confirmation message every time.
              </li>
              <li>
                Go easy on <strong>Forgot password</strong> and repeated sign-ups while testing — each one sends mail and
                counts toward the cap.
              </li>
            </ul>
          </details>
        </div>
      </main>
    </div>
  );
};

export default Login;
