import { cn } from "@/utils/cn";

type BarColor = "green" | "orange" | "red" | "blue";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: BarColor;
  showLabel?: boolean;
  height?: "sm" | "md" | "lg";
  className?: string;
}

const colorStyles: Record<BarColor, string> = {
  green: "bg-[linear-gradient(120deg,#5dcf9b,#2ea772)]",
  orange: "bg-[linear-gradient(120deg,#f8be65,#ef9d35)]",
  red: "bg-[linear-gradient(120deg,#f18796,#e15465)]",
  blue: "bg-[linear-gradient(120deg,#8ab0f5,#4f7ee6)]",
};

const heightStyles = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

function resolveColor(value: number, color?: BarColor): BarColor {
  if (color) return color;
  if (value >= 90) return "red";
  if (value >= 70) return "orange";
  return "blue";
}

export function ProgressBar({
  value,
  max = 100,
  color,
  showLabel = false,
  height = "md",
  className,
}: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  const resolvedColor = resolveColor(percent, color);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-[var(--muted)]">
          <span>{value} kcal</span>
          <span>{max} kcal</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-[var(--track)]", heightStyles[height])}>
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${percent}%` }}
          className={cn("h-full rounded-full transition-all duration-500 ease-out", colorStyles[resolvedColor])}
        />
      </div>
    </div>
  );
}
