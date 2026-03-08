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
                      border border-[#d8e1f2] rounded-xl">
        <EmojiIcon emoji="🕘" size={14} className="text-[#607195]" />
        <p className="text-xs text-[#6e7a96] font-medium">{timeLabel}</p>
      </div>
    );
  }

  // Night time — already skipped (good)
  if (alreadyShown && !tonightIgnored) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50
                      border border-green-200 rounded-xl">
        <EmojiIcon emoji="✅" size={14} className="text-green-700" />
        <p className="flex items-center gap-1 text-xs font-semibold text-green-700">
          Amazing self-control! Streak protected
          <EmojiIcon emoji="🔥" size={12} className="text-green-700" />
        </p>
      </div>
    );
  }

  // Night time — ignored warning
  if (alreadyShown && tonightIgnored) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50
                      border border-red-200 rounded-xl">
        <EmojiIcon emoji="⚠️" size={14} className="text-red-600" />
        <p className="text-xs text-red-600 font-semibold">
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
        "active:scale-98 transition-all"
      )}
    >
      <EmojiIcon emoji="🌙" size={16} className="text-orange-700" />
      <div className="text-left">
        <p className="flex items-center gap-1 text-sm font-bold text-orange-700">
          Kitchen Closed
          <EmojiIcon emoji="🚫" size={12} className="text-orange-700" />
        </p>
        <p className="text-xs text-orange-500">Tap to see your check-in</p>
      </div>
    </button>
  );
}
