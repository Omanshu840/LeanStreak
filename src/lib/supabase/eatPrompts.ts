import { createClient } from "@/lib/supabase/client";
import { subDays, format } from "date-fns";
import type { EatReason } from "@/data/eatPrompts";

export interface EatPromptRow {
  id:           string;
  user_id:      string;
  reason:       EatReason;
  suggestion:   string;
  acknowledged: boolean;
  timestamp:    string;
}

export interface WeeklyCount {
  date:    string;       // "Mon", "Tue" …
  hungry:  number;
  bored:   number;
  stressed:number;
  craving: number;
  total:   number;
}

// ── Log a prompt response ────────────────────────────────────
export async function logEatPrompt(
  userId:     string,
  reason:     EatReason,
  suggestion: string,
  acknowledged: boolean
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("eat_prompts")
    .insert({
      user_id: userId,
      reason,
      suggestion,
      acknowledged,
      timestamp: new Date().toISOString(),
    })
    .select()
    .single();
  return { data: (data as EatPromptRow | null) ?? null, error };
}

// ── Fetch last 7 days of prompts ─────────────────────────────
export async function fetchWeeklyPrompts(
  userId: string
): Promise<EatPromptRow[]> {
  const supabase = createClient();
  const sevenDaysAgo = subDays(new Date(), 7).toISOString();
  const { data } = await supabase
    .from("eat_prompts")
    .select("*")
    .eq("user_id", userId)
    .gte("timestamp", sevenDaysAgo)
    .order("timestamp", { ascending: true });
  return (data as EatPromptRow[]) ?? [];
}

// ── Aggregate into daily counts for chart ───────────────────
export function aggregateWeekly(rows: EatPromptRow[]): WeeklyCount[] {
  const days: WeeklyCount[] = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      date:     format(d, "EEE"),        // "Mon", "Tue" etc.
      hungry:   0,
      bored:    0,
      stressed: 0,
      craving:  0,
      total:    0,
    };
  });

  rows.forEach((row) => {
    const dayLabel = format(new Date(row.timestamp), "EEE");
    const day = days.find((d) => d.date === dayLabel);
    if (day && row.reason in day) {
      (day[row.reason as keyof WeeklyCount] as number)++;
      day.total++;
    }
  });

  return days;
}
