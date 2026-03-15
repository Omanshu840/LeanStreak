import { HabitList } from "@/components/features/habits/HabitList";
import { Card } from "@/components/ui";

export default function HabitsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Daily Habits</h2>
        <p className="section-subtitle">Tap to complete. Keep each action under 5 seconds.</p>
      </div>

      <Card
        bordered
        className="bg-[linear-gradient(145deg,#f0fff7,#f5f9ff)] dark:bg-[linear-gradient(145deg,#12243c,#1b2a44)]"
      >
        <Card.Body className="text-sm font-semibold text-[#36527f] dark:text-[#c7d5f0]">
          Nice work is cumulative. Every checked habit protects your streak.
        </Card.Body>
      </Card>

      <HabitList />
    </div>
  );
}
