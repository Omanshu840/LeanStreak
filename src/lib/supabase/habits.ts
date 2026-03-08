import { createClient } from "@/lib/supabase/client";
import { format, subDays } from "date-fns";
import type { Database } from "@/types/database";

type Habit    = Database["public"]["Tables"]["habits"]["Row"];
type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];

const today = () => format(new Date(), "yyyy-MM-dd");

// ── Habits CRUD ───────────────────────────────────────────────

export async function fetchHabits(userId: string): Promise<Habit[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as Habit[]) ?? [];
}

export async function addHabit(
  userId:    string,
  habitName: string,
  emoji:     string,
  sortOrder: number
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .insert({
      user_id: userId,
      habit_name: habitName,
      emoji,
      sort_order: sortOrder,
      is_active: true,
    })
    .select()
    .single();
  return { data: (data as Habit | null) ?? null, error };
}

export async function deleteHabit(habitId: string) {
  const supabase = createClient();
  // Soft delete — keeps logs intact
  return supabase
    .from("habits")
    .update({ is_active: false })
    .eq("id", habitId);
}

export async function reorderHabits(
  updates: { id: string; sort_order: number }[]
) {
  const supabase = createClient();
  const promises = updates.map(({ id, sort_order }) =>
    supabase.from("habits").update({ sort_order }).eq("id", id)
  );
  return Promise.all(promises);
}

// ── Habit Logs ────────────────────────────────────────────────

export async function fetchTodayLogs(userId: string): Promise<HabitLog[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today());
  return (data as HabitLog[]) ?? [];
}

export async function toggleHabitLog(
  habitId:   string,
  userId:    string,
  completed: boolean
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habit_logs")
    .upsert(
      { habit_id: habitId, user_id: userId, date: today(), completed },
      { onConflict: "habit_id,date" }
    )
    .select()
    .single();
  return { data: (data as HabitLog | null) ?? null, error };
}

// ── 7-day history per habit (for stats grid) ──────────────────
export async function fetchWeeklyLogs(userId: string): Promise<HabitLog[]> {
  const supabase     = createClient();
  const sevenDaysAgo = format(subDays(new Date(), 6), "yyyy-MM-dd");
  const { data } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("date", sevenDaysAgo)
    .lte("date", today());
  return (data as HabitLog[]) ?? [];
}
