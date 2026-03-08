import { cn } from "@/utils/cn";
import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(140deg,var(--brand-start),var(--brand-end))] text-white shadow-[var(--brand-shadow)] hover:brightness-105",
  secondary:
    "bg-[var(--surface)] border border-[var(--card-border)] text-[var(--foreground)] hover:bg-[var(--accent-soft)]",
  ghost: "bg-transparent text-[var(--muted)] hover:bg-[var(--surface)]",
  danger:
    "bg-[linear-gradient(140deg,var(--danger-start),var(--danger-end))] text-white shadow-[var(--danger-shadow)] hover:brightness-105",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-2 text-sm rounded-xl",
  md: "px-5 py-3 text-sm rounded-2xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
