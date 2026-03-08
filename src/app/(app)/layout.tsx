"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { NightBlocker } from "@/components/features/night-blocker/NightBlocker";
import { useSession } from "@/hooks/useSession";

function getOnboardingKey(userId: string) {
  return `leanstreak:onboarding:${userId}`;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const stripBasePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
  const normalizedPath = stripBasePath !== "/" && stripBasePath.endsWith("/")
    ? stripBasePath.slice(0, -1)
    : stripBasePath;
  const router = useRouter();

  const [checkedOnboarding, setCheckedOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setOnboardingComplete(true);
      setCheckedOnboarding(true);
      return;
    }

    const timer = setTimeout(() => {
      const raw = localStorage.getItem(getOnboardingKey(user.id));
      let complete = false;

      if (raw) {
        try {
          complete = Boolean(JSON.parse(raw).completed);
        } catch {
          complete = false;
        }
      }

      setOnboardingComplete(complete);
      setCheckedOnboarding(true);

      if (!complete && normalizedPath !== "/home") {
        router.replace("/home");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [loading, normalizedPath, router, user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  useEffect(() => {
    function handleOnboardingUpdate() {
      if (!user) return;
      const raw = localStorage.getItem(getOnboardingKey(user.id));
      if (!raw) return;

      try {
        setOnboardingComplete(Boolean(JSON.parse(raw).completed));
      } catch {
        setOnboardingComplete(false);
      }
    }

    window.addEventListener("leanstreak:onboarding-complete", handleOnboardingUpdate);
    return () => window.removeEventListener("leanstreak:onboarding-complete", handleOnboardingUpdate);
  }, [user]);

  const hideNavigation = checkedOnboarding && !onboardingComplete && normalizedPath === "/home";

  if (loading || !checkedOnboarding) {
    return (
      <div className="relative min-h-screen pb-8 pt-2">
        <div className="relative mx-auto min-h-[calc(100vh-1rem)] max-w-xl rounded-[38px] bg-[linear-gradient(180deg,var(--shell-start)_0%,var(--shell-end)_100%)]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-28 pt-2">
      <div className="relative mx-auto flex min-h-[calc(100vh-1rem)] max-w-xl flex-col rounded-[38px] bg-[linear-gradient(180deg,var(--shell-start)_0%,var(--shell-end)_100%)]">
        <main className={hideNavigation ? "flex-1 overflow-hidden" : "flex-1 overflow-y-auto px-4 py-4"}>
          {children}
        </main>
        {!hideNavigation && <BottomNav />}
        {!hideNavigation && <NightBlocker />}
      </div>
    </div>
  );
}
