"use client";

import { ProgressBar } from "@/components/ui";
import { EmojiIcon } from "@/components/ui";
import { cn }          from "@/utils/cn";

interface Props {
  completed: number;
  total:     number;
  percent:   number;
  allDone:   boolean;
}

export function HabitProgress({ completed, total, percent, allDone }: Props) {
  return (
    <div className={cn(
      "rounded-2xl p-4 border-2 transition-all",
      allDone
        ? "bg-green-50 border-green-200"
        : "bg-[#ffffff] border-[#d8e1f2]"
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <EmojiIcon emoji={allDone ? "🎉" : "📋"} size={18} className="text-[#607195]" />
          <div>
            <p className="text-sm font-bold text-[#1f2a44]">
              {allDone ? "All habits done!" : "Today's Habits"}
            </p>
            <p className="text-xs text-[#8a96b0]">
              {completed} of {total} completed
            </p>
          </div>
        </div>
        <span className={cn(
          "text-2xl font-extrabold",
          allDone ? "text-green-500" : "text-[#334368]"
        )}>
          {percent}%
        </span>
      </div>
      <ProgressBar
        value={completed}
        max={total}
        color={allDone ? "green" : percent >= 60 ? "orange" : "blue"}
        height="md"
      />
      {allDone && (
        <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-green-600">
          <EmojiIcon emoji="🔥" size={14} className="text-green-600" />
          Streak goal achieved for habits!
        </p>
      )}
    </div>
  );
}
