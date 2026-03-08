"use client";

import { Button, EmojiIcon } from "@/components/ui";

interface Props {
  open:         boolean;
  submitting:   boolean;
  onSkip:       () => void;
  onIgnore:     () => void;
}

export function NightWarningModal({ open, submitting, onSkip, onIgnore }: Props) {
  if (!open) return null;

  return (
    // Full-screen overlay — intentionally intrusive
    <div className="fixed inset-0 z-50 flex items-end justify-center">

      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Bottom sheet */}
      <div className="relative z-10 w-full max-w-md bg-[#ffffff] rounded-t-3xl px-6 pt-8 pb-10
                      animate-in slide-in-from-bottom duration-300">

        {/* Animated moon icon */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="relative">
            <EmojiIcon emoji="🌙" size={48} className="animate-pulse text-[#406ccc]" />
            <span className="absolute -top-1 -right-2">
              <EmojiIcon emoji="🚫" size={18} className="text-red-500" />
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-[#1f2a44]">
              Kitchen Closed
            </h2>
            <p className="text-sm text-[#6e7a96] mt-1.5 leading-relaxed">
              It&apos;s past 9:30 PM. Late night eating can disrupt your
              sleep and break your streak.
            </p>
          </div>
        </div>

        {/* Tip card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-blue-700">
            <EmojiIcon emoji="💡" size={14} className="text-blue-700" />
            Try instead:
          </p>
          <ul className="mt-1.5 space-y-1">
            {[
              "Drink a glass of water",
              "Brush your teeth",
              "Distract yourself for 10 minutes",
            ].map((tip) => (
              <li key={tip} className="text-sm text-blue-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA buttons */}
        <div className="space-y-3">
          {/* Primary — good choice */}
          <Button
            fullWidth
            size="lg"
            onClick={onSkip}
            loading={submitting}
            className="text-base"
          >
            Skip snack
          </Button>

          {/* Secondary — override option, less prominent */}
          <button
            onClick={onIgnore}
            disabled={submitting}
            className="w-full py-3 text-sm text-[#8a96b0] font-medium
                       hover:text-[#586887] transition-colors disabled:opacity-50"
          >
            I am hungry
          </button>
        </div>

      </div>
    </div>
  );
}
