"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Card, Button, Modal } from "@/components/ui";
import { WeeklyInsights } from "@/components/features/eat-prompt/WeeklyInsights";
import { FoodEntryList } from "@/components/features/calorie/FoodEntryList";
import { NightStatusBanner } from "@/components/features/night-blocker/NightBlocker";
import { useCalorieBudget } from "@/hooks/useCalorieBudget";
import { useSession } from "@/hooks/useSession";
import { fetchRecentEntries } from "@/lib/supabase/calories";
import { aggregateWeekly, fetchWeeklyPrompts } from "@/lib/supabase/eatPrompts";

export default function EatPage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const { user } = useSession();
  const { entries, consumed, loading, removeEntry, submitting } = useCalorieBudget();

  const weeklyQuery = useQuery({
    queryKey: user?.id ? ["users", user.id, "eat-prompt", "weekly"] : ["eat-prompt", "anonymous"],
    queryFn: async () => aggregateWeekly(await fetchWeeklyPrompts(user!.id)),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: historyData,
    isPending: historyLoading,
  } = useQuery({
    queryKey: user?.id ? ["users", user.id, "calories", "history"] : ["calories", "history", "anonymous"],
    queryFn: () => fetchRecentEntries(user!.id, 14),
    enabled: !!user?.id && historyOpen,
    staleTime: 1000 * 60 * 2,
  });
  const groupedHistory = useMemo(() => {
    const items = historyData ?? [];
    return items.reduce<Record<string, typeof items>>((acc, entry) => {
      const key = format(new Date(entry.eaten_at), "EEE, MMM d");
      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    }, {});
  }, [historyData]);

  const historyDays = Object.entries(groupedHistory);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Mindful Eating Patterns</h2>
        <p className="section-subtitle">Understand your triggers and review your food choices day by day.</p>
      </div>

      <NightStatusBanner />

      <Card bordered>
        <Card.Header>
          <Card.Title>Weekly Mindful Eating Patterns</Card.Title>
        </Card.Header>
        <WeeklyInsights
          data={weeklyQuery.data ?? []}
          loading={weeklyQuery.isPending}
          showBack={false}
        />
      </Card>

      <Card bordered>
        <Card.Header>
          <div className="flex items-center justify-between gap-3">
            <Card.Title>Today&apos;s Food Log</Card.Title>
            <span className="rounded-full bg-[#edf2fd] px-2 py-0.5 text-xs font-bold text-[#4d638e]">
              {entries.length} items
            </span>
          </div>
        </Card.Header>
        <Card.Body className="space-y-3">
          <div className="rounded-xl border border-[#d8e1f2] bg-[#f8faff] px-3 py-2 text-sm text-[#51658f]">
            Total consumed today: <span className="font-bold text-[#1f2a44]">{consumed} kcal</span>
          </div>
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-12 rounded-xl bg-[#edf2fd]" />
              <div className="h-12 rounded-xl bg-[#edf2fd]" />
            </div>
          ) : (
            <FoodEntryList entries={entries} onDelete={removeEntry} />
          )}
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setHistoryOpen(true)}
            disabled={submitting}
          >
            View 14-day history
          </Button>
        </Card.Body>
      </Card>

      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Food History"
        size="lg"
      >
        {historyLoading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-14 rounded-xl bg-[#edf2fd]" />
            <div className="h-14 rounded-xl bg-[#edf2fd]" />
            <div className="h-14 rounded-xl bg-[#edf2fd]" />
          </div>
        ) : historyDays.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#8a96b0]">
            No food entries in the last 14 days.
          </p>
        ) : (
          <div className="space-y-4">
            {historyDays.map(([day, dayEntries]) => (
              <div key={day} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#7a89a8]">{day}</p>
                <ul className="space-y-2">
                  {dayEntries.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center justify-between rounded-xl border border-[#d8e1f2] bg-[#f8faff] px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1f2a44]">{entry.description}</p>
                        <p className="text-xs text-[#8a96b0]">
                          {format(new Date(entry.eaten_at), "h:mm a")}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#334368]">{entry.calories} kcal</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
