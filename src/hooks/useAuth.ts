"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const supabase = createClient();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);
  const [error,   setError  ] = useState<string | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  function callbackUrl() {
    return `${location.origin}${basePath}/auth/callback`;
  }

  // ── Sign Up ──────────────────────────────────────────────
  async function signUp(email: string, password: string, fullName: string) {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: callbackUrl(),
      },
    });

    setLoading(false);
    if (error) { setError(error.message); return false; }
    return true; // show "check your email" message
  }

  // ── Sign In ──────────────────────────────────────────────
  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) { setError(error.message); return false; }

    router.push("/home");
    router.refresh();
    return true;
  }

  // ── Google OAuth ─────────────────────────────────────────
  async function signInWithGoogle() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl(),
      },
    });

    if (error) { setError(error.message); setLoading(false); }
    // No setLoading(false) — page redirects to Google
  }

  // ── Sign Out ─────────────────────────────────────────────
  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
    setLoading(false);
  }

  return { signUp, signIn, signInWithGoogle, signOut, loading, error };
}
