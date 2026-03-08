"use client";

import {
  fetchHabits,
  fetchTodayLogs,
  fetchWeeklyLogs,
  addHabit,
  deleteHabit,
  toggleHabitLog,
} from "@/lib/supabase/habits";
import { useSession } from "@/hooks/useSession";
import { format, subDays } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { Database } from "@/types/database";
import { queryKeys } from "@/lib/query/queryKeys";
import { getTodayKey } from "@/lib/query/dayKey";

type Habit = Database["public"]["Tables"]["habits"]["Row"];
type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];

export interface HabitWithStatus extends Habit {
  completed: boolean;
  logId: string | null;
}

export interface WeekDay {
  date: string;
  label: string;
}

interface HabitsDashboard {
  habits: HabitWithStatus[];
  weeklyLogs: HabitLog[];
}

interface CreateHabitVars {
  habitName: string;
  emoji: string;
  sortOrder: number;
}

async function fetchHabitsDashboard(userId: string): Promise<HabitsDashboard> {
  const [rawHabits, todayLogs, weekLogs] = await Promise.all([
    fetchHabits(userId),
    fetchTodayLogs(userId),
    fetchWeeklyLogs(userId),
  ]);

  const logMap = new Map(todayLogs.map((log) => [log.habit_id, log]));
  const habits = rawHabits.map((habit) => ({
    ...habit,
    completed: logMap.get(habit.id)?.completed ?? false,
    logId: logMap.get(habit.id)?.id ?? null,
  }));

  return { habits, weeklyLogs: weekLogs };
}

export function useHabits() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const dayKey = getTodayKey();
  const userId = user?.id;

  const habitsQuery = useQuery({
    queryKey: userId ? queryKeys.habits.dashboard(userId, dayKey) : ["habits", "anonymous"],
    queryFn: () => fetchHabitsDashboard(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      const { error } = await toggleHabitLog(habitId, userId!, completed);
      if (error) throw error;
      return { habitId, completed };
    },
    onMutate: async ({ habitId, completed }) => {
      setError(null);
      await queryClient.cancelQueries({ queryKey: queryKeys.habits.dashboard(userId!, dayKey) });

      const previous = queryClient.getQueryData<HabitsDashboard>(
        queryKeys.habits.dashboard(userId!, dayKey)
      );

      if (previous) {
        queryClient.setQueryData<HabitsDashboard>(
          queryKeys.habits.dashboard(userId!, dayKey),
          {
            ...previous,
            habits: previous.habits.map((habit) =>
              habit.id === habitId ? { ...habit, completed } : habit
            ),
          }
        );
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.habits.dashboard(userId!, dayKey), context.previous);
      }
      setError("Failed to update habit.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.dashboard(userId!, dayKey) });
      queryClient.invalidateQueries({ queryKey: queryKeys.streak.summary(userId!) });
    },
  });

  const createMutation = useMutation<Habit, Error, CreateHabitVars>({
    mutationFn: async ({ habitName, emoji, sortOrder }) => {
      const { data, error } = await addHabit(userId!, habitName, emoji, sortOrder);
      if (error || !data) throw error ?? new Error("Failed to add habit");
      return data;
    },
    onMutate: () => setError(null),
    onError: () => setError("Failed to add habit."),
    onSuccess: (habit) => {
      queryClient.setQueryData<HabitsDashboard>(
        queryKeys.habits.dashboard(userId!, dayKey),
        (previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            habits: [...previous.habits, { ...habit, completed: false, logId: null }],
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.dashboard(userId!, dayKey) });
      queryClient.invalidateQueries({ queryKey: queryKeys.streak.summary(userId!) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await deleteHabit(habitId);
      if (error) throw error;
      return habitId;
    },
    onMutate: async (habitId) => {
      setError(null);
      await queryClient.cancelQueries({ queryKey: queryKeys.habits.dashboard(userId!, dayKey) });

      const previous = queryClient.getQueryData<HabitsDashboard>(
        queryKeys.habits.dashboard(userId!, dayKey)
      );

      if (previous) {
        queryClient.setQueryData<HabitsDashboard>(
          queryKeys.habits.dashboard(userId!, dayKey),
          {
            ...previous,
            habits: previous.habits.filter((habit) => habit.id !== habitId),
          }
        );
      }

      return { previous };
    },
    onError: (_err, _habitId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.habits.dashboard(userId!, dayKey), context.previous);
      }
      setError("Failed to remove habit.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits.dashboard(userId!, dayKey) });
      queryClient.invalidateQueries({ queryKey: queryKeys.streak.summary(userId!) });
    },
  });

  const weekDays: WeekDay[] = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = subDays(new Date(), 6 - index);
        return {
          date: format(date, "yyyy-MM-dd"),
          label: format(date, "EEE"),
        };
      }),
    []
  );

  const habits = habitsQuery.data?.habits ?? [];
  const weeklyLogs = habitsQuery.data?.weeklyLogs ?? [];

  const completed = habits.filter((habit) => habit.completed).length;
  const total = habits.length;
  const allDone = total > 0 && completed === total;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  async function toggleHabit(habitId: string) {
    if (!userId || toggleMutation.isPending) return;

    const habit = habits.find((entry) => entry.id === habitId);
    if (!habit) return;

    await toggleMutation.mutateAsync({ habitId, completed: !habit.completed });
  }

  async function createHabit(habitName: string, emoji: string) {
    if (!userId) return false;

    try {
      await createMutation.mutateAsync({
        habitName,
        emoji,
        sortOrder: habits.length,
      });
      return true;
    } catch {
      return false;
    }
  }

  async function removeHabit(habitId: string) {
    if (!userId) return;
    await deleteMutation.mutateAsync(habitId);
  }

  function getHabitWeekMap(habitId: string): Record<string, boolean> {
    const map: Record<string, boolean> = {};

    weekDays.forEach(({ date }) => {
      map[date] = false;
    });

    weeklyLogs
      .filter((log) => log.habit_id === habitId && log.completed)
      .forEach((log) => {
        map[log.date] = true;
      });

    return map;
  }

  return {
    habits,
    weekDays,
    completed,
    total,
    allDone,
    progressPercent,
    loading: habitsQuery.isPending,
    toggling: toggleMutation.isPending ? toggleMutation.variables?.habitId ?? null : null,
    submitting: createMutation.isPending,
    error,
    toggleHabit,
    createHabit,
    removeHabit,
    getHabitWeekMap,
    reload: habitsQuery.refetch,
  };
}
