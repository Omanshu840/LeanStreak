"use client";

import { EmojiIcon } from "@/components/ui";
import { REASONS, type EatReason } from "@/data/eatPrompts";
import { cn } from "@/utils/cn";

interface Props {
  onSelect:   (reason: EatReason) => void;
  submitting: boolean;
}

export function ReasonSelector({ onSelect, submitting }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#7a89a8] dark:text-[var(--muted)]">Step 1</p>
        <h2 className="text-xl font-bold text-[#1f2a44] dark:text-[var(--foreground)]">
          Pause for a moment.
        </h2>
        <p className="text-sm text-[#6e7a96] dark:text-[var(--muted)] mt-1">
          Why are you eating?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {REASONS.map(({ value, label, emoji, description }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            disabled={submitting}
            className={cn(
              "flex flex-col items-start gap-1.5 p-4 rounded-2xl border-2",
              "bg-[#ffffff] text-left transition-all duration-150",
              "active:scale-95 disabled:opacity-50",
              "border-[#d8e1f2] hover:border-green-300 hover:bg-green-50",
              "dark:bg-[var(--card)] dark:border-[var(--card-border)] dark:hover:border-green-700/60 dark:hover:bg-green-950/40"
            )}
          >
            <EmojiIcon emoji={emoji} size={22} className="text-[#607195] dark:text-[#9fb2d8]" />
            <span className="text-sm font-bold text-[#1f2a44] dark:text-[var(--foreground)]">{label}</span>
            <span className="text-xs text-[#8a96b0] leading-snug dark:text-[var(--muted)]">{description}</span>
          </button>
        ))}
      </div>

      {submitting && (
        <p className="text-center text-xs text-[#8a96b0] dark:text-[var(--muted)] animate-pulse">
          Saving your response…
        </p>
      )}
    </div>
  );
}
