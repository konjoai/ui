"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn, ease } from "@konjoai/ui";

type ToastTone = "success" | "info" | "warn";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

const TONE: Record<ToastTone, { border: string; dot: string; bar: string }> = {
  success: { border: "border-konjo-good/40",   dot: "bg-konjo-good",   bar: "bg-konjo-good"   },
  info:    { border: "border-konjo-accent/40", dot: "bg-konjo-accent", bar: "bg-konjo-accent" },
  warn:    { border: "border-konjo-warm/40",   dot: "bg-konjo-warm",   bar: "bg-konjo-warm"   },
};

const AUTO_DISMISS_MS = 3200;

let nextId = 0;

/** Renders toast notifications fired via the `konjo:toast` custom DOM event. */
export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const reduce = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    function onToast(e: Event) {
      const { message, tone = "info" } = (
        e as CustomEvent<{ message: string; tone?: ToastTone }>
      ).detail;
      const id = nextId++;
      setToasts((prev) => [{ id, message, tone }, ...prev].slice(0, 3));
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    }
    document.addEventListener("konjo:toast", onToast);
    return () => document.removeEventListener("konjo:toast", onToast);
  }, [dismiss]);

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col-reverse gap-2"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout={!reduce}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.28, ease: ease.nehan }}
            className={cn(
              "glass-konjo rounded-konjo relative flex items-center gap-3 overflow-hidden border px-4 py-2.5 shadow-lg",
              TONE[t.tone].border,
            )}
            role="status"
          >
            <span className={cn("size-1.5 shrink-0 rounded-full", TONE[t.tone].dot)} aria-hidden />
            <span className="text-konjo-mono text-xs text-konjo-fg">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="ml-1 text-lg leading-none text-konjo-fg-faint transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
            >
              ×
            </button>
            {/* Auto-dismiss progress bar */}
            {!reduce && (
              <motion.div
                aria-hidden
                className={cn("absolute bottom-0 left-0 h-[2px] rounded-b-konjo origin-left", TONE[t.tone].bar)}
                initial={{ scaleX: 1, opacity: 0.5 }}
                animate={{ scaleX: 0, opacity: 0.3 }}
                transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
