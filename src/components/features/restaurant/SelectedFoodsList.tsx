"use client";

import { EmojiIcon } from "@/components/ui";
import { Trash2, Minus, Plus } from "lucide-react";
import type { SelectedFood }   from "@/utils/damageCalculator";

interface Props {
  items:      SelectedFood[];
  onQuantity: (foodId: string, delta: number) => void;
  onRemove:   (foodId: string) => void;
}

export function SelectedFoodsList({ items, onQuantity, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-[#d8e1f2] rounded-2xl dark:border-[var(--card-border)]">
        <EmojiIcon emoji="🍽️" size={28} className="mx-auto text-[#607195] dark:text-[#9fb2d8]" />
        <p className="text-sm text-[#8a96b0] dark:text-[var(--muted)] mt-2">Search and add foods above</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map(({ food, quantity }) => (
        <li
          key={food.id}
          className="flex items-center gap-3 bg-[#f4f7ff] rounded-xl px-3 py-3 dark:bg-[#1c2a46]"
        >
          <EmojiIcon emoji={food.emoji} size={20} className="shrink-0 text-[#607195] dark:text-[#9fb2d8]" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1f2a44] dark:text-[var(--foreground)] truncate">
              {food.name}
            </p>
            <p className="text-xs text-[#8a96b0] dark:text-[var(--muted)]">{food.servingLabel}</p>
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onQuantity(food.id, -1)}
              className="w-6 h-6 rounded-full bg-[#e4ebfb] hover:bg-[#d7e2f8]
                         flex items-center justify-center transition-all active:scale-90
                         dark:bg-[#223255] dark:hover:bg-[#2b3d5f]"
            >
              <Minus size={10} />
            </button>
            <span className="text-sm font-bold text-[#334368] dark:text-[#c7d5f0] w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={() => onQuantity(food.id, +1)}
              className="w-6 h-6 rounded-full bg-[#e4ebfb] hover:bg-[#d7e2f8]
                         flex items-center justify-center transition-all active:scale-90
                         dark:bg-[#223255] dark:hover:bg-[#2b3d5f]"
            >
              <Plus size={10} />
            </button>
          </div>

          <span className="text-sm font-bold text-[#334368] dark:text-[#c7d5f0] w-16 text-right shrink-0">
            {food.calories * quantity} kcal
          </span>

          <button
            onClick={() => onRemove(food.id)}
            className="p-1.5 text-[#a5b0c9] hover:text-red-400 hover:bg-red-50
                       rounded-lg transition-all shrink-0 dark:text-[var(--muted)] dark:hover:text-red-300 dark:hover:bg-red-950/40"
          >
            <Trash2 size={14} />
          </button>
        </li>
      ))}
    </ul>
  );
}
