"use client";

import { Button, Card, EmojiIcon } from "@/components/ui";
import { ArrowLeft, BarChart3 } from "lucide-react";
import type { WeeklyCount } from "@/lib/supabase/eatPrompts";
import type { EatReason } from "@/data/eatPrompts";

interface Props {
  data:    WeeklyCount[];
  loading: boolean;
  onBack?: () => void;
  showBack?: boolean;
}

const REASON_META: {
  key: EatReason; label: string; emoji: string; color: string; bg: string
}[] = [
  { key: "hungry",   label: "Hungry",   emoji: "😋", color: "bg-green-500",  bg: "bg-green-50"  },
  { key: "bored",    label: "Bored",    emoji: "😴", color: "bg-blue-400",   bg: "bg-blue-50"   },
  { key: "stressed", label: "Stressed", emoji: "😰", color: "bg-orange-400", bg: "bg-orange-50" },
  { key: "craving",  label: "Craving",  emoji: "🍫", color: "bg-purple-400", bg: "bg-purple-50" },
];

export function WeeklyInsights({ data, loading, onBack, showBack = true }: Props) {
  const totalChecks  = data.reduce((s, d) => s + d.total, 0);
  const totalHungry  = data.reduce((s, d) => s + d.hungry, 0);
  const totalNonHungry = totalChecks - totalHungry;

  // Find dominant non-hungry reason
  const nonHungryTotals = {
    bored:    data.reduce((s, d) => s + d.bored, 0),
    stressed: data.reduce((s, d) => s + d.stressed, 0),
    craving:  data.reduce((s, d) => s + d.craving, 0),
  };
  const topReason = Object.entries(nonHungryTotals)
    .sort(([, a], [, b]) => b - a)[0];

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-[#edf2fd] rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="inline-flex items-center gap-1.5 text-xl font-bold text-[#1f2a44]">
            Weekly Patterns
            <BarChart3 size={18} />
          </h2>
          <p className="text-xs text-[#8a96b0] mt-0.5">Last 7 days</p>
        </div>
        {showBack && onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <span className="inline-flex items-center gap-1">
              <ArrowLeft size={14} />
              Back
            </span>
          </Button>
        )}
      </div>

      {totalChecks === 0 ? (
        <Card bordered className="text-center py-8">
          <EmojiIcon emoji="🌱" size={30} className="mx-auto text-[#607195]" />
          <p className="text-sm text-[#6e7a96] mt-2">
            No data yet. Use &quot;Mindful pre eating check&quot; before your meals.
          </p>
        </Card>
      ) : (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-3 gap-2">
            <Card bordered padded={false} className="p-3 text-center">
              <p className="text-2xl font-bold text-[#1f2a44]">{totalChecks}</p>
              <p className="text-xs text-[#8a96b0] mt-0.5">Total checks</p>
            </Card>
            <Card bordered padded={false} className="p-3 text-center">
              <p className="text-2xl font-bold text-green-500">{totalHungry}</p>
              <p className="text-xs text-[#8a96b0] mt-0.5">Truly hungry</p>
            </Card>
            <Card bordered padded={false} className="p-3 text-center">
              <p className="text-2xl font-bold text-orange-400">{totalNonHungry}</p>
              <p className="text-xs text-[#8a96b0] mt-0.5">Impulse urges</p>
            </Card>
          </div>

          {/* Insight callout */}
          {totalNonHungry > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                <EmojiIcon emoji="💡" size={14} className="text-amber-700" />
                Your top non-hunger trigger this week is{" "}
                <span className="capitalize">{topReason[0]}</span> ({topReason[1]}x).
              </p>
            </div>
          )}

          {/* Bar chart — reason breakdown per day */}
          <Card bordered>
            <Card.Header>
              <Card.Title>Daily breakdown</Card.Title>
            </Card.Header>

            <div className="flex items-end gap-2 h-28 mt-2">
              {data.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  {/* Stacked bar */}
                  <div
                    className="w-full flex flex-col-reverse justify-end rounded-t-md overflow-hidden"
                    style={{ height: `${(day.total / maxTotal) * 80}px`, minHeight: day.total > 0 ? "8px" : "0" }}
                  >
                    {REASON_META.map(({ key, color }) =>
                      day[key] > 0 ? (
                        <div
                          key={key}
                          className={`w-full ${color} transition-all`}
                          style={{ height: `${(day[key] / day.total) * 100}%` }}
                          title={`${key}: ${day[key]}`}
                        />
                      ) : null
                    )}
                  </div>
                  <span className="text-[10px] text-[#8a96b0] font-medium">{day.date}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-[#e4ebfb]">
              {REASON_META.map(({ key, label, emoji, color }) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="inline-flex items-center gap-1 text-xs text-[#6e7a96]">
                    <EmojiIcon emoji={emoji} size={11} />
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Per-reason totals */}
          <div className="space-y-2">
            {REASON_META.map(({ key, label, emoji, bg, color }) => {
              const total   = data.reduce((s, d) => s + d[key], 0);
              const pct     = totalChecks > 0 ? Math.round((total / totalChecks) * 100) : 0;
              return (
                <div key={key} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bg}`}>
                  <EmojiIcon emoji={emoji} size={16} className="text-[#607195]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[#334368]">{label}</span>
                      <span className="text-xs text-[#8a96b0]">{total}x · {pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[#ffffff] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
