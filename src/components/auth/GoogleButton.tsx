import { cn } from "@/utils/cn";
import { type ButtonHTMLAttributes } from "react";

interface GoogleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function GoogleButton({ loading, className, ...props }: GoogleButtonProps) {
  return (
    <button
      disabled={loading}
      className={cn(
        "w-full flex items-center justify-center gap-3 px-4 py-3",
        "bg-[#ffffff] border border-[#d8e1f2] rounded-2xl",
        "text-sm font-semibold text-[#334368]",
        "hover:bg-[#f4f7ff] active:scale-95 transition-all duration-150",
        "dark:bg-[var(--card)] dark:border-[var(--card-border)] dark:text-[#c7d5f0] dark:hover:bg-[#1c2a46]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-sm",
        className
      )}
      {...props}
    >
      {/* Google SVG icon — no external dependency */}
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4.5 24 4.5 12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5c11 0 20.5-8 20.5-20.5 0-1.4-.1-2.7-.4-4z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4.5 24 4.5c-7.7 0-14.3 4.4-17.7 10.2z"/>
        <path fill="#4CAF50" d="M24 45.5c5.2 0 9.9-1.9 13.5-5L31 35c-2 1.4-4.5 2.2-7 2.2-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.9 41.3 16.5 45.5 24 45.5z"/>
        <path fill="#1565C0" d="M43.6 20H24v8h11.3c-.8 2.2-2.3 4-4.2 5.2l6.5 5.1C41.3 35 44 30.5 44 24.5c0-1.4-.1-2.7-.4-4z"/>
      </svg>
      {loading ? "Redirecting..." : "Continue with Google"}
    </button>
  );
}
