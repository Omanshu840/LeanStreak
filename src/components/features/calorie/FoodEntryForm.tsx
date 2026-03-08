"use client";

import { Button, EmojiIcon, Input } from "@/components/ui";
import { useState } from "react";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface Props {
  onAdd: (description: string, calories: number, mealType: MealType) => Promise<boolean>;
  onClose: () => void;
  loading?: boolean;
}

const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: "breakfast", label: "Breakfast", emoji: "🌅" },
  { value: "lunch",     label: "Lunch",     emoji: "☀️"  },
  { value: "dinner",    label: "Dinner",    emoji: "🌙"  },
  { value: "snack",     label: "Snack",     emoji: "🍎"  },
];

// Quick-add common foods
const QUICK_FOODS = [
  { label: "Banana",    calories: 89  },
  { label: "Chai",      calories: 60  },
  { label: "Rice bowl", calories: 350 },
  { label: "Dosa",      calories: 170 },
  { label: "Roti",      calories: 120 },
  { label: "Egg",       calories: 78  },
];

export function FoodEntryForm({ onAdd, onClose, loading }: Props) {
  const [description, setDescription] = useState("");
  const [calories,    setCalories    ] = useState("");
  const [mealType,    setMealType    ] = useState<MealType>("snack");

  const calNum   = parseInt(calories, 10);
  const isValid  = description.trim().length > 0 && !isNaN(calNum) && calNum > 0;

  function applyQuick(label: string, cal: number) {
    setDescription(label);
    setCalories(String(cal));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const ok = await onAdd(description.trim(), calNum, mealType);
    if (ok) onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Meal type selector */}
      <div className="grid grid-cols-4 gap-1.5">
        {MEAL_TYPES.map(({ value, label, emoji }) => (
          <button
            type="button"
            key={value}
            onClick={() => setMealType(value)}
            className={`flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all
              ${mealType === value
                ? "bg-[linear-gradient(140deg,#6996ef,#4b78de)] text-white shadow-[0_8px_14px_rgba(75,120,222,0.3)]"
                : "bg-[#edf2fd] text-[#6e7a96] hover:bg-[#e4ebfb]"
              }`}
          >
            <EmojiIcon
              emoji={emoji}
              size={16}
              className={mealType === value ? "text-white" : "text-[#607195]"}
            />
            {label}
          </button>
        ))}
      </div>

      {/* Quick-add chips */}
      <div>
        <p className="text-xs text-[#8a96b0] mb-2 font-medium">QUICK ADD</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_FOODS.map(({ label, calories: cal }) => (
            <button
              type="button"
              key={label}
              onClick={() => applyQuick(label, cal)}
              className="px-3 py-1 bg-[#edf2fd] text-[#586887] rounded-full text-xs
                         font-semibold hover:bg-[#e4ebfb] transition-all active:scale-95"
            >
              {label} · {cal}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Food description"
        type="text"
        placeholder="e.g. Chicken biryani"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <Input
        label="Calories (kcal)"
        type="number"
        placeholder="e.g. 450"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        min={1}
        required
      />

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" fullWidth loading={loading} disabled={!isValid}>
          Log Food
        </Button>
      </div>
    </form>
  );
}
