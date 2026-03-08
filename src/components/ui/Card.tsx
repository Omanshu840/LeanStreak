import { cn } from "@/utils/cn";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
  bordered?: boolean;
}

export function Card({
  padded = true,
  bordered = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] bg-[var(--card)] shadow-[var(--card-shadow)]",
        bordered && "border border-[var(--card-border)]",
        padded && "p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-3", className)} {...props}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-bold text-[var(--foreground)]", className)} {...props}>
      {children}
    </h3>
  );
};

Card.Body = function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm text-[var(--muted)]", className)} {...props}>
      {children}
    </div>
  );
};
