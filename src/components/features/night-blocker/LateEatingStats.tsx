"use client";

import { Card, EmojiIcon } from "@/components/ui";
import type { NightDaySummary }  from "@/lib/supabase/nightEating";

interface Props {
  data:    NightDaySummary[];
  loading: boolean;
}

export function LateEatingStats({ data, loading }: Props) {
  const totalBlocked  = data.reduce((s, d) => s + d.blocked,  0);
  const totalIgnored  = data.reduce((s, d) => s + d.ignored,  0);
  const totalEvents   = totalBlocked + totalIgnored;
  const successRate   = totalEvents > 0
    ? Math.round((totalBlocked / totalEvents) * 100)
    : 100;

  if (loading) {
    return <div className="h-40 bg-[#edf2fd] rounded-2xl animate-pulse" />;
  }

  return (
    <Card bordered className="space-y-4">
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <EmojiIcon emoji="🌙" size={16} />
          Night Eating This Week
        </Card.Title>
      </Card.Header>

      {totalEvents === 0 ? (
        <div className="text-center py-6">
          <EmojiIcon emoji="🏆" size={30} className="mx-auto text-[#406ccc]" />
          <p className="text-sm font-semibold text-[#334368] mt-2">
            No late-night urges this week!
          </p>
          <p className="text-xs text-[#8a96b0]">Keep it up.</p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-green-600">{successRate}%</p>
              <p className="text-xs text-[#8a96b0] mt-0.5">Resisted</p>
            </div>
            <div className="bg-[#f4f7ff] rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-[#334368]">{totalBlocked}</p>
              <p className="text-xs text-[#8a96b0] mt-0.5">Skipped</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-extrabold text-red-400">{totalIgnored}</p>
              <p className="text-xs text-[#8a96b0] mt-0.5">Ignored</p>
            </div>
          </div>

          {/* Per-day bar chart */}
          <div className="flex items-end gap-2 h-20">
            {data.map((day) => {
              const total  = day.blocked + day.ignored;
              const maxVal = Math.max(...data.map((d) => d.blocked + d.ignored), 1);
              const height = total > 0 ? Math.max((total / maxVal) * 64, 8) : 0;

              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full flex flex-col-reverse rounded-t-md overflow-hidden transition-all"
                    style={{ height: `${height}px` }}
                  >
                    {/* Blocked portion — green */}
                    {day.blocked > 0 && (
                      <div
                        className="w-full bg-green-400"
                        style={{ height: `${(day.blocked / total) * 100}%` }}
                      />
                    )}
                    {/* Ignored portion — red */}
                    {day.ignored > 0 && (
                      <div
                        className="w-full bg-red-400"
                        style={{ height: `${(day.ignored / total) * 100}%` }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] text-[#8a96b0]">{day.date}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 pt-1 border-t border-[#e4ebfb]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-xs text-[#6e7a96]">Skipped eating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-xs text-[#6e7a96]">Ate anyway</span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
