"use client";

import { FoodSearchInput }   from "./FoodSearchInput";
import { SelectedFoodsList } from "./SelectedFoodsList";
import { DamageResult }      from "./DamageResult";
import { Button, EmojiIcon } from "@/components/ui";
import { FOOD_DATABASE,
         CATEGORY_META }     from "@/data/restaurantFoods";
import {
  calculateDamage,
  type SelectedFood,
}                            from "@/utils/damageCalculator";
import type { FoodItem }     from "@/data/restaurantFoods";
import { useState, useMemo } from "react";

export function DamageCalculator() {
  const [selected, setSelected] = useState<SelectedFood[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // ── Derived ─────────────────────────────────────────────
  const result = useMemo(
    () => selected.length > 0 ? calculateDamage(selected) : null,
    [selected]
  );

  // ── Handlers ─────────────────────────────────────────────
  function addFood(food: FoodItem) {
    setSelected((prev) => {
      const existing = prev.find((s) => s.food.id === food.id);
      if (existing) {
        return prev.map((s) =>
          s.food.id === food.id ? { ...s, quantity: s.quantity + 1 } : s
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
  }

  function adjustQuantity(foodId: string, delta: number) {
    setSelected((prev) =>
      prev
        .map((s) =>
          s.food.id === foodId ? { ...s, quantity: s.quantity + delta } : s
        )
        .filter((s) => s.quantity > 0)
    );
  }

  function removeFood(foodId: string) {
    setSelected((prev) => prev.filter((s) => s.food.id !== foodId));
  }

  // Category-filtered quick-add foods
  const quickAddFoods = FOOD_DATABASE.filter((f) =>
    activeCategory === "all" ? true : f.category === activeCategory
  ).slice(0, 8);

  return (
    <div className="space-y-4">

      {/* Search */}
      <FoodSearchInput onSelect={addFood} />

      {/* Category quick-filter */}
      <div>
        <p className="text-xs font-semibold text-[#8a96b0] dark:text-[var(--muted)] mb-2 uppercase tracking-wide">
          Browse by category
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: "all", label: "All", emoji: "🍽️" },
            ...Object.entries(CATEGORY_META).map(([key, meta]) => ({
              key, label: meta.label, emoji: meta.emoji,
            })),
          ].map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full
                          text-xs font-semibold whitespace-nowrap shrink-0 transition-all
                ${activeCategory === key
                  ? "bg-[linear-gradient(140deg,#6996ef,#4b78de)] text-white shadow-[0_8px_16px_rgba(75,120,222,0.3)]"
                  : "bg-[#edf2fd] text-[#6e7a96] hover:bg-[#e4ebfb] dark:bg-[#1c2a46] dark:text-[var(--muted)] dark:hover:bg-[#223255]"
                }`}
            >
              <EmojiIcon emoji={emoji} size={12} className={activeCategory === key ? "text-white" : "text-[#607195] dark:text-[#9fb2d8]"} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick-add chips */}
      <div className="flex flex-wrap gap-2">
        {quickAddFoods.map((food) => (
          <button
            key={food.id}
            onClick={() => addFood(food)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#edf2fd]
                       hover:bg-[#e4ebfb] rounded-full text-xs font-semibold
                       text-[#586887] transition-all active:scale-95
                       dark:bg-[#1c2a46] dark:text-[var(--muted)] dark:hover:bg-[#223255]"
          >
            <EmojiIcon emoji={food.emoji} size={12} className="text-[#607195] dark:text-[#9fb2d8]" />
            <span>{food.name}</span>
            <span className="text-[#8a96b0] dark:text-[var(--muted)]">{food.calories}</span>
          </button>
        ))}
      </div>

      {/* Selected list */}
      <SelectedFoodsList
        items={selected}
        onQuantity={adjustQuantity}
        onRemove={removeFood}
      />

      {/* Clear button */}
      {selected.length > 0 && (
        <Button
          variant="ghost"
          fullWidth
          onClick={() => setSelected([])}
          className="text-[#8a96b0] hover:text-red-400 dark:text-[var(--muted)] dark:hover:text-red-300"
        >
          Clear all
        </Button>
      )}

      {/* Damage result */}
      {result && <DamageResult result={result} />}

    </div>
  );
}
