import type { FoodItem } from "@/data/restaurantFoods";
import { FOOD_DATABASE } from "@/data/restaurantFoods";

export interface SelectedFood {
  food:     FoodItem;
  quantity: number;
}

export interface DamageResult {
  totalCalories:   number;
  steps:           number;
  walkingMinutes:  number;
  runningMinutes:  number;
  cyclingMinutes:  number;
  burpees:         number;
  verdict:         DamageVerdict;
}

export type DamageVerdict = "light" | "moderate" | "heavy" | "extreme";

// ── Burn rate constants ───────────────────────────────────────
// Based on a ~70kg person average
const CALORIES_PER_STEP       = 0.04;    // kcal per step
const CALORIES_PER_MIN_WALK   = 4.5;     // brisk walk
const CALORIES_PER_MIN_RUN    = 10;      // moderate run
const CALORIES_PER_MIN_CYCLE  = 8;       // cycling
const CALORIES_PER_BURPEE     = 0.5;

// ── Core calculation ──────────────────────────────────────────
export function calculateDamage(items: SelectedFood[]): DamageResult {
  const totalCalories = items.reduce(
    (sum, { food, quantity }) => sum + food.calories * quantity, 0
  );

  const steps          = Math.round(totalCalories / CALORIES_PER_STEP);
  const walkingMinutes = Math.round(totalCalories / CALORIES_PER_MIN_WALK);
  const runningMinutes = Math.round(totalCalories / CALORIES_PER_MIN_RUN);
  const cyclingMinutes = Math.round(totalCalories / CALORIES_PER_MIN_CYCLE);
  const burpees        = Math.round(totalCalories / CALORIES_PER_BURPEE);

  const verdict = getVerdict(totalCalories);

  return {
    totalCalories,
    steps,
    walkingMinutes,
    runningMinutes,
    cyclingMinutes,
    burpees,
    verdict,
  };
}

function getVerdict(calories: number): DamageVerdict {
  if (calories <= 300)  return "light";
  if (calories <= 600)  return "moderate";
  if (calories <= 1000) return "heavy";
  return "extreme";
}

// ── Format helpers ────────────────────────────────────────────
export function formatSteps(steps: number): string {
  return steps >= 1000
    ? `${(steps / 1000).toFixed(1)}k steps`
    : `${steps} steps`;
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ── Fuzzy search ──────────────────────────────────────────────
export function searchFoods(query: string): FoodItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  return FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.tags.some((t) => t.includes(q))
  ).slice(0, 8);
}

// ── Verdict metadata ──────────────────────────────────────────
export const VERDICT_META: Record<DamageVerdict, {
  label: string; emoji: string; color: string; bg: string; border: string
}> = {
  light:    {
    label: "Light meal",
    emoji: "success", color: "text-green-700 dark:text-green-200",
    bg: "bg-green-50 dark:bg-green-950/40", border: "border-green-200 dark:border-green-900/60",
  },
  moderate: {
    label: "Moderate",
    emoji: "warning-low", color: "text-yellow-700 dark:text-yellow-200",
    bg: "bg-yellow-50 dark:bg-yellow-950/35", border: "border-yellow-200 dark:border-yellow-900/60",
  },
  heavy:    {
    label: "Heavy meal",
    emoji: "warning-mid", color: "text-orange-700 dark:text-orange-200",
    bg: "bg-orange-50 dark:bg-orange-950/35", border: "border-orange-200 dark:border-orange-900/60",
  },
  extreme:  {
    label: "Damage mode",
    emoji: "warning-high", color: "text-red-700 dark:text-red-200",
    bg: "bg-red-50 dark:bg-red-950/40", border: "border-red-200 dark:border-red-900/60",
  },
};
