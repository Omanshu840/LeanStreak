import { format, subDays } from "date-fns";

export interface DailyGoalStatus {
  date:        string;   // "yyyy-MM-dd"
  habitToday:  boolean;
  mindfulToday:boolean;
}

export interface StreakResult {
  goalsMet:       boolean;
  completedCount: number;
  totalGoals:     number;
  summary:        string;
}

// A streak day is complete if user did any one action:
// 1 habit completed OR 1 mindful eating check
export function evaluateDailyGoals(status: DailyGoalStatus): StreakResult {
  const goals = [
    status.habitToday,
    status.mindfulToday,
  ];
  const completedCount = goals.filter(Boolean).length;
  const totalGoals     = goals.length;
  const goalsMet       = status.habitToday || status.mindfulToday;

  const summary = goalsMet
    ? "Streak secured"
    : "No streak activity yet";

  return { goalsMet, completedCount, totalGoals, summary };
}

// Calculate new streak values after a day's result
export function calculateNewStreak(
  currentStreak: number,
  longestStreak:  number,
  lastCompleted:  string | null,
  goalsMet:       boolean
): { currentStreak: number; longestStreak: number } {
  const today     = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");

  if (!goalsMet) {
    if (!lastCompleted) {
      return { currentStreak: 0, longestStreak };
    }
    // User previously qualified today, then unchecked/removed activity.
    if (lastCompleted === today) {
      return { currentStreak: Math.max(0, currentStreak - 1), longestStreak };
    }
    // Keep streak alive during current day if yesterday was completed.
    if (lastCompleted === yesterday) {
      return { currentStreak, longestStreak };
    }
    // A full day was missed already.
    return { currentStreak: 0, longestStreak };
  }

  // First ever completion
  if (!lastCompleted) {
    return { currentStreak: 1, longestStreak: Math.max(1, longestStreak) };
  }

  // Already logged today — don't double count
  if (lastCompleted === today) {
    return { currentStreak, longestStreak };
  }

  // Consecutive day — extend streak
  if (lastCompleted === yesterday) {
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
    };
  }

  // Gap in days — restart streak
  return { currentStreak: 1, longestStreak };
}

// Check if streak is at risk (goals not yet done today)
export function isStreakAtRisk(lastCompleted: string | null): boolean {
  if (!lastCompleted) return false;
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  return lastCompleted === yesterday;  // completed yesterday but not today yet
}

// Build a 30-day history map for the calendar
export function buildCalendarDays(
  completedDates: string[]
): { date: string; completed: boolean; isToday: boolean; isFuture: boolean }[] {
  const dateSet = new Set(completedDates);
  const today   = format(new Date(), "yyyy-MM-dd");

  return Array.from({ length: 30 }, (_, i) => {
    const date    = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
    return {
      date,
      completed: dateSet.has(date),
      isToday:   date === today,
      isFuture:  false,
    };
  });
}

// Streak milestone labels
export function getStreakMilestone(streak: number): {
  label: string; emoji: string; color: string
} | null {
  if (streak >= 100) return { label: "Legendary",  emoji: "trophy", color: "text-yellow-500" };
  if (streak >= 30)  return { label: "On Fire",    emoji: "flame", color: "text-orange-500" };
  if (streak >= 14)  return { label: "Committed",  emoji: "strength", color: "text-blue-500" };
  if (streak >= 7)   return { label: "One Week",   emoji: "star", color: "text-green-500" };
  if (streak >= 3)   return { label: "Getting Hot", emoji: "sparkles", color: "text-[#6e7a96]" };
  return null;
}
