import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import type { Database } from "@/types/database";

type FoodEntry = Database["public"]["Tables"]["food_entries"]["Row"];
type BudgetRow = Database["public"]["Tables"]["daily_calorie_budget"]["Row"];

const today = () => format(new Date(), "yyyy-MM-dd");

// ── Budget ────────────────────────────────────────────────────

export async function fetchTodayBudget(userId: string): Promise<BudgetRow | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("daily_calorie_budget")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today())
    .single();
  return (data as BudgetRow | null) ?? null;
}

export async function upsertBudget(userId: string, calorieLimit: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("daily_calorie_budget")
    .upsert(
      { user_id: userId, calorie_limit: calorieLimit, date: today() },
      { onConflict: "user_id,date" }
    )
    .select()
    .single();
  return { data: (data as BudgetRow | null) ?? null, error };
}

export async function updateUserCalorieGoal(userId: string, goal: number) {
  const supabase = createClient();
  return supabase
    .from("users")
    .update({ calorie_goal: goal })
    .eq("id", userId);
}

export async function fetchUserCalorieGoal(userId: string): Promise<number | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("users")
    .select("calorie_goal")
    .eq("id", userId)
    .single();
  return ((data as { calorie_goal: number } | null)?.calorie_goal) ?? null;
}

// ── Food Entries ──────────────────────────────────────────────

export async function fetchTodayEntries(userId: string): Promise<FoodEntry[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("food_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("eaten_at", `${today()}T00:00:00`)
    .lte("eaten_at", `${today()}T23:59:59`)
    .order("eaten_at", { ascending: false });
  return (data as FoodEntry[]) ?? [];
}

export async function fetchRecentEntries(userId: string, days = 14): Promise<FoodEntry[]> {
  const supabase = createClient();
  const start = new Date();
  start.setDate(start.getDate() - Math.max(days - 1, 0));
  start.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("food_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("eaten_at", start.toISOString())
    .order("eaten_at", { ascending: false });

  return (data as FoodEntry[]) ?? [];
}

export async function addFoodEntry(
  userId: string,
  description: string,
  calories: number,
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("food_entries")
    .insert({
      user_id: userId,
      description,
      calories,
      meal_type: mealType,
      eaten_at: new Date().toISOString(),
    })
    .select()
    .single();
  return { data: (data as FoodEntry | null) ?? null, error };
}

export async function deleteFoodEntry(entryId: string) {
  const supabase = createClient();
  return supabase.from("food_entries").delete().eq("id", entryId);
}
