"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { EmojiIcon } from "@/components/ui";
import { cn } from "@/utils/cn";
import { Fragment } from "react";

interface Goal {
  label:     string;
  emoji:     string;
  completed: boolean;
  hint:      string;
}

interface Props {
  habitToday: boolean;
  mindfulToday: boolean;
}

export function DailyGoalChecklist({
  habitToday,
  mindfulToday,
}: Props) {
  const goals: Goal[] = [
    {
      label:     "Complete 1 habit",
      emoji:     "✅",
      completed: habitToday,
      hint:      "Check off any habit in Habits tab",
    },
    {
      label:     "Do 1 mindful eating check",
      emoji:     "🍽️",
      completed: mindfulToday,
      hint:      "Use Mindful pre eating check in Home tab",
    },
  ];

  return (
    <ul className="space-y-0">
      {goals.map(({ label, emoji, completed, hint }, index) => (
        <Fragment key={label}>
          <li
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
              completed
                ? "border-green-100 bg-green-50"
                : "border-[#d8e1f2] bg-[#f4f7ff]"
            )}
          >
            {completed ? (
              <CheckCircle2 size={20} className="shrink-0 text-green-500" />
            ) : (
              <Circle size={20} className="shrink-0 text-[#a5b0c9]" />
            )}
            <EmojiIcon emoji={emoji} size={16} className="shrink-0 text-[#607195]" />
            <div className="min-w-0 flex-1">
              <p className={cn(
                "text-sm font-semibold",
                completed ? "text-green-700 line-through decoration-green-300" : "text-[#334368]"
              )}>
                {label}
              </p>
              {!completed && (
                <p className="mt-0.5 text-xs text-[#8a96b0]">{hint}</p>
              )}
            </div>
          </li>
          {index < goals.length - 1 && (
            <li className="list-none">
              <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="h-px flex-1 bg-[#dbe5f8]" />
              <span className="rounded-full border border-[#cddaf5] bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#5f7093]">
                Or
              </span>
              <div className="h-px flex-1 bg-[#dbe5f8]" />
              </div>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );
}
