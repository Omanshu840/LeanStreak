"use client";

import { Button, Input } from "@/components/ui";
import { useState } from "react";

interface Props {
  onSave: (food: string, calories: number) => Promise<boolean>;
  loading?: boolean;
  onClose: () => void;
  showCancel?: boolean;
}

const QUICK_ITEMS = [
  { food: "Banana", calories: 90 },
  { food: "Coffee", calories: 40 },
  { food: "Rice bowl", calories: 350 },
  { food: "Burger", calories: 550 },
];

export function QuickFoodLogForm({
  onSave,
  loading = false,
  onClose,
  showCancel = true,
}: Props) {
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");

  const calorieValue = Number(calories);
  const isValid = food.trim().length > 0 && Number.isFinite(calorieValue) && calorieValue > 0;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    const done = await onSave(food.trim(), calorieValue);
    if (done) onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {QUICK_ITEMS.map((item) => (
          <button
            type="button"
            key={item.food}
            onClick={() => {
              setFood(item.food);
              setCalories(String(item.calories));
            }}
            className="rounded-full border border-[var(--card-border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]"
          >
            {item.food} · {item.calories}
          </button>
        ))}
      </div>

      <Input
        label="Food"
        placeholder="e.g. Chicken wrap"
        value={food}
        onChange={(event) => setFood(event.target.value)}
        required
      />

      <Input
        label="Calories"
        type="number"
        min={1}
        placeholder="e.g. 320"
        value={calories}
        onChange={(event) => setCalories(event.target.value)}
        required
      />

      <div className="flex gap-2 pt-2">
        {showCancel && (
          <Button type="button" fullWidth variant="secondary" onClick={onClose}>Cancel</Button>
        )}
        <Button type="submit" fullWidth loading={loading} disabled={!isValid}>Save</Button>
      </div>
    </form>
  );
}
