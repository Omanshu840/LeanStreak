"use client";

import {
  fetchTodayBudget,
  fetchTodayEntries,
  fetchUserCalorieGoal,
  upsertBudget,
  addFoodEntry,
  deleteFoodEntry,
  updateUserCalorieGoal,
} from "@/lib/supabase/calories";
import { useSession } from "@/hooks/useSession";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Database } from "@/types/database";
import { queryKeys } from "@/lib/query/queryKeys";
import { getTodayKey } from "@/lib/query/dayKey";

type FoodEntry = Database["public"]["Tables"]["food_entries"]["Row"];
type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface CalorieDashboard {
  budget: number;
  entries: FoodEntry[];
}

async function fetchCalorieDashboard(userId: string): Promise<CalorieDashboard> {
  const [budgetRow, entriesData, goal] = await Promise.all([
    fetchTodayBudget(userId),
    fetchTodayEntries(userId),
    fetchUserCalorieGoal(userId),
  ]);

  return {
    budget: budgetRow?.calorie_limit ?? goal ?? 2000,
    entries: entriesData,
  };
}

export function useCalorieBudget() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const dayKey = getTodayKey();
  const userId = user?.id;

  const calorieQuery = useQuery({
    queryKey: userId ? queryKeys.calories.today(userId, dayKey) : ["calories", "anonymous"],
    queryFn: () => fetchCalorieDashboard(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  const setBudgetMutation = useMutation({
    mutationFn: async (limit: number) => {
      const { error: budgetError } = await upsertBudget(userId!, limit);
      if (budgetError) throw budgetError;

      const { error: userError } = await updateUserCalorieGoal(userId!, limit);
      if (userError) throw userError;

      return limit;
    },
    onMutate: async (limit) => {
      setError(null);
      await queryClient.cancelQueries({
        queryKey: queryKeys.calories.today(userId!, dayKey),
      });

      const previous = queryClient.getQueryData<CalorieDashboard>(
        queryKeys.calories.today(userId!, dayKey)
      );

      if (previous) {
        queryClient.setQueryData<CalorieDashboard>(
          queryKeys.calories.today(userId!, dayKey),
          { ...previous, budget: limit }
        );
      }

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.calories.today(userId!, dayKey),
          context.previous
        );
      }
      setError("Failed to update budget.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.calories.today(userId!, dayKey),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.streak.summary(userId!),
      });
    },
  });

  const logFoodMutation = useMutation({
    mutationFn: async ({ description, calories, mealType }: {
      description: string;
      calories: number;
      mealType: MealType;
    }) => {
      const currentBudget = calorieQuery.data?.budget ?? 2000;
      const { error: budgetError } = await upsertBudget(userId!, currentBudget);
      if (budgetError) throw budgetError;

      const { data, error } = await addFoodEntry(userId!, description, calories, mealType);
      if (error || !data) throw error ?? new Error("Failed to add food entry");

      return data;
    },
    onMutate: () => setError(null),
    onError: () => setError("Failed to log food."),
    onSuccess: (newEntry) => {
      queryClient.setQueryData<CalorieDashboard>(
        queryKeys.calories.today(userId!, dayKey),
        (previous) => {
          if (!previous) return previous;
          return { ...previous, entries: [newEntry, ...previous.entries] };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.calories.today(userId!, dayKey),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.streak.summary(userId!),
      });
    },
  });

  const deleteFoodMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await deleteFoodEntry(entryId);
      if (error) throw error;
      return entryId;
    },
    onMutate: async (entryId) => {
      setError(null);
      await queryClient.cancelQueries({
        queryKey: queryKeys.calories.today(userId!, dayKey),
      });

      const previous = queryClient.getQueryData<CalorieDashboard>(
        queryKeys.calories.today(userId!, dayKey)
      );

      if (previous) {
        queryClient.setQueryData<CalorieDashboard>(
          queryKeys.calories.today(userId!, dayKey),
          {
            ...previous,
            entries: previous.entries.filter((entry) => entry.id !== entryId),
          }
        );
      }

      return { previous };
    },
    onError: (_err, _entryId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.calories.today(userId!, dayKey),
          context.previous
        );
      }
      setError("Failed to delete entry.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.calories.today(userId!, dayKey),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.streak.summary(userId!),
      });
    },
  });

  const budget = calorieQuery.data?.budget ?? 2000;
  const entries = calorieQuery.data?.entries ?? [];

  const consumed = entries.reduce((sum, entry) => sum + entry.calories, 0);
  const remaining = budget - consumed;
  const percent = Math.min(Math.round((consumed / Math.max(budget, 1)) * 100), 100);
  const isOver = consumed > budget;

  async function setBudgetGoal(limit: number) {
    if (!userId) return;
    await setBudgetMutation.mutateAsync(limit);
  }

  async function logFood(description: string, calories: number, mealType: MealType) {
    if (!userId) return false;

    try {
      await logFoodMutation.mutateAsync({ description, calories, mealType });
      return true;
    } catch {
      return false;
    }
  }

  async function removeEntry(entryId: string) {
    if (!userId) return;
    await deleteFoodMutation.mutateAsync(entryId);
  }

  return {
    budget,
    consumed,
    remaining,
    percent,
    isOver,
    entries,
    loading: calorieQuery.isPending,
    submitting:
      setBudgetMutation.isPending || logFoodMutation.isPending || deleteFoodMutation.isPending,
    error,
    setBudgetGoal,
    logFood,
    removeEntry,
    reload: calorieQuery.refetch,
  };
}
