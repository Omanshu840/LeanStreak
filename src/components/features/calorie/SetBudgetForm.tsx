"use client";

import { Button, Input } from "@/components/ui";
import { useState } from "react";

interface Props {
  currentBudget: number;
  onSave: (limit: number) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const PRESETS = [1500, 1800, 2000, 2200, 2500];

export function SetBudgetForm({ currentBudget, onSave, onClose, loading }: Props) {
  const [value, setValue] = useState(String(currentBudget));
  const calories = parseInt(value, 10);
  const isValid  = !isNaN(calories) && calories >= 800 && calories <= 5000;

  async function handleSave() {
    if (!isValid) return;
    await onSave(calories);
    onClose();
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#6e7a96] dark:text-[var(--muted)]">
        Set your daily calorie limit. 1500–2000 kcal works well for most weight loss goals.
      </p>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setValue(String(p))}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all
              ${String(p) === value
                ? "bg-[linear-gradient(140deg,#6996ef,#4b78de)] text-white shadow-[0_8px_14px_rgba(75,120,222,0.3)]"
                : "bg-[#edf2fd] text-[#586887] hover:bg-[#e4ebfb] dark:bg-[#1c2a46] dark:text-[var(--muted)] dark:hover:bg-[#223255]"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      <Input
        label="Custom amount (kcal)"
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        min={800}
        max={5000}
        placeholder="e.g. 1800"
        error={value && !isValid ? "Enter a value between 800–5000" : undefined}
      />

      <div className="flex gap-2 pt-1">
        <Button variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
        <Button fullWidth onClick={handleSave} loading={loading} disabled={!isValid}>
          Save Budget
        </Button>
      </div>
    </div>
  );
}
