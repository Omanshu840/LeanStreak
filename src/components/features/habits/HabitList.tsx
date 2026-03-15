"use client";

import { Modal }          from "@/components/ui";
import { Button }         from "@/components/ui";
import { HabitProgress }  from "./HabitProgress";
import { HabitItem }      from "./HabitItem";
import { AddHabitModal }  from "./AddHabitModal";
import { useHabits }      from "@/hooks/useHabits";
import { Leaf, Plus } from "lucide-react";
import { useState }       from "react";

export function HabitList() {
  const {
    habits, weekDays,
    completed, total, allDone, progressPercent,
    loading, toggling, submitting, error,
    toggleHabit, createHabit, removeHabit,
    getHabitWeekMap,
  } = useHabits();

  const [showAddModal, setShowAddModal] = useState(false);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-20 bg-[#edf2fd] rounded-2xl dark:bg-[#1c2a46]" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-[#edf2fd] rounded-2xl dark:bg-[#1c2a46]" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">

        {/* Error banner */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg dark:bg-red-950/40 dark:text-red-200">{error}</p>
        )}

        {/* Progress summary */}
        {total > 0 && (
          <HabitProgress
            completed={completed}
            total={total}
            percent={progressPercent}
            allDone={allDone}
          />
        )}

        {/* Empty state */}
        {total === 0 && (
          <div className="text-center py-12 space-y-3">
            <Leaf size={40} className="mx-auto text-[#6f98eb] dark:text-[#9cb9ff]" />
            <p className="text-base font-semibold text-[#334368] dark:text-[#c7d5f0]">No habits yet</p>
            <p className="text-sm text-[#8a96b0] dark:text-[var(--muted)]">
              Add small daily habits to build your streak.
            </p>
          </div>
        )}

        {/* Habit items */}
        {habits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            weekMap={getHabitWeekMap(habit.id)}
            weekDays={weekDays}
            isToggling={toggling === habit.id}
            onToggle={toggleHabit}
            onDelete={removeHabit}
          />
        ))}

        {/* Add habit button */}
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 border-2
                     border-dashed border-[#c7d3ea] hover:border-[#7b9fea]
                     hover:bg-[#edf2fd] transition-all dark:border-[var(--card-border)] dark:hover:border-[#4d6fb2] dark:hover:bg-[#1c2a46]"
        >
          <Plus size={16} />
          Add Habit
        </Button>

      </div>

      {/* Add habit modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add a Habit"
        size="lg"
      >
        <AddHabitModal
          onAdd={createHabit}
          onClose={() => setShowAddModal(false)}
          loading={submitting}
          existingNames={habits.map((h) => h.habit_name)}
        />
      </Modal>
    </>
  );
}
