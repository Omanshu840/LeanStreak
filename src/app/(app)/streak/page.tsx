"use client";

import { StreakCard } from "@/components/features/streak/StreakCard";
import { AchievementShareCard } from "@/components/features/streak/AchievementShareCard";
import { Card } from "@/components/ui";
import { useStreak } from "@/hooks/useStreak";

function getMotivation(streak: number) {
  if (streak < 3) return "3 days unlocks momentum.";
  if (streak < 7) return "Only 1 more day to reach a 7 day streak.";
  if (streak < 30) return "Keep going. 30 days creates real change.";
  return "You are in identity territory now. Keep protecting it.";
}

export default function StreakPage() {
  const { currentStreak } = useStreak();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Streak Journey</h2>
        <p className="section-subtitle">{getMotivation(currentStreak)}</p>
      </div>

      <StreakCard />

      <AchievementShareCard streak={currentStreak} />

      <Card bordered>
        <Card.Header>
          <Card.Title>Community Challenge</Card.Title>
        </Card.Header>
        <Card.Body className="space-y-2">
          <p className="text-sm text-[#5f7093]">7 Day No Sugar Challenge</p>
          <p className="text-xs text-[#7f8ead]">1. Alex - 7 days</p>
          <p className="text-xs text-[#7f8ead]">2. Sarah - 6 days</p>
          <p className="text-xs font-semibold text-[#496fd4]">3. You - {Math.min(currentStreak, 5)} days</p>
        </Card.Body>
      </Card>
    </div>
  );
}
