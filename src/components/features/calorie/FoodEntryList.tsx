"use client";

import { EmojiIcon } from "@/components/ui";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/types/database";

type FoodEntry = Database["public"]["Tables"]["food_entries"]["Row"];

const MEAL_EMOJI: Record<string, string> = {
  breakfast: "🌅",
  lunch:     "☀️",
  dinner:    "🌙",
  snack:     "🍎",
};

interface Props {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

export function FoodEntryList({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-sm text-[#8a96b0] dark:text-[var(--muted)] py-6">
        No food logged yet today.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex items-center gap-3 bg-[#f4f7ff] rounded-xl px-3 py-2.5 dark:bg-[#1c2a46]"
        >
          <EmojiIcon
            emoji={MEAL_EMOJI[entry.meal_type ?? "snack"]}
            size={18}
            className="text-[#607195] dark:text-[#9fb2d8]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1f2a44] dark:text-[var(--foreground)] truncate">
              {entry.description}
            </p>
            <p className="text-xs text-[#8a96b0] dark:text-[var(--muted)]">
              {format(new Date(entry.eaten_at), "h:mm a")}
            </p>
          </div>
          <span className="text-sm font-bold text-[#334368] dark:text-[#c7d5f0] shrink-0">
            {entry.calories} kcal
          </span>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 text-[#a5b0c9] hover:text-red-400 transition-colors rounded-lg
                       hover:bg-red-50 dark:text-[var(--muted)] dark:hover:text-red-300 dark:hover:bg-red-950/40"
          >
            <Trash2 size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}
