"use client";

import { useState, useEffect } from "react";

/** Formats elapsed seconds into a human-readable "Xs ago / Xm Xs ago / Xh ago" string. */
function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

/**
 * Live "last regenerated" counter that ticks every second.
 * Falls back to the raw ISO timestamp before the first tick resolves.
 */
export function LastUpdated({ buildTime }: { buildTime: string }) {
  const [elapsed, setElapsed] = useState<string | null>(null);

  useEffect(() => {
    const base = new Date(buildTime).getTime();
    const tick = () => {
      const diff = Math.max(0, Math.floor((Date.now() - base) / 1000));
      setElapsed(formatElapsed(diff));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [buildTime]);

  return (
    <p className="text-konjo-mono mt-6 text-xs text-konjo-fg-faint">
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ background: "var(--color-konjo-good)", opacity: 0.7 }}
          aria-hidden
        />
        Last regenerated ·{" "}
        <span className="tabular-nums">{elapsed ?? buildTime}</span>
      </span>
    </p>
  );
}
