"use client";

import { EmojiIcon, Input } from "@/components/ui";
import { searchFoods }   from "@/utils/damageCalculator";
import { CATEGORY_META } from "@/data/restaurantFoods";
import type { FoodItem } from "@/data/restaurantFoods";
import { useState, useRef, useEffect } from "react";

interface Props {
  onSelect: (food: FoodItem) => void;
}

export function FoodSearchInput({ onSelect }: Props) {
  const [query,    setQuery  ] = useState("");
  const [results,  setResults] = useState<FoodItem[]>([]);
  const [focused,  setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(searchFoods(query));
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(food: FoodItem) {
    onSelect(food);
    setQuery("");
    setResults([]);
    setFocused(false);
  }

  const showDropdown = focused && query.length > 0 && results.length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        label="Search food"
        placeholder="e.g. burger, biryani, pizza…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        autoComplete="off"
      />

      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 z-30 mt-1
                        bg-[#ffffff] border border-[#d8e1f2] rounded-2xl shadow-lg
                        dark:bg-[var(--card)] dark:border-[var(--card-border)]
                        overflow-hidden max-h-64 overflow-y-auto">
          {results.map((food) => (
            <li key={food.id}>
                <button
                  onMouseDown={() => handleSelect(food)}   // mousedown fires before blur
                  className="w-full flex items-center gap-3 px-4 py-3
                           hover:bg-[#f4f7ff] transition-colors text-left
                           dark:hover:bg-[#1c2a46]"
                >
                <EmojiIcon emoji={food.emoji} size={20} className="shrink-0 text-[#607195] dark:text-[#9fb2d8]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1f2a44] dark:text-[var(--foreground)]">{food.name}</p>
                  <p className="text-xs text-[#8a96b0] dark:text-[var(--muted)]">{food.servingLabel}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-sm font-bold text-[#334368] dark:text-[#c7d5f0]">
                    {food.calories} kcal
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#8a96b0] dark:text-[var(--muted)]">
                    <EmojiIcon emoji={CATEGORY_META[food.category].emoji} size={10} />
                    {CATEGORY_META[food.category].label}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {focused && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-30 mt-1
                        bg-[#ffffff] border border-[#d8e1f2] rounded-2xl shadow-lg px-4 py-3
                        dark:bg-[var(--card)] dark:border-[var(--card-border)]">
          <p className="text-sm text-[#8a96b0] dark:text-[var(--muted)]">No results for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
