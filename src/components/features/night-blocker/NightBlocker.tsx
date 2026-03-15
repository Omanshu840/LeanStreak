"use client";

import { NightWarningModal } from "./NightWarningModal";
import { useNightBlocker }   from "@/hooks/useNightBlocker";
import { EmojiIcon } from "@/components/ui";
import { cn }               from "@/utils/cn";

// Mount this once in (app)/layout.tsx
// It silently watches the clock and fires when needed
export function NightBlocker() {
  const {
    showModal, submitting,
    handleSkip, handleIgnore,
  } = useNightBlocker();

  return (
    <NightWarningModal
      open={showModal}
      submitting={submitting}
      onSkip={handleSkip}
      onIgnore={handleIgnore}
    />
  );
}

export function NightStatusBanner() {
  const {
    isNight, alreadyShown, tonightIgnored,
    timeLabel, triggerManual,
  } = useNightBlocker();

  // Before 9:30 PM — show countdown
  if (!isNight) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f4f7ff]
                      border border-[#d8e1f2] rounded-xl dark:bg-[#1c2a46] dark:border-[var(--card-border)]">
        <EmojiIcon emoji="🕘" size={14} className="text-[#607195] dark:text-[#9fb2d8]" />
        <p className="text-xs text-[#6e7a96] dark:text-[var(--muted)] font-medium">{timeLabel}</p>
      </div>
    );
  }

  // Night time — already skipped (good)
  if (alreadyShown && !tonightIgnored) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50
                      border border-green-200 rounded-xl dark:bg-green-950/40 dark:border-green-900/60">
        <EmojiIcon emoji="✅" size={14} className="text-green-700 dark:text-green-200" />
        <p className="flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-200">
          Amazing self-control! Streak protected
          <EmojiIcon emoji="🔥" size={12} className="text-green-700 dark:text-green-200" />
        </p>
      </div>
    );
  }

  // Night time — ignored warning
  if (alreadyShown && tonightIgnored) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50
                      border border-red-200 rounded-xl dark:bg-red-950/40 dark:border-red-900/60">
        <EmojiIcon emoji="⚠️" size={14} className="text-red-600 dark:text-red-200" />
        <p className="text-xs text-red-600 dark:text-red-200 font-semibold">
          Late eating logged tonight. Try better tomorrow!
        </p>
      </div>
    );
  }

  // Night time — modal not shown yet (e.g. user opened Eat tab manually)
  return (
    <button
      onClick={triggerManual}
      className={cn(
        "w-full flex items-center gap-2 px-4 py-3",
        "bg-orange-50 border-2 border-orange-200 rounded-xl",
        "dark:bg-orange-950/35 dark:border-orange-900/60",
        "active:scale-98 transition-all"
      )}
    >
      <EmojiIcon emoji="🌙" size={16} className="text-orange-700 dark:text-orange-200" />
      <div className="text-left">
        <p className="flex items-center gap-1 text-sm font-bold text-orange-700 dark:text-orange-200">
          Kitchen Closed
          <EmojiIcon emoji="🚫" size={12} className="text-orange-700 dark:text-orange-200" />
        </p>
        <p className="text-xs text-orange-500 dark:text-orange-200/80">Tap to see your check-in</p>
      </div>
    </button>
  );
}
