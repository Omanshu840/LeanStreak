"use client";

import {
  formatSteps, formatMinutes, VERDICT_META,
  type DamageResult as Result,
} from "@/utils/damageCalculator";
import { EmojiIcon } from "@/components/ui";
import { cn } from "@/utils/cn";

interface Props {
  result: Result;
}

const BURN_ACTIVITIES = [
  { key: "walkingMinutes" as const, emoji: "🚶", label: "Walking"  },
  { key: "runningMinutes" as const, emoji: "🏃", label: "Running"  },
  { key: "cyclingMinutes" as const, emoji: "🚴", label: "Cycling"  },
];

export function DamageResult({ result }: Props) {
  const meta = VERDICT_META[result.verdict];

  return (
    <div className="space-y-3">

      {/* Total calorie + verdict */}
      <div className={cn(
        "rounded-2xl border-2 p-5 text-center space-y-1",
        meta.bg, meta.border
      )}>
        <p className="text-xs font-semibold text-[#6e7a96] dark:text-[var(--muted)] uppercase tracking-wide">
          Total Calories
        </p>
        <p className={cn("text-5xl font-extrabold", meta.color)}>
          {result.totalCalories}
        </p>
        <p className="text-sm font-medium text-[#6e7a96] dark:text-[var(--muted)]">kcal</p>
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-2",
          "text-sm font-bold", meta.bg, meta.color,
          "border", meta.border
        )}>
          <EmojiIcon emoji={meta.emoji} size={14} className={meta.color} />
          {meta.label}
        </div>
      </div>

      {/* Steps to burn */}
      <div className="bg-[#f4f7ff] border border-[#d8e1f2] rounded-2xl px-4 py-4 dark:bg-[#1c2a46] dark:border-[var(--card-border)]">
        <p className="text-xs font-semibold text-[#8a96b0] dark:text-[var(--muted)] uppercase tracking-wide mb-3">
          Steps to Burn It Off
        </p>
        <div className="flex items-center gap-3">
          <EmojiIcon emoji="👟" size={24} className="text-[#607195] dark:text-[#9fb2d8]" />
          <div>
            <p className="text-2xl font-extrabold text-[#1f2a44] dark:text-[var(--foreground)]">
              {formatSteps(result.steps)}
            </p>
            <p className="text-xs text-[#8a96b0] dark:text-[var(--muted)]">at ~70 kcal/1000 steps</p>
          </div>
        </div>
      </div>

      {/* Burn activity breakdown */}
      <div className="bg-[#f4f7ff] border border-[#d8e1f2] rounded-2xl px-4 py-4 space-y-3 dark:bg-[#1c2a46] dark:border-[var(--card-border)]">
        <p className="text-xs font-semibold text-[#8a96b0] dark:text-[var(--muted)] uppercase tracking-wide">
          Or Burn By Activity
        </p>
        {BURN_ACTIVITIES.map(({ key, emoji, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-8 shrink-0 text-center">
              <EmojiIcon emoji={emoji} size={16} className="mx-auto text-[#607195] dark:text-[#9fb2d8]" />
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[#334368] dark:text-[#c7d5f0]">{label}</span>
                <span className="text-sm font-bold text-[#1f2a44] dark:text-[var(--foreground)]">
                  {formatMinutes(result[key])}
                </span>
              </div>
              {/* Visual effort bar */}
              <div className="h-1.5 bg-[#e4ebfb] rounded-full overflow-hidden dark:bg-[#223255]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    result.verdict === "light"    ? "bg-green-400"  :
                    result.verdict === "moderate" ? "bg-yellow-400" :
                    result.verdict === "heavy"    ? "bg-orange-400" : "bg-red-400"
                  )}
                  style={{
                    // Normalize bar width: cap at 120 min = 100%
                    width: `${Math.min((result[key] / 120) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Burpees fun fact */}
      <div className="flex items-center gap-3 bg-purple-50 border border-purple-100
                      rounded-2xl px-4 py-3 dark:bg-purple-950/35 dark:border-purple-900/60">
        <EmojiIcon emoji="🏋️" size={18} className="text-purple-700 dark:text-purple-200" />
        <p className="text-sm text-purple-700 dark:text-purple-200">
          That&apos;s <span className="font-extrabold">{result.burpees} burpees</span> to
          burn off. No pressure.
        </p>
      </div>

    </div>
  );
}
