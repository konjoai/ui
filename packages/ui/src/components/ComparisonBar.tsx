import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";
import { color, severity as severityToken } from "../lib/tokens";
import type { Severity } from "../lib/tokens";
import { ease } from "../lib/motion";

/** A single bar in a ComparisonBar. */
export interface ComparisonBarItem {
  label: string;
  value: number;
  /** Optional baseline — renders a ghost marker so the delta is immediately visible. */
  baseline?: number;
  /** Explicit severity override; auto-computed from value vs. baseline when omitted. */
  severity?: Severity;
  /** Second line under the label — e.g. "fp32 reference". */
  sublabel?: string;
}

/** Props for ComparisonBar. */
export interface ComparisonBarProps {
  items: ComparisonBarItem[];
  /** Explicit max for bar scaling. Defaults to the max across all values and baselines. */
  max?: number;
  /** Unit suffix — e.g. "%", "tok/s". */
  unit?: string;
  /**
   * Whether higher is better. Drives auto-severity when a baseline is provided.
   * Default true.
   */
  higherIsBetter?: boolean;
  /** Decimal places in the value readout. Default 1. */
  valueDecimals?: number;
  className?: string;
}

function autoSeverity(
  value: number,
  baseline: number | undefined,
  higherIsBetter: boolean,
): Severity {
  if (baseline === undefined || baseline === 0) return "info";
  const ratio = value / baseline;
  if (higherIsBetter) {
    if (ratio >= 0.95) return "ok";
    if (ratio >= 0.8)  return "warn";
    return "high";
  } else {
    if (ratio <= 1.05) return "ok";
    if (ratio <= 1.2)  return "warn";
    return "high";
  }
}

/**
 * Konjo ComparisonBar — horizontal benchmark bars with optional baseline ghost marker.
 *
 * Used by vectro (recall@k vs. fp32 baseline), kairu (draft tok/s vs. AR baseline),
 * squash (compliance score vs. minimum threshold). When `baseline` is provided a faint
 * vertical marker shows the reference so the delta is immediately visible.
 * Bars fill from the left via `kanjo` easing; rows stagger in on mount.
 */
export function ComparisonBar({
  items,
  max: maxProp,
  unit,
  higherIsBetter = true,
  valueDecimals = 1,
  className,
}: ComparisonBarProps) {
  const reduce = useReducedMotion();
  if (items.length === 0) return null;

  const allVals = items.flatMap((item) =>
    item.baseline !== undefined ? [item.value, item.baseline] : [item.value],
  );
  const max = maxProp ?? Math.max(...allVals);

  return (
    <div role="list" aria-label="Comparison" className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        const sev = item.severity ?? autoSeverity(item.value, item.baseline, higherIsBetter);
        const c = severityToken[sev];
        const barPct = max > 0 ? Math.min(1, item.value / max) : 0;
        const basePct = item.baseline !== undefined && max > 0
          ? Math.min(1, item.baseline / max)
          : null;
        const display = item.value.toFixed(valueDecimals);

        return (
          <motion.div
            key={item.label}
            role="listitem"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: reduce ? 0 : i * 0.06,
              duration: reduce ? 0 : 0.38,
              ease: ease.kanjo,
            }}
          >
            {/* Label row */}
            <div className="flex items-baseline justify-between mb-1.5">
              <div>
                <span className="text-[13px] text-konjo-fg font-medium">{item.label}</span>
                {item.sublabel && (
                  <span className="ml-2 text-[11px] text-konjo-fg-muted text-konjo-mono">
                    {item.sublabel}
                  </span>
                )}
              </div>
              <span className="text-konjo-mono text-[12px] tabular-nums" style={{ color: c }}>
                {display}
                {unit && (
                  <span className="text-konjo-fg-muted ml-0.5 text-[10px]">{unit}</span>
                )}
              </span>
            </div>

            {/* Bar track */}
            <div
              role="meter"
              aria-label={item.label}
              aria-valuenow={item.value}
              aria-valuemin={0}
              aria-valuemax={max}
              className="relative h-[6px] rounded-full overflow-visible"
              style={{ background: color.line }}
            >
              {/* Fill bar */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: barPct }}
                transition={{
                  delay: reduce ? 0 : i * 0.06,
                  duration: reduce ? 0 : 0.8,
                  ease: ease.kanjo,
                }}
                style={{
                  transformOrigin: "left",
                  width: "100%",
                  background: c,
                  boxShadow: `0 0 8px ${c}`,
                }}
              />
              {/* Baseline marker */}
              {basePct !== null && (
                <div
                  aria-hidden
                  className="absolute top-[-3px] bottom-[-3px] w-[2px] rounded-sm"
                  style={{
                    left: `${basePct * 100}%`,
                    background: color.fgMuted,
                    opacity: 0.6,
                  }}
                />
              )}
            </div>

            {/* Baseline label */}
            {item.baseline !== undefined && (
              <div className="mt-1 text-konjo-mono text-[10px] text-konjo-fg-faint">
                baseline {item.baseline.toFixed(valueDecimals)}
                {unit ? ` ${unit}` : ""}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
