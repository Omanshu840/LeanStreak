"use client";

import { EmojiIcon } from "@/components/ui";
import { cn } from "@/utils/cn";
import { getStreakMilestone } from "@/utils/streakEngine";

interface Props {
  streak:  number;
  atRisk?: boolean;
  size?:   "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: { wrap: "px-2.5 py-1",   flame: "text-base", number: "text-sm",  label: "text-[10px]" },
  md: { wrap: "px-4 py-2",     flame: "text-2xl",  number: "text-xl",  label: "text-xs"     },
  lg: { wrap: "px-6 py-3",     flame: "text-4xl",  number: "text-3xl", label: "text-sm"     },
};
const iconSize = { sm: 14, md: 18, lg: 26 } as const;

export function StreakBadge({ streak, atRisk = false, size = "md" }: Props) {
  const milestone = getStreakMilestone(streak);
  const s         = sizeStyles[size];

  return (
    <div className={cn(
      "inline-flex items-center gap-2 rounded-2xl font-bold",
      atRisk
        ? "bg-orange-50 border-2 border-orange-200"
        : streak > 0
        ? "bg-green-50 border-2 border-green-200"
        : "bg-[#edf2fd] border-2 border-[#c7d3ea]",
      s.wrap
    )}>
      <span className={cn(s.flame, atRisk && "animate-pulse")}>
        <EmojiIcon
          emoji={streak === 0 ? "💤" : atRisk ? "⚠️" : "🔥"}
          size={iconSize[size]}
          className={cn(
            atRisk ? "text-orange-500" : streak > 0 ? "text-green-600" : "text-[#8a96b0]"
          )}
        />
      </span>
      <div>
        <span className={cn(
          "block font-extrabold leading-none",
          atRisk ? "text-orange-500" : streak > 0 ? "text-green-600" : "text-[#8a96b0]",
          s.number
        )}>
          {streak}
        </span>
        {milestone && (
          <span className={cn("inline-flex items-center gap-1", milestone.color, s.label)}>
            <EmojiIcon emoji={milestone.emoji} size={10} className={milestone.color} />
            {milestone.label}
          </span>
        )}
        {!milestone && (
          <span className={cn("block text-[#8a96b0]", s.label)}>day streak</span>
        )}
      </div>
    </div>
  );
}
