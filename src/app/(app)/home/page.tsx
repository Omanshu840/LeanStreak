"use client";

import { useEffect, useMemo, useState } from "react";
import { OnboardingFlow } from "@/components/features/onboarding/OnboardingFlow";
import { HomeDashboard } from "@/components/features/home/HomeDashboard";
import { useSession } from "@/hooks/useSession";
import { useCalorieBudget } from "@/hooks/useCalorieBudget";
import { useHabits } from "@/hooks/useHabits";

interface OnboardingRecord {
  completed: boolean;
  completedAt?: string;
}

function getOnboardingKey(userId: string) {
  return `leanstreak:onboarding:${userId}`;
}

export default function HomePage() {
  const { user, loading: loadingSession } = useSession();
  const { setBudgetGoal } = useCalorieBudget();
  const { habits, createHabit } = useHabits();

  const [loaded, setLoaded] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  const habitNames = useMemo(
    () => new Set(habits.map((entry) => entry.habit_name.toLowerCase())),
    [habits]
  );

  useEffect(() => {
    if (!user) return;

    const raw = localStorage.getItem(getOnboardingKey(user.id));
    if (!raw) {
      setCompleted(false);
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as OnboardingRecord;
      setCompleted(Boolean(parsed.completed));
    } catch {
      setCompleted(false);
    }

    setLoaded(true);
  }, [user]);

  async function completeOnboarding(data: {
    calorieBudget: number;
    habits: { name: string; emoji: string }[];
  }) {
    if (!user) return;

    setSaving(true);
    try {
      await setBudgetGoal(data.calorieBudget);

      for (const habit of data.habits) {
        if (habitNames.has(habit.name.toLowerCase())) continue;
        await createHabit(habit.name, habit.emoji);
      }

      const record: OnboardingRecord = {
        completed: true,
        completedAt: new Date().toISOString(),
      };

      localStorage.setItem(getOnboardingKey(user.id), JSON.stringify(record));
      window.dispatchEvent(new Event("leanstreak:onboarding-complete"));
      setCompleted(true);
    } finally {
      setSaving(false);
    }
  }

  if (loadingSession || !loaded) {
    return (
      <div className="space-y-3">
        <div className="h-28 animate-pulse rounded-3xl bg-[#e5ecfb]" />
        <div className="h-80 animate-pulse rounded-3xl bg-[#e5ecfb]" />
      </div>
    );
  }

  if (!completed) {
    return <OnboardingFlow onComplete={completeOnboarding} submitting={saving} />;
  }

  return <HomeDashboard />;
}
