"use client";

import { Card, Button, EmojiIcon } from "@/components/ui";
import { useState } from "react";

interface Props {
  streak: number;
}

export function AchievementShareCard({ streak }: Props) {
  const [status, setStatus] = useState<"idle" | "shared" | "copied">("idle");

  const message = `${streak} Days No Late Night Eating\n\nConsistency beats motivation.`;

  async function shareProgress() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `LeanStreak - ${streak} day streak`,
          text: message,
        });
        setStatus("shared");
        return;
      } catch {
        // Fall back to copy.
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      setStatus("copied");
    }
  }

  return (
    <Card bordered className="space-y-3 bg-[linear-gradient(140deg,#fff4e3,#f5f7ff)] dark:bg-[linear-gradient(140deg,#1a223a,#222e59)]">
      <div>
        <h3 className="text-base font-bold text-[var(--foreground)]">Share your progress</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">Turn your streak into social proof.</p>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
        <p className="inline-flex items-center gap-1.5 text-lg font-extrabold text-[var(--foreground)]">
          <EmojiIcon emoji="🔥" size={16} className="text-[var(--accent)] dark:text-[#8dbeff]" />
          {streak} Day Streak
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">Consistency beats motivation.</p>
      </div>

      <Button fullWidth onClick={shareProgress}>Share Achievement</Button>
      {status === "shared" && <p className="text-xs font-semibold text-green-600 dark:text-green-300">Shared successfully.</p>}
      {status === "copied" && <p className="text-xs font-semibold text-blue-600 dark:text-blue-300">Text copied. Paste to Instagram, WhatsApp, or TikTok.</p>}
    </Card>
  );
}
