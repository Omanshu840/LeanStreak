"use client";

import { Button, EmojiIcon } from "@/components/ui";
import { REASONS, type EatReason } from "@/data/eatPrompts";
import type { Suggestion } from "@/data/eatPrompts";
import { CheckCircle2, BarChart3 } from "lucide-react";

interface Props {
  reason:      EatReason;
  suggestion:  Suggestion;
  onReset:     () => void;
  onInsights:  () => void;
}

const REASON_COLORS: Record<EatReason, { bg: string; text: string; border: string }> = {
  hungry:  { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  bored:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200"  },
  stressed:{ bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200"},
  craving: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200"},
};

export function SuggestionCard({ reason, suggestion, onReset, onInsights }: Props) {
  const colors  = REASON_COLORS[reason];
  const picked  = REASONS.find((r) => r.value === reason)!;

  return (
    <div className="space-y-4">

      {/* Reason badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                       border text-sm font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
        <EmojiIcon emoji={picked.emoji} size={14} className={colors.text} />
        <span>{picked.label}</span>
      </div>

      {/* Main suggestion */}
      <div className={`rounded-2xl border p-5 space-y-3 ${colors.bg} ${colors.border}`}>
        <div className="flex items-center gap-2">
          <EmojiIcon emoji={suggestion.emoji} size={20} className={colors.text} />
          <h3 className={`text-lg font-bold ${colors.text}`}>
            {suggestion.title}
          </h3>
        </div>
        <p className="text-sm text-[#586887] leading-relaxed">
          {suggestion.message}
        </p>

        {/* Action steps */}
        <ul className="space-y-2 pt-1">
          {suggestion.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#334368]">
              <CheckCircle2
                size={16}
                className={`mt-0.5 shrink-0 ${colors.text}`}
              />
              {action}
            </li>
          ))}
        </ul>

        <div className="rounded-xl border border-[#d7e7ff] bg-white/80 px-3 py-2">
          <p className="text-xs font-semibold text-[#3f67bf]">Great awareness! +1 Mindful Eating Point</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        <Button fullWidth onClick={onReset}>
          Check again
        </Button>
        <Button variant="ghost" fullWidth onClick={onInsights}>
          <span className="inline-flex items-center gap-1.5">
            <BarChart3 size={14} />
            View weekly patterns
          </span>
        </Button>
      </div>
    </div>
  );
}
