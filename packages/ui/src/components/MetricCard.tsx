import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";
import { color, severity as severityToken } from "../lib/tokens";
import type { Severity } from "../lib/tokens";
import { transition } from "../lib/motion";

/** Props for MetricCard. */
export interface MetricCardProps {
  /** Displayed metric value — number (formatted) or pre-formatted string. */
  value: number | string;
  /** Metric label — e.g. "Compliance Score". */
  label: string;
  /** Unit suffix — e.g. "%", "ms", "tok/s". */
  unit?: string;
  /** Signed change from previous value. Positive = improvement. */
  delta?: number;
  /** Context for the delta — e.g. "vs last run". */
  deltaLabel?: string;
  /** Tints the value. Default "info". */
  severity?: Severity;
  /** Format a numeric `value`. Default: integer if whole, one decimal otherwise. */
  format?: (v: number) => string;
  className?: string;
}

function defaultFmt(v: number): string {
  return v % 1 === 0 ? String(v) : v.toFixed(1);
}

/**
 * MetricCard — single-value stat card for any scalar metric.
 *
 * Shared across: squash (compliance %), kairu (latency / tok/s),
 * squish (TTFT), kyro (NDCG / MRR), vectro (recall@k), miru (attention).
 */
export function MetricCard({
  value,
  label,
  unit,
  delta,
  deltaLabel,
  severity = "info",
  format = defaultFmt,
  className,
}: MetricCardProps) {
  const reduce = useReducedMotion();
  const display = typeof value === "string" ? value : format(value);
  const fillColor = severityToken[severity];

  const deltaDisplay =
    delta !== undefined
      ? delta === 0
        ? "—"
        : `${delta > 0 ? "+" : "−"}${defaultFmt(Math.abs(delta))}`
      : null;
  const deltaArrow =
    delta !== undefined && delta !== 0 ? (delta > 0 ? "↑" : "↓") : null;
  const deltaColor =
    delta !== undefined && delta !== 0
      ? delta > 0
        ? color.good
        : color.hot
      : color.fgMuted;

  const ariaLabel = [
    label,
    `${display}${unit ? ` ${unit}` : ""}`,
    delta !== undefined
      ? `delta ${deltaDisplay}${deltaLabel ? ` ${deltaLabel}` : ""}`
      : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : transition.kanjo}
      className={cn(
        "glass-konjo rounded-konjo-lg flex flex-col gap-1 p-5",
        className,
      )}
      role="status"
      aria-label={ariaLabel}
    >
      <div className="text-[11px] uppercase tracking-[0.18em] text-konjo-fg-muted">
        {label}
      </div>
      <div className="mt-1 flex items-end gap-1.5">
        <span
          className="text-konjo-display text-4xl font-semibold leading-none tabular-nums"
          style={{ color: fillColor }}
          aria-hidden
        >
          {display}
        </span>
        {unit && (
          <span className="mb-0.5 text-base text-konjo-fg-muted" aria-hidden>
            {unit}
          </span>
        )}
      </div>
      {deltaDisplay !== null && (
        <div
          className="text-konjo-mono mt-0.5 flex items-center gap-1 text-xs"
          style={{ color: deltaColor }}
          aria-hidden
        >
          {deltaArrow && <span>{deltaArrow}</span>}
          <span>{deltaDisplay}</span>
          {deltaLabel && (
            <span className="ml-0.5 text-konjo-fg-faint">{deltaLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}
