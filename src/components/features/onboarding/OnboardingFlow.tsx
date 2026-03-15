"use client";

import { Button, Card, EmojiIcon, Input } from "@/components/ui";
import { cn } from "@/utils/cn";
import { useMemo, useState } from "react";

export type ChallengeType = "late-night" | "snacking" | "no-exercise" | "emotional";

interface OnboardingData {
  challenge: ChallengeType;
  currentWeight: number;
  goalWeight: number;
  calorieBudget: number;
  habits: HabitChoice[];
}

interface Props {
  onComplete: (data: OnboardingData) => Promise<void>;
  submitting?: boolean;
}

interface HabitChoice {
  name: string;
  emoji: string;
}

const CHALLENGES: { value: ChallengeType; label: string; hint: string }[] = [
  { value: "late-night", label: "Late night eating", hint: "Night cravings" },
  { value: "snacking", label: "Snacking too often", hint: "Frequent bites" },
  { value: "no-exercise", label: "No exercise", hint: "Low movement" },
  { value: "emotional", label: "Emotional eating", hint: "Stress-led eating" },
];

const HABIT_OPTIONS: HabitChoice[] = [
  { name: "Drink 8 glasses water", emoji: "💧" },
  { name: "Walk 10 minutes", emoji: "🚶" },
  { name: "Avoid sugary drinks", emoji: "🥤" },
  { name: "Stretch", emoji: "🧘" },
  { name: "Pause before snacks", emoji: "⏸️" },
  { name: "No food after 9:30 PM", emoji: "🌙" },
];

function suggestBudget(currentWeight: number, goalWeight: number): number {
  if (!currentWeight || !goalWeight) return 2000;
  const maintenance = currentWeight * 22;
  const deficit = currentWeight > goalWeight ? 400 : 200;
  return Math.max(1200, Math.min(2600, Math.round(maintenance - deficit)));
}

export function OnboardingFlow({ onComplete, submitting = false }: Props) {
  const [step, setStep] = useState(1);
  const [challenge, setChallenge] = useState<ChallengeType | null>(null);
  const [currentWeight, setCurrentWeight] = useState(78);
  const [goalWeight, setGoalWeight] = useState(72);
  const [calorieBudget, setCalorieBudget] = useState(2000);
  const [habits, setHabits] = useState<HabitChoice[]>([]);

  const autoBudget = useMemo(
    () => suggestBudget(currentWeight, goalWeight),
    [currentWeight, goalWeight]
  );

  const canContinue =
    (step === 1 && true) ||
    (step === 2 && challenge !== null) ||
    (step === 3 && currentWeight > 0 && goalWeight > 0 && calorieBudget > 0) ||
    (step === 4 && habits.length === 3) ||
    (step >= 5 && true);

  function toggleHabit(choice: HabitChoice) {
    setHabits((prev) => {
      const exists = prev.some((habit) => habit.name === choice.name);
      if (exists) return prev.filter((habit) => habit.name !== choice.name);
      if (prev.length >= 3) return prev;
      return [...prev, choice];
    });
  }

  async function finishOnboarding() {
    if (!challenge || habits.length !== 3) return;
    await onComplete({
      challenge,
      currentWeight,
      goalWeight,
      calorieBudget,
      habits,
    });
  }

  return (
    <Card
      bordered
      className="flex h-full min-h-[calc(100vh-1rem)] flex-col overflow-hidden rounded-none border-0 p-0 shadow-none"
    >
      <div className="border-b border-[#e1e8f7] bg-[linear-gradient(135deg,#edffef_0%,#f4f9ff_46%,#fff8e8_100%)] px-5 py-4 dark:border-[var(--card-border)] dark:bg-[linear-gradient(135deg,#14213b_0%,#162846_46%,#1b2336_100%)]">
        <p className="text-xs font-bold uppercase tracking-wide text-[#5f6e8d] dark:text-[var(--muted)]">Step {Math.min(step, 6)} of 6</p>
        <div className="mt-2 h-2 rounded-full bg-white/70 dark:bg-[#1c2a46]/70">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#2fb56f,#3f7fe6)] transition-all"
            style={{ width: `${(Math.min(step, 6) / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <div className="space-y-4">
          {step === 1 && (
            <>
              <h1 className="text-[1.9rem] font-extrabold leading-tight text-[#1a2748] dark:text-[var(--foreground)]">
                Lose weight without counting every calorie.
              </h1>
              <p className="text-sm leading-relaxed text-[#5f6e8d] dark:text-[var(--muted)]">
                Build small habits. Stop impulsive eating. Stay consistent.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h2 className="text-xl font-bold text-[#1f2a44] dark:text-[var(--foreground)]">What is your biggest challenge?</h2>
                <p className="mt-1 text-sm text-[#7382a0] dark:text-[var(--muted)]">We&apos;ll personalize your daily loop.</p>
              </div>
              <div className="grid gap-2">
                {CHALLENGES.map((item) => {
                  const active = challenge === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => setChallenge(item.value)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left transition-all",
                        active
                          ? "border-[#5888e8] bg-[#ebf2ff] dark:border-[#3c5fa6] dark:bg-[#1d2a47]"
                          : "border-[#d8e1f2] bg-white hover:bg-[#f6f9ff] dark:border-[var(--card-border)] dark:bg-[var(--card)] dark:hover:bg-[#1c2a46]"
                      )}
                    >
                      <p className="text-sm font-semibold text-[#233055] dark:text-[#d1dcf6]">{item.label}</p>
                      <p className="mt-0.5 text-xs text-[#7d8cab] dark:text-[var(--muted)]">{item.hint}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-[#1f2a44] dark:text-[var(--foreground)]">Set your goal</h2>
              <Input
                label="Current Weight (kg)"
                type="number"
                min={35}
                max={300}
                value={currentWeight}
                onChange={(event) => setCurrentWeight(Number(event.target.value))}
              />
              <Input
                label="Goal Weight (kg)"
                type="number"
                min={35}
                max={300}
                value={goalWeight}
                onChange={(event) => setGoalWeight(Number(event.target.value))}
              />
              <Input
                label="Daily Calorie Budget"
                type="number"
                min={1200}
                max={3200}
                value={calorieBudget}
                onChange={(event) => setCalorieBudget(Number(event.target.value))}
                hint={`Suggested: ${autoBudget} kcal based on your goal`}
              />
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setCalorieBudget(autoBudget)}
              >
                Use Suggested Budget
              </Button>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <h2 className="text-xl font-bold text-[#1f2a44] dark:text-[var(--foreground)]">Choose 3 daily habits</h2>
                <p className="mt-1 text-sm text-[#7382a0] dark:text-[var(--muted)]">Pick micro-habits you can finish quickly.</p>
              </div>

              <div className="grid gap-2">
                {HABIT_OPTIONS.map((habit) => {
                  const selected = habits.some((entry) => entry.name === habit.name);
                  return (
                    <button
                      key={habit.name}
                      onClick={() => toggleHabit(habit)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border px-4 py-3 text-left",
                        selected
                          ? "border-[#39b271] bg-[#ecfff4] dark:border-green-700/60 dark:bg-green-950/30"
                          : "border-[#d8e1f2] bg-white dark:border-[var(--card-border)] dark:bg-[var(--card)]"
                      )}
                    >
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-[#233055] dark:text-[#d1dcf6]">
                        <EmojiIcon emoji={habit.emoji} size={14} />
                        {habit.name}
                      </span>
                      <span className={cn("text-xs font-bold", selected ? "text-[#2f9d64] dark:text-green-200" : "text-[#97a6c2] dark:text-[var(--muted)]")}>{selected ? "Selected" : "Tap"}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#7d8cab] dark:text-[var(--muted)]">{habits.length}/3 selected</p>
            </>
          )}

          {step === 5 && (
            <div className="space-y-4 py-5 text-center">
              <h2 className="text-2xl font-extrabold text-[#1f2a44] dark:text-[var(--foreground)]">Start a streak today</h2>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#2b9e63] dark:text-green-200">3 days - Momentum</p>
                <p className="text-sm font-semibold text-[#496fd4] dark:text-[#9cb9ff]">7 days - Habit forming</p>
                <p className="text-sm font-semibold text-[#f1892f] dark:text-amber-200">30 days - Real change</p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 py-2">
              <h2 className="text-2xl font-extrabold text-[#1f2a44] dark:text-[var(--foreground)]">Welcome!</h2>
              <p className="text-sm text-[#5f6e8d] dark:text-[var(--muted)]">Your journey starts today.</p>
              <div className="space-y-2 rounded-2xl border border-[#d8e1f2] bg-[#f6f9ff] p-4 dark:border-[var(--card-border)] dark:bg-[#1b2843]">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-[#233055] dark:text-[#d1dcf6]">
                  <EmojiIcon emoji="🔥" size={14} />
                  Streak: 0
                </p>
                <p className="text-sm font-semibold text-[#233055] dark:text-[#d1dcf6]">Calories Today: {calorieBudget}</p>
                <p className="text-sm font-semibold text-[#233055] dark:text-[#d1dcf6]">Habits: {habits.length}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5">
          {step === 1 && (
            <Button fullWidth size="lg" onClick={() => setStep(2)}>
              Start My Journey
            </Button>
          )}

          {step > 1 && step < 6 && (
            <div className="flex gap-2">
              <Button fullWidth variant="ghost" onClick={() => setStep((prev) => Math.max(prev - 1, 1))}>
                Back
              </Button>
              <Button
                fullWidth
                disabled={!canContinue}
                onClick={() => setStep((prev) => Math.min(prev + 1, 6))}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 6 && (
            <Button fullWidth size="lg" loading={submitting} onClick={finishOnboarding}>
              Enter My Dashboard
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
