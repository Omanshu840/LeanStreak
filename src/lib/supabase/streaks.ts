import { createClient }  from "@/lib/supabase/client";
import { format, subDays } from "date-fns";

const today = () => format(new Date(), "yyyy-MM-dd");
const getTodayIsoRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
  return { start, end };
};

interface StreakRow {
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

// ── Fetch streak row ──────────────────────────────────────────
export async function fetchStreak(userId: string): Promise<StreakRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("streaks")
    .select("current_streak, longest_streak, last_completed_date")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return null;
  return data;
}

// ── Update streak after daily evaluation ─────────────────────
export async function updateStreak(
  userId:        string,
  currentStreak: number,
  longestStreak: number,
  lastCompletedDate: string | null
) {
  const supabase = createClient();
  return supabase
    .from("streaks")
    .update({
      current_streak:      currentStreak,
      longest_streak:      longestStreak,
      last_completed_date: lastCompletedDate,
      updated_at:          new Date().toISOString(),
    })
    .eq("user_id", userId);
}

// ── Fetch today's habit completion status (>= 1 habit) ────────
export async function fetchTodayHabitStatus(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("date", today())
    .eq("completed", true)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

// ── Fetch today's mindful eating check status (>= 1 check) ───
export async function fetchTodayMindfulStatus(userId: string): Promise<boolean> {
  const supabase = createClient();
  const { start, end } = getTodayIsoRange();
  const { data } = await supabase
    .from("eat_prompts")
    .select("id")
    .eq("user_id", userId)
    .gte("timestamp", start)
    .lte("timestamp", end)
    .limit(1);

  return (data?.length ?? 0) > 0;
}

// ── Fetch completed dates for calendar (last 30 days) ────────
export async function fetchCompletedDates(userId: string): Promise<string[]> {
  const supabase   = createClient();
  const startDate = format(subDays(new Date(), 30), "yyyy-MM-dd");

  const [habitLogs, mindfulChecks] = await Promise.all([
    supabase
      .from("habit_logs")
      .select("date")
      .eq("user_id", userId)
      .eq("completed", true)
      .gte("date", startDate),
    supabase
      .from("eat_prompts")
      .select("timestamp")
      .eq("user_id", userId)
      .gte("timestamp", `${startDate}T00:00:00`),
  ]);

  const habitDates = (habitLogs.data ?? []).map((r) => r.date);
  const mindfulDates = (mindfulChecks.data ?? []).map((r) =>
    format(new Date(r.timestamp), "yyyy-MM-dd")
  );
  const uniqueDates = [...new Set([...habitDates, ...mindfulDates])];
  return uniqueDates;
}
