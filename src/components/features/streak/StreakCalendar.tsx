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
      <p className="text-xs font-semibold text-[#8a96b0] mb-2 uppercase tracking-wide">
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
                ? "bg-[#e4ebfb] ring-2 ring-green-400 ring-offset-1"
                : "bg-[#edf2fd]"
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
          <span className="text-xs text-[#8a96b0]">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#edf2fd] ring-1 ring-green-400" />
          <span className="text-xs text-[#8a96b0]">Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[#edf2fd]" />
          <span className="text-xs text-[#8a96b0]">Missed</span>
        </div>
      </div>
    </div>
  );
}
