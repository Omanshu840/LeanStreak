"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";
import { GoogleButton } from "./GoogleButton";
import Link from "next/link";
import { useState } from "react";

export function LoginForm() {
  const { signIn, signInWithGoogle, loading, error } = useAuth();
  const [email,    setEmail   ] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await signIn(email, password);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Log In
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e4ebfb] dark:bg-[var(--card-border)]" />
        <span className="text-xs text-[#8a96b0] dark:text-[var(--muted)] font-medium">or</span>
        <div className="flex-1 h-px bg-[#e4ebfb] dark:bg-[var(--card-border)]" />
      </div>

      <GoogleButton onClick={signInWithGoogle} loading={loading} />

      <p className="text-center text-sm text-[#6e7a96] dark:text-[var(--muted)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#4b78de] dark:text-[#9cb9ff] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
