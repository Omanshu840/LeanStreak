"use client";

import { Card, Button } from "@/components/ui";
import { Flame } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { signOut, loading } = useAuth();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Retention Settings</h2>
        <p className="section-subtitle">Set reminders to protect your streak every day.</p>
      </div>

      <Card bordered>
        <Card.Header>
          <Card.Title>Daily Push Plan</Card.Title>
        </Card.Header>
        <Card.Body className="space-y-2">
          <p className="text-sm font-semibold text-[#334368] flex items-center gap-1.5">
            Morning: Start your streak today <Flame size={14} className="text-[#406ccc]" />
          </p>
          <p className="text-sm font-semibold text-[#334368]">Afternoon: Pause before your next snack.</p>
          <p className="text-sm font-semibold text-[#334368]">Night: Kitchen closes in 30 minutes.</p>
        </Card.Body>
      </Card>

      <Card bordered>
        <Card.Header>
          <Card.Title>Competitive Edge</Card.Title>
        </Card.Header>
        <Card.Body>
          LeanStreak prioritizes behavioral interruption and fast actions over heavy data tracking.
        </Card.Body>
      </Card>

      <Button variant="danger" fullWidth onClick={signOut} loading={loading}>
        Log Out
      </Button>
    </div>
  );
}
