"use client";

import {
  fetchStreak,
  updateStreak,
  fetchTodayHabitStatus,
  fetchTodayMindfulStatus,
  fetchCompletedDates,
} from "@/lib/supabase/streaks";
import {
  evaluateDailyGoals,
  calculateNewStreak,
  isStreakAtRisk,
  buildCalendarDays,
  getStreakMilestone,
} from "@/utils/streakEngine";
import { useSession } from "@/hooks/useSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect } from "react";
import { queryKeys } from "@/lib/query/queryKeys";

interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  lastCompleted: string | null;
  habitToday: boolean;
  mindfulToday: boolean;
  completedDates: string[];
}

async function fetchStreakSummary(userId: string): Promise<StreakSummary> {
  const [streakRow, habitToday, mindfulToday, dates] = await Promise.all([
    fetchStreak(userId),
    fetchTodayHabitStatus(userId),
    fetchTodayMindfulStatus(userId),
    fetchCompletedDates(userId),
  ]);

  return {
    currentStreak: streakRow?.current_streak ?? 0,
    longestStreak: streakRow?.longest_streak ?? 0,
    lastCompleted: streakRow?.last_completed_date ?? null,
    habitToday,
    mindfulToday,
    completedDates: dates,
  };
}

export function useStreak() {
  const { user } = useSession();
  const queryClient = useQueryClient();

  const userId = user?.id;
  const today = format(new Date(), "yyyy-MM-dd");

  const streakQuery = useQuery({
    queryKey: userId ? queryKeys.streak.summary(userId) : ["streak", "anonymous"],
    queryFn: () => fetchStreakSummary(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60,
  });

  const summary = streakQuery.data;

  const dailyResult = evaluateDailyGoals({
    date: today,
    habitToday: summary?.habitToday ?? false,
    mindfulToday: summary?.mindfulToday ?? false,
  });

  const atRisk = isStreakAtRisk(summary?.lastCompleted ?? null) && !dailyResult.goalsMet;
  const milestone = getStreakMilestone(summary?.currentStreak ?? 0);
  const calendarDays = buildCalendarDays(summary?.completedDates ?? []);

  const evaluateMutation = useMutation({
    mutationFn: async () => {
      const current = summary?.currentStreak ?? 0;
      const longest = summary?.longestStreak ?? 0;
      const lastCompleted = summary?.lastCompleted ?? null;
      const previousCompletedDate = (summary?.completedDates ?? [])
        .filter((d) => d < today)
        .sort()
        .at(-1) ?? null;

      const { goalsMet } = evaluateDailyGoals({
        date: today,
        habitToday: summary?.habitToday ?? false,
        mindfulToday: summary?.mindfulToday ?? false,
      });

      const { currentStreak: newCurrent, longestStreak: newLongest } = calculateNewStreak(
        current,
        longest,
        lastCompleted,
        goalsMet
      );

      const newLastCompleted = goalsMet
        ? today
        : lastCompleted === today
          ? previousCompletedDate
          : lastCompleted;

      await updateStreak(userId!, newCurrent, newLongest, newLastCompleted);

      return {
        goalsMet,
        currentStreak: newCurrent,
        longestStreak: newLongest,
        lastCompleted: newLastCompleted,
      };
    },
    onSuccess: (result) => {
      queryClient.setQueryData<StreakSummary>(queryKeys.streak.summary(userId!), (previous) => {
        if (!previous) return previous;

        const hasToday = previous.completedDates.includes(today);
        return {
          ...previous,
          currentStreak: result.currentStreak,
          longestStreak: result.longestStreak,
          lastCompleted: result.lastCompleted,
          completedDates:
            result.goalsMet
              ? (hasToday ? previous.completedDates : [...previous.completedDates, today])
              : previous.completedDates.filter((date) => date !== today),
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.streak.summary(userId!) });
    },
  });

  useEffect(() => {
    if (!userId || !summary || evaluateMutation.isPending) return;

    const recalculated = calculateNewStreak(
      summary.currentStreak,
      summary.longestStreak,
      summary.lastCompleted,
      dailyResult.goalsMet
    );

    const shouldSync =
      recalculated.currentStreak !== summary.currentStreak ||
      recalculated.longestStreak !== summary.longestStreak ||
      (dailyResult.goalsMet && summary.lastCompleted !== today);

    if (shouldSync) {
      void evaluateMutation.mutateAsync();
    }
  }, [
    userId,
    summary,
    today,
    dailyResult.goalsMet,
    evaluateMutation,
  ]);

  return {
    currentStreak: summary?.currentStreak ?? 0,
    longestStreak: summary?.longestStreak ?? 0,
    lastCompleted: summary?.lastCompleted ?? null,
    habitToday: summary?.habitToday ?? false,
    mindfulToday: summary?.mindfulToday ?? false,
    dailyResult,
    atRisk,
    milestone,
    calendarDays,
    completedDates: summary?.completedDates ?? [],
    loading: streakQuery.isPending,
    reload: streakQuery.refetch,
  };
}
