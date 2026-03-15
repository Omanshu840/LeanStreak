"use client";

import { Card, EmojiIcon } from "@/components/ui";
import { StreakBadge } from "./StreakBadge";
import { StreakCalendar } from "./StreakCalendar";
import { useStreak } from "@/hooks/useStreak";

export function StreakCard() {
  const {
    currentStreak,
    longestStreak,
    dailyResult,
    atRisk,
    calendarDays,
    loading,
  } = useStreak();

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 rounded-2xl bg-[#edf2fd] dark:bg-[#1c2a46]" />
        <div className="h-48 rounded-2xl bg-[#edf2fd] dark:bg-[#1c2a46]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Streak hero */}
      <Card bordered className="space-y-3 py-6 text-center">
        <StreakBadge streak={currentStreak} atRisk={atRisk} size="lg" />

        {atRisk && (
          <div className="mx-2 rounded-xl border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900 px-4 py-2.5">
            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-orange-600 dark:text-orange-300">
              <EmojiIcon emoji="⚠️" size={14} className="text-orange-600 dark:text-orange-300" />
              Complete 1 habit or 1 mindful check to keep your streak!
            </p>
          </div>
        )}

        {dailyResult.goalsMet && (
          <div className="mx-2 rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900 px-4 py-2.5">
            <p className="flex items-center justify-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-300">
              <EmojiIcon emoji="🎉" size={14} className="text-green-600 dark:text-green-300" />
              Streak condition met. You&apos;re safe for today.
            </p>
          </div>
        )}

        <div className="flex justify-center gap-6 pt-1">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[var(--foreground)]">
              {currentStreak}
            </p>
            <p className="text-xs text-[var(--muted)]">Current</p>
          </div>
          <div className="w-px bg-[var(--line)]" />
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[var(--foreground)]">
              {longestStreak}
            </p>
            <p className="text-xs text-[var(--muted)]">Best</p>
          </div>
        </div>
      </Card>

      <Card bordered>
        <Card.Header>
          <Card.Title>Streak History</Card.Title>
        </Card.Header>
        <StreakCalendar days={calendarDays} />
      </Card>
    </div>
  );
}
