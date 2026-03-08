"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/home": { title: "LeanStreak", subtitle: "Keep your momentum" },
  "/eat": { title: "Eat Smart", subtitle: "Mindful meals, better days" },
  "/habits": { title: "Habits", subtitle: "Daily consistency tracker" },
  "/streak": { title: "Streak", subtitle: "Protect your run" },
  "/profile": { title: "Profile", subtitle: "Preferences and goals" },
};

export function TopBar() {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const stripBasePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
  const normalizedPath = stripBasePath !== "/" && stripBasePath.endsWith("/")
    ? stripBasePath.slice(0, -1)
    : stripBasePath;
  const current = PAGE_TITLES[normalizedPath] ?? PAGE_TITLES["/home"];

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 pb-3 backdrop-blur-sm">
      <div className="soft-card px-3.5 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 overflow-hidden rounded-2xl border border-[var(--card-border)] shadow-[0_10px_20px_rgba(76,111,187,0.16)]">
              <Image
                src={`${basePath}/logo.png`}
                alt="LeanStreak logo"
                width={44}
                height={44}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.11em] text-[var(--muted)] font-semibold">Dashboard</p>
              <h1 className="text-base font-bold text-[var(--foreground)] truncate">{current.title}</h1>
              <p className="text-xs text-[var(--muted)] truncate">{current.subtitle}</p>
            </div>
          </div>

          <button
            aria-label="Notifications"
            className="h-11 w-11 rounded-full border border-[var(--card-border)] bg-[var(--surface)] text-[var(--foreground)] flex items-center justify-center shadow-[0_8px_20px_rgba(56,81,132,0.1)] transition hover:bg-[var(--card)]"
          >
            <Bell size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}
