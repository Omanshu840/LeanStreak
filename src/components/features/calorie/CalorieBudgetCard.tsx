"use client";

import { Card, ProgressBar, Button, Modal, EmojiIcon } from "@/components/ui";
import { FoodEntryForm }  from "./FoodEntryForm";
import { FoodEntryList }  from "./FoodEntryList";
import { SetBudgetForm }  from "./SetBudgetForm";
import { useCalorieBudget } from "@/hooks/useCalorieBudget";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

export function CalorieBudgetCard() {
  const {
    budget, consumed, remaining, percent, isOver,
    entries, loading, submitting, error,
    setBudgetGoal, logFood, removeEntry,
  } = useCalorieBudget();

  const [showFoodModal,   setShowFoodModal  ] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  if (loading) {
    return (
      <Card bordered className="animate-pulse">
        <div className="h-4 bg-[#edf2fd] rounded w-1/3 mb-3 dark:bg-[#1c2a46]" />
        <div className="h-3 bg-[#edf2fd] rounded w-full mb-2 dark:bg-[#1c2a46]" />
        <div className="h-8 bg-[#edf2fd] rounded w-1/2 dark:bg-[#1c2a46]" />
      </Card>
    );
  }

  return (
    <>
      <Card bordered className="space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1f2a44] dark:text-[var(--foreground)]">
              Daily Calorie Budget
            </h2>
            <p className="text-xs text-[#8a96b0] dark:text-[var(--muted)] mt-0.5">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", month: "short", day: "numeric"
              })}
            </p>
          </div>
          <button
            onClick={() => setShowBudgetModal(true)}
            className="p-2 rounded-xl bg-[#edf2fd] hover:bg-[#e4ebfb] text-[#6e7a96] transition-all dark:bg-[#1c2a46] dark:hover:bg-[#223255] dark:text-[var(--muted)]"
          >
            <Pencil size={14} />
          </button>
        </div>

        {/* Calorie numbers */}
        <div className="flex items-end justify-between">
          <div>
            <p
              className={isOver ? "text-3xl font-bold tracking-tight text-[#df5367] dark:text-[#f48c99]" : "text-3xl font-bold tracking-tight text-[#1f2a44] dark:text-[var(--foreground)]"}
            >
              {remaining < 0 ? "+" : ""}{Math.abs(remaining)}
              <span className="text-sm font-normal text-[#8a96b0] dark:text-[var(--muted)] ml-1">kcal left</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#8a96b0] dark:text-[var(--muted)]">
              <span className="text-[#334368] dark:text-[#c7d5f0] font-semibold">{consumed}</span>
              {" "}/ {budget} kcal
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar value={consumed} max={budget} height="lg" showLabel={false} />

        {/* Status label */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full
            ${isOver
              ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-200"
              : percent >= 80
              ? "bg-orange-50 text-orange-500 dark:bg-orange-950/35 dark:text-orange-200"
              : "bg-green-50 text-green-500 dark:bg-green-950/40 dark:text-green-200"
            }`}>
            {isOver
              ? (
                <>
                  <EmojiIcon emoji="⚠️" size={12} className="text-red-500 dark:text-red-200" />
                  {consumed - budget} kcal over budget
                </>
              )
              : percent >= 80
              ? (
                <>
                  <EmojiIcon emoji="🟠" size={12} className="text-orange-500 dark:text-orange-200" />
                  Getting close
                </>
              )
              : (
                <>
                  <EmojiIcon emoji="✅" size={12} className="text-green-500 dark:text-green-200" />
                  On track
                </>
              )
            }
          </span>
          <span className="text-xs text-[#8a96b0] dark:text-[var(--muted)]">{percent}% used</span>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg dark:bg-red-950/40 dark:text-red-200">{error}</p>
        )}

        {/* Log food button */}
        <Button
          fullWidth
          onClick={() => setShowFoodModal(true)}
          className="flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Log Food
        </Button>

        {/* Food list */}
        <FoodEntryList entries={entries} onDelete={removeEntry} />

      </Card>

      {/* Food entry modal */}
      <Modal
        open={showFoodModal}
        onClose={() => setShowFoodModal(false)}
        title="Log Food"
      >
        <FoodEntryForm
          onAdd={logFood}
          onClose={() => setShowFoodModal(false)}
          loading={submitting}
        />
      </Modal>

      {/* Set budget modal */}
      <Modal
        open={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        title="Set Daily Budget"
      >
        <SetBudgetForm
          currentBudget={budget}
          onSave={setBudgetGoal}
          onClose={() => setShowBudgetModal(false)}
          loading={submitting}
        />
      </Modal>
    </>
  );
}
