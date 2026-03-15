"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  UtensilsCrossed,
  ChartNoAxesColumnIncreasing,
  ShieldAlert,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Card, Modal, ProgressBar } from "@/components/ui";
import { useStreak } from "@/hooks/useStreak";
import { useCalorieBudget } from "@/hooks/useCalorieBudget";
import { useHabits } from "@/hooks/useHabits";
import { useNightBlocker } from "@/hooks/useNightBlocker";
import { DailyGoalChecklist } from "@/components/features/streak/DailyGoalChecklist";
import { BeforeYouEat } from "@/components/features/eat-prompt/BeforeYouEat";
import { DamageCalculator } from "@/components/features/restaurant/DamageCalculator";
import { EmojiIcon } from "@/components/ui";
import { QuickFoodLogForm } from "./QuickFoodLogForm";
import { cn } from "@/utils/cn";

export function HomeDashboard() {
  const [activeModal, setActiveModal] = useState<"eat" | "log" | "damage" | null>(null);

  const { currentStreak, habitToday, mindfulToday, dailyResult } = useStreak();
  const { budget, consumed, remaining, submitting, logFood } = useCalorieBudget();
  const { habits, toggleHabit, toggling } = useHabits();
  const { timeLabel } = useNightBlocker();

  const todayHabits = habits.slice(0, 3);
  const quickActions = [
    {
      id: "eat" as const,
      title: "Mindful pre eating check",
      shortTitle: "Mindful Eating",
      subtitle: "Pause impulsive cravings in 60 seconds",
      icon: Brain,
      cta: "Start check-in",
      tone: "from-[var(--surface)] to-[var(--card)] border-[var(--card-border)]",
    },
    {
      id: "log" as const,
      title: "Log Food",
      shortTitle: "Log Food",
      subtitle: "Track calories before they add up",
      icon: UtensilsCrossed,
      cta: "Quick add",
      tone: "from-[var(--surface)] to-[var(--card)] border-[var(--card-border)]",
    },
    {
      id: "damage" as const,
      title: "Junk Food Damage",
      shortTitle: "Junk Food Damage",
      subtitle: "Estimate impact before ordering out",
      icon: ChartNoAxesColumnIncreasing,
      cta: "Open calculator",
      tone: "from-[var(--surface)] to-[var(--card)] border-[var(--card-border)]",
    },
  ] satisfies {
    id: "eat" | "log" | "damage";
    title: string;
    shortTitle: string;
    subtitle: string;
    icon: LucideIcon;
    cta: string;
    tone: string;
  }[];

  async function quickLog(food: string, calories: number) {
    return logFood(food, calories, "snack");
  }

  return (
    <div className="space-y-4 pb-2">
      <Card bordered className="overflow-hidden p-0">
        <div className="bg-[linear-gradient(130deg,#1c2c4d,#355fbc)] dark:bg-[linear-gradient(130deg,#111a2f,#2a4f93)] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Daily Loop</p>
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-extrabold">
            <EmojiIcon emoji="🔥" className="text-white" size={22} />
            {currentStreak} Day Streak
          </h2>
          <p className="mt-1 text-sm text-white/80">Tiny daily decisions → big results</p>
        </div>
        <div className="space-y-3 px-5 py-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Calories Left</p>
              <p className="text-2xl font-extrabold text-[var(--foreground)]">{Math.max(remaining, 0)}</p>
            </div>
            <p className="text-sm font-semibold text-[var(--muted)]">{consumed} / {budget}</p>
          </div>
          <ProgressBar value={consumed} max={budget} showLabel={false} />
          <p className="text-xs text-[var(--muted)]">{timeLabel}</p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {quickActions.map((action) => (
              <button
                key={`header-${action.id}`}
                type="button"
                onClick={() => setActiveModal(action.id)}
                className="min-w-0 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] px-2 py-2.5 transition-colors hover:bg-[var(--accent-soft)]"
              >
                <div className="flex flex-col items-center gap-1.5">
                  <div className="rounded-lg bg-[var(--card)] p-2.5">
                    <action.icon size={22} className="text-[var(--accent)] dark:text-[#a8c5ff]" strokeWidth={2.2} />
                  </div>
                  <p className="text-center text-[11px] font-bold leading-tight text-[var(--foreground)]">
                    {action.shortTitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card bordered>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>Today&apos;s Streak</Card.Title>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                  dailyResult.goalsMet
                    ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                    : "bg-[var(--surface)] text-[var(--muted)]"
                }`}
              >
                {dailyResult.goalsMet ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                {dailyResult.goalsMet ? "Protected" : "At risk"}
              </span>
            </div>
          </div>
        </Card.Header>

        <DailyGoalChecklist
          habitToday={habitToday}
          mindfulToday={mindfulToday}
        />
      </Card>

      <Card bordered>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--foreground)]">Today&apos;s Habits</h3>
          <Link href="/habits" className="text-xs font-semibold text-[var(--accent)]">Open habits</Link>
        </div>
        <div className="space-y-2">
          {todayHabits.map((habit) => (
            <button
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              disabled={toggling === habit.id}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left",
                habit.completed
                  ? "border-[#9bdfb8] bg-green-100 dark:border-green-700 dark:bg-green-900"
                  : "border-[var(--card-border)] bg-[var(--card)]"
              )}
            >
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
                <EmojiIcon emoji={habit.emoji ?? "✅"} size={14} />
                {habit.habit_name}
              </span>
              <span className={cn("text-xs font-bold", habit.completed ? "text-green-600 dark:text-green-300" : "text-[var(--muted)]")}>{habit.completed ? "Done" : "Tap"}</span>
            </button>
          ))}
          {todayHabits.length === 0 && (
            <p className="rounded-2xl border border-dashed border-[var(--card-border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
              Add 3 habits to start your daily loop.
            </p>
          )}
        </div>
      </Card>

      <Card bordered>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--foreground)]">Quick Actions</h3>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Pick one now
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => setActiveModal(action.id)}
              className={cn(
                "group rounded-2xl border bg-gradient-to-br p-4 text-left transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-[0_14px_26px_rgba(30,57,112,0.12)]",
                "active:translate-y-0 active:shadow-none",
                action.tone
              )}
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-[var(--card)]/80 p-2 shadow-sm">
                  <action.icon size={18} className="text-[#385a9e] dark:text-[#9cb9ff]" strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">
                  {action.cta}
                </span>
              </div>
              <p className="mt-3 text-sm font-extrabold text-[var(--foreground)]">
                {action.title}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{action.subtitle}</p>
            </button>
          ))}
        </div>
      </Card>

      <Modal
        open={activeModal === "eat"}
        onClose={() => setActiveModal(null)}
        title="Pause for a moment"
        size="lg"
      >
        <BeforeYouEat
          onLogFood={() => setActiveModal("log")}
          onSkipSnack={() => setActiveModal(null)}
          onJunkFoodDamage={() => setActiveModal("damage")}
        />
      </Modal>

      <Modal
        open={activeModal === "log"}
        onClose={() => setActiveModal(null)}
        title="Add Calories"
      >
        <QuickFoodLogForm
          onSave={quickLog}
          onClose={() => setActiveModal(null)}
          loading={submitting}
        />
      </Modal>

      <Modal
        open={activeModal === "damage"}
        onClose={() => setActiveModal(null)}
        title="Junk Food Damage Calculator"
        size="lg"
      >
        <DamageCalculator />
      </Modal>
    </div>
  );
}
