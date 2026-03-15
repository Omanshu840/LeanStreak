"use client";

import { Button } from "@/components/ui";
import { useEatPrompt } from "@/hooks/useEatPrompt";
import { ReasonSelector } from "./ReasonSelector";

interface BeforeYouEatProps {
  onLogFood?: () => void;
  onSkipSnack?: () => void;
  onJunkFoodDamage?: () => void;
}

const PAUSE_ACTIONS = ["Drink water", "Wait 10 minutes", "Take a short walk"];

export function BeforeYouEat({ onLogFood, onSkipSnack, onJunkFoodDamage }: BeforeYouEatProps) {
  const { step, reason, submitting, error, selectReason, continueToConfirm, reset } = useEatPrompt();
  const handleLogFood = () => {
    if (onLogFood) {
      onLogFood();
      return;
    }
    reset();
  };
  const handleSkipSnack = () => {
    if (onSkipSnack) {
      onSkipSnack();
      return;
    }
    reset();
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-500 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      )}

      {step === "select" && <ReasonSelector onSelect={selectReason} submitting={submitting} />}

      {step === "suggestion" && reason && reason !== "hungry" && (
        <div className="space-y-4 rounded-2xl border border-[#d8e1f2] bg-[#f8fbff] p-4 dark:border-[var(--card-border)] dark:bg-[#1b2843]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#7a89a8] dark:text-[var(--muted)]">Step 2</p>
          <h3 className="text-base font-bold text-[#1f2a44] dark:text-[var(--foreground)]">You might not be physically hungry.</h3>
          <div>
            <p className="text-sm font-semibold text-[#334368] dark:text-[#c7d5f0]">Try:</p>
            <ul className="mt-2 space-y-1.5 text-sm text-[#586887] dark:text-[#a8b8df]">
              {PAUSE_ACTIONS.map((action) => (
                <li key={action}>• {action}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Button fullWidth onClick={continueToConfirm}>Still want to eat</Button>
            <Button fullWidth variant="ghost" onClick={reset}>Check again</Button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="space-y-4 rounded-2xl border border-[#d8e1f2] bg-white p-4 dark:border-[var(--card-border)] dark:bg-[var(--card)]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#7a89a8] dark:text-[var(--muted)]">Step 3</p>
          <div className="rounded-xl border border-[#d7e7ff] bg-[#f4f8ff] px-3 py-2 dark:border-[#2f4264] dark:bg-[#1c2a46]">
            <p className="text-xs font-semibold text-[#3f67bf] dark:text-[#9cb9ff]">
              Mindful check complete: +3 Mindful Eating Points
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#1f2a44] dark:text-[var(--foreground)]">Still want to eat?</h3>
          </div>

          {reason === "hungry" && (
            <p className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
              You selected hungry. Have a balanced meal.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button fullWidth onClick={handleLogFood}>Log Food</Button>
            <Button fullWidth variant="secondary" onClick={onJunkFoodDamage}>Junk Food Damage</Button>
            <Button fullWidth variant="secondary" onClick={handleSkipSnack}>Skip Snack</Button>
            <Button fullWidth variant="ghost" onClick={reset}>Start over</Button>
          </div>
        </div>
      )}
    </div>
  );
}
