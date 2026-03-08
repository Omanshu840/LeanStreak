import { createClient }          from "@/lib/supabase/client";
import { format, subDays }       from "date-fns";

export interface LateEatingLog {
  id:              string;
  user_id:         string;
  ignored_warning: boolean;
  timestamp:       string;
}

const today = () => format(new Date(), "yyyy-MM-dd");

// ── Log a night blocker event ─────────────────────────────────
export async function logNightEatingEvent(
  userId:          string,
  ignoredWarning:  boolean
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("late_eating_logs")
    .insert({
      user_id: userId,
      ignored_warning: ignoredWarning,
      timestamp: new Date().toISOString(),
    })
    .select()
    .single();
  return { data: (data as LateEatingLog | null) ?? null, error };
}

// ── Check if already shown a warning tonight ─────────────────
export async function fetchTonightLogs(
  userId: string
): Promise<LateEatingLog[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("late_eating_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("timestamp", `${today()}T21:30:00`)
    .order("timestamp", { ascending: false });
  return (data as LateEatingLog[]) ?? [];
}

// ── Fetch last 7 days for stats ───────────────────────────────
export async function fetchWeeklyNightLogs(
  userId: string
): Promise<LateEatingLog[]> {
  const supabase   = createClient();
  const sevenDaysAgo = subDays(new Date(), 6).toISOString();
  const { data } = await supabase
    .from("late_eating_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("timestamp", sevenDaysAgo)
    .order("timestamp", { ascending: true });
  return (data as LateEatingLog[]) ?? [];
}

// ── Build daily summary for the stats UI ─────────────────────
export interface NightDaySummary {
  date:     string;    // "Mon", "Tue" …
  blocked:  number;    // user listened
  ignored:  number;    // user ate anyway
}

export function buildNightWeekly(
  logs: LateEatingLog[]
): NightDaySummary[] {
  const days: NightDaySummary[] = Array.from({ length: 7 }, (_, i) => ({
    date:    format(subDays(new Date(), 6 - i), "EEE"),
    blocked: 0,
    ignored: 0,
  }));

  logs.forEach((log) => {
    const label = format(new Date(log.timestamp), "EEE");
    const day   = days.find((d) => d.date === label);
    if (!day) return;
    if (log.ignored_warning) day.ignored++;
    else day.blocked++;
  });

  return days;
}
