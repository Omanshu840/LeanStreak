"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/utils/cn";

interface CalendarDay {
  date:      string;
  completed: boolean;
  isToday:   boolean;
}

interface Props {
  days: CalendarDay[];
}

export function StreakCalendar({ days }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--muted)] mb-2 uppercase tracking-wide dark:text-[#a8b8df]">
        Last 30 Days
      </p>
      <div className="grid grid-cols-10 gap-1.5">
        {days.map(({ date, completed, isToday }) => (
          <div
            key={date}
            title={format(parseISO(date), "MMM d")}
            className={cn(
              "aspect-square rounded-md transition-all",
              completed
                ? "bg-green-500 shadow-sm"
                : isToday
                ? "bg-[var(--surface)] ring-2 ring-green-400 ring-offset-1 dark:bg-[var(--soft-card-bg)]"
                : "bg-[var(--card)] dark:bg-[var(--soft-card-bg)]"
            )}
          >
            {isToday && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span className="text-xs text-[var(--muted)] dark:text-[#a8b8df]">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[var(--surface)] ring-1 ring-green-400 dark:bg-[var(--soft-card-bg)]" />
          <span className="text-xs text-[var(--muted)] dark:text-[#a8b8df]">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[var(--card)] dark:bg-[var(--soft-card-bg)]" />
          <span className="text-xs text-[var(--muted)] dark:text-[#a8b8df]">Missed</span>
        </div>
      </div>
    </div>
  );
}
