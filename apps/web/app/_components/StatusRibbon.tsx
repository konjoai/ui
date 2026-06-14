"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS } from "@/lib/products";

const DEGRADED = PRODUCTS.filter((p) => p.status === "degraded" || p.status === "outage");

/**
 * Dismissible site-wide alert ribbon that appears below the nav when one or
 * more products are degraded/outage. Hidden via sessionStorage once dismissed.
 * Does not render if all systems are operational or research.
 */
export function StatusRibbon() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try { return !!sessionStorage.getItem("konjo:ribbon-dismissed"); } catch { return false; }
  });

  if (DEGRADED.length === 0 || dismissed) return null;

  function dismiss() {
    try { sessionStorage.setItem("konjo:ribbon-dismissed", "1"); } catch { /* noop */ }
    setDismissed(true);
  }

  const first = DEGRADED[0];
  const isOutage = first.status === "outage";
  const borderColor = isOutage ? "border-konjo-hot/40" : "border-konjo-warm/40";
  const bgColor    = isOutage ? "bg-konjo-hot/8"       : "bg-konjo-warm/8";
  const textColor  = isOutage ? "text-konjo-hot"        : "text-konjo-warm";
  const dotColor   = isOutage ? "bg-konjo-hot"          : "bg-konjo-warm";

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="ribbon"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          className={`overflow-hidden border-b ${borderColor} ${bgColor}`}
          role="alert"
          aria-live="assertive"
        >
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-xs">
            <span className={`konjo-pulse inline-block size-1.5 shrink-0 rounded-full ${dotColor}`} aria-hidden />
            <span className={`text-konjo-mono font-medium ${textColor}`}>
              {DEGRADED.length > 1
                ? `${DEGRADED.length} systems degraded`
                : `${first.glyph} ${first.name} — ${first.status}`}
            </span>
            <Link
              href="/status"
              className={`text-konjo-mono ml-1 underline underline-offset-2 ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
            >
              View status →
            </Link>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss status alert"
              className="text-konjo-mono ml-auto text-lg leading-none text-konjo-fg-faint transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
