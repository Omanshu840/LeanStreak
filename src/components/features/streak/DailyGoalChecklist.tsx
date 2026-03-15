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
                ? "border-green-100 bg-green-50 dark:bg-green-950 dark:border-green-700"
                : "border-[var(--card-border)] bg-[var(--surface)] dark:border-[var(--soft-card-border)] dark:bg-[var(--soft-card-bg)]"
            )}
          >
            {completed ? (
              <CheckCircle2 size={20} className="shrink-0 text-green-500" />
            ) : (
              <Circle size={20} className="shrink-0 text-[var(--muted)] dark:text-[#9faecd]" />
            )}
            <EmojiIcon emoji={emoji} size={16} className="shrink-0 text-[var(--accent)] dark:text-[#9cb0ff]" />
            <div className="min-w-0 flex-1">
              <p className={cn(
                "text-sm font-semibold",
                completed ? "text-green-700 dark:text-green-300 line-through decoration-green-300" : "text-[var(--foreground)]"
              )}>
                {label}
              </p>
              {!completed && (
                <p className="mt-0.5 text-xs text-[var(--muted)] dark:text-[#a8b8df]">{hint}</p>
              )}
            </div>
          </li>
          {index < goals.length - 1 && (
            <li className="list-none">
              <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="h-px flex-1 bg-[var(--line)] dark:bg-[#2b3b5d]" />
              <span className="rounded-full border border-[var(--soft-card-border)] bg-[var(--card)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[var(--muted)] dark:text-[#d6e1ff]">
                Or
              </span>
              <div className="h-px flex-1 bg-[var(--line)] dark:bg-[#2b3b5d]" />
              </div>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  );
}
