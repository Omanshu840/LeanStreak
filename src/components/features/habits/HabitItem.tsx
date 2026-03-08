"use client";

import { Trash2 }    from "lucide-react";
import { EmojiIcon } from "@/components/ui";
import { cn }        from "@/utils/cn";
import type { HabitWithStatus } from "@/hooks/useHabits";

interface Props {
  habit:       HabitWithStatus;
  weekMap:     Record<string, boolean>;
  weekDays:    { date: string; label: string }[];
  isToggling:  boolean;
  onToggle:    (id: string) => void;
  onDelete:    (id: string) => void;
}

export function HabitItem({
  habit, weekMap, weekDays, isToggling, onToggle, onDelete,
}: Props) {
  return (
    <div className={cn(
      "rounded-2xl border-2 p-4 transition-all duration-200",
      habit.completed
        ? "bg-green-50 border-green-200"
        : "bg-[#ffffff] border-[#d8e1f2]"
    )}>
      <div className="flex items-center gap-3">

        {/* Completion toggle */}
        <button
          onClick={() => onToggle(habit.id)}
          disabled={isToggling}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center",
            "transition-all duration-200 active:scale-90 shrink-0",
            habit.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-[#bcc8e0] hover:border-[#6f98eb] bg-[#ffffff]"
          )}
        >
          {isToggling ? (
            <svg className="animate-spin h-3.5 w-3.5 text-[#8a96b0]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          ) : habit.completed ? (
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : null}
        </button>

        {/* Emoji + name */}
        <EmojiIcon emoji={habit.emoji ?? "✨"} size={18} className="shrink-0 text-[#607195]" />
        <p className={cn(
          "flex-1 text-sm font-semibold transition-all",
          habit.completed
            ? "text-green-700 line-through decoration-green-300"
            : "text-[#1f2a44]"
        )}>
          {habit.habit_name}
        </p>

        {/* Delete */}
        <button
          onClick={() => onDelete(habit.id)}
          className="p-1.5 text-[#a5b0c9] hover:text-red-400 hover:bg-red-50
                     rounded-lg transition-all shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {habit.completed && (
        <div className="mt-3 rounded-xl border border-green-200 bg-white/80 px-3 py-2 pl-11">
          <p className="text-xs font-semibold text-green-700">Nice work! Habit completed.</p>
        </div>
      )}

      {/* 7-day mini streak dots */}
      <div className="flex items-center gap-1.5 mt-3 pl-11">
        {weekDays.map(({ date, label }) => (
          <div key={date} className="flex flex-col items-center gap-0.5">
            <div className={cn(
              "w-5 h-5 rounded-full transition-all",
              weekMap[date]
                ? "bg-green-500 shadow-sm"
                : "bg-[#edf2fd]"
            )} />
            <span className="text-[9px] text-[#a5b0c9] font-medium">{label[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
