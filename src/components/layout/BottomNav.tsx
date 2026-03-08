"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Utensils, CheckSquare, Flame, User } from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Eat", href: "/eat", icon: Utensils },
  { label: "Habits", href: "/habits", icon: CheckSquare },
  { label: "Streak", href: "/streak", icon: Flame },
  { label: "Profile", href: "/profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const stripBasePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
  const normalizedPath = stripBasePath !== "/" && stripBasePath.endsWith("/")
    ? stripBasePath.slice(0, -1)
    : stripBasePath;

  return (
    <nav className="fixed bottom-5 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-md mx-auto !rounded-[50] soft-card px-3 py-3 pointer-events-auto">
        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = normalizedPath === href || normalizedPath.startsWith(`${href}/`);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-full py-3 px-4 text-xs font-semibold transition-all",
                    active
                      ? "bg-[linear-gradient(140deg,var(--brand-start),var(--brand-end))] text-white shadow-[0_8px_20px_rgba(75,120,222,0.42)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface)]"
                  )}
                >
                  <Icon size={16} strokeWidth={active ? 2.6 : 2.2} />
                  {active && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
