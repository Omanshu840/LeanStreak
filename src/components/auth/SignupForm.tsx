"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@/components/ui";
import { GoogleButton } from "./GoogleButton";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function SignupForm() {
  const { signUp, signInWithGoogle, loading, error } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email,    setEmail   ] = useState("");
  const [password, setPassword] = useState("");
  const [success,  setSuccess ] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await signUp(email, password, fullName);
    if (ok) setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center space-y-3 bg-green-50 rounded-2xl p-6">
        <Mail size={36} className="mx-auto text-[#2f9d64]" />
        <h2 className="text-lg font-bold text-[#1f2a44]">Check your email</h2>
        <p className="text-sm text-[#6e7a96]">
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account.
        </p>
        <Link href="/login" className="block text-sm text-[#4b78de] font-semibold hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Full Name"
          type="text"
          placeholder="Alex Johnson"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />
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
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          hint="At least 8 characters"
        />

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e4ebfb]" />
        <span className="text-xs text-[#8a96b0] font-medium">or</span>
        <div className="flex-1 h-px bg-[#e4ebfb]" />
      </div>

      <GoogleButton onClick={signInWithGoogle} loading={loading} />

      <p className="text-center text-sm text-[#6e7a96]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#4b78de] font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
