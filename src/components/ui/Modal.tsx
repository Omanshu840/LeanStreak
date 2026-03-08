"use client";

import { cn } from "@/utils/cn";
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  showClose?: boolean;
}

const sizeStyles = {
  sm: "max-w-xs",
  md: "max-w-sm",
  lg: "max-w-md",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-[30px] border border-[var(--card-border)] bg-[linear-gradient(180deg,var(--modal-start)_0%,var(--modal-end)_100%)] p-6 shadow-[var(--modal-shadow)]",
          "animate-in slide-in-from-bottom duration-300 sm:rounded-[30px]",
          sizeStyles[size]
        )}
      >
        {(title || showClose) && (
          <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
            {title && <h2 className="text-lg font-bold text-[var(--foreground)]">{title}</h2>}
            {showClose && (
              <button
                onClick={onClose}
                className="ml-auto rounded-full border border-[var(--card-border)] bg-[var(--card)] p-2 text-[var(--muted)] transition hover:bg-[var(--surface)]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
