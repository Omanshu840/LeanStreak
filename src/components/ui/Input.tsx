import { cn } from "@/utils/cn";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[var(--foreground)]">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--field-icon)]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-2xl border border-[var(--card-border)] bg-[var(--field-bg)] px-4 py-3 text-sm text-[var(--foreground)]",
              "placeholder:text-[var(--field-placeholder)] outline-none transition",
              "focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--focus-ring)]",
              error && "border-[#ef8694] focus:border-[#ef8694] focus:ring-[#ffd9de]",
              leftIcon && "pl-10",
              className
            )}
            {...props}
          />
        </div>

        {hint && !error && <p className="text-xs text-[var(--muted)]">{hint}</p>}
        {error && <p className="text-xs text-[#df5367]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
