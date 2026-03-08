"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");
      const nextPath = searchParams.get("next") ?? "/home";

      if (!code) {
        router.replace("/login?error=auth_failed");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (cancelled) return;

      if (error) {
        router.replace("/login?error=auth_failed");
        return;
      }

      router.replace(nextPath.startsWith("/") ? nextPath : "/home");
    }

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto w-full max-w-sm soft-card p-6 text-center">
        <p className="text-sm text-[var(--muted)]">Signing you in...</p>
      </div>
    </div>
  );
}
