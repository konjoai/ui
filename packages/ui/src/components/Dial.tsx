import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";
import { color, severity as severityToken } from "../lib/tokens";
import type { Severity } from "../lib/tokens";
import { ease } from "../lib/motion";

export interface DialProps {
  /** Current value. Clamped to [min, max]. */
  value: number;
  min?: number;
  max?: number;
  /** Diameter in px. Default 200. */
  size?: number;
  /** Centered title above the number. */
  label?: string;
  /** Suffix shown next to the number — e.g. "%", "ms", "tok/s". */
  unit?: string;
  /** Optional smaller line under the number. */
  sublabel?: string;
  /** Tints the arc. Default "info". */
  severity?: Severity;
  /** Stroke width of the arc, in px. Default = size / 14. */
  thickness?: number;
  /** Hide the numeric center readout. */
  hideValue?: boolean;
  /** Format the displayed number. Default = Math.round. */
  format?: (v: number) => string;
  className?: string;
}

const TAU = Math.PI * 2;
const ARC_FRACTION = 0.78;          // 281° sweep — leaves a gap at the bottom
const START_ANGLE = Math.PI * (1 - ARC_FRACTION) / 2 + Math.PI / 2;

/**
 * Konjo Dial — a circular gauge for any 0..1 (or min..max) value.
 *
 * Used across the portfolio for: compression ratio (vectro), throughput
 * (kairu), latency p99 (squish), significance (toki). The arc fills in via
 * `kanjo` easing; the value rolls in concert via spring-less stroke-dashoffset
 * animation so the readout and the arc are always in sync.
 */
export function Dial({
  value,
  min = 0,
  max = 100,
  size = 200,
  label,
  unit,
  sublabel,
  severity = "info",
  thickness,
  hideValue = false,
  format,
  className,
}: DialProps) {
  const reduce = useReducedMotion();
  const clamped = Math.max(min, Math.min(max, value));
  const t = max === min ? 0 : (clamped - min) / (max - min);
  const stroke = thickness ?? size / 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = TAU * r;
  const arcLength = circumference * ARC_FRACTION;
  const dash = arcLength * t;

  const fillColor = severityToken[severity];
  const trackColor = color.line;

  // Start the arc from the left of the gap (bottom-left), sweep clockwise.
  const startDeg = (START_ANGLE * 180) / Math.PI - 90;

  const display = format ? format(clamped) : `${Math.round(clamped)}`;

  return (
    <div
      className={cn("relative inline-flex flex-col items-center", className)}
      style={{ width: size, height: size }}
      role="meter"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: `rotate(${startDeg}deg)` }}
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          opacity={0.55}
        />
        {/* Glow halo */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: arcLength - dash }}
          transition={{ duration: reduce ? 0 : 0.9, ease: ease.kanjo }}
          style={{ filter: `drop-shadow(0 0 12px ${fillColor})` }}
          opacity={0.35}
        />
        {/* Fill */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: arcLength - dash }}
          transition={{ duration: reduce ? 0 : 0.9, ease: ease.kanjo }}
        />
      </svg>

      {!hideValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
          {label && (
            <div
              className="text-[11px] uppercase tracking-[0.18em] text-konjo-fg-muted mb-1"
              style={{ fontSize: Math.max(10, size * 0.058) }}
            >
              {label}
            </div>
          )}
          <div
            className="text-konjo-display text-konjo-fg leading-none tabular-nums"
            style={{ fontSize: size * 0.22 }}
          >
            {display}
            {unit && (
              <span
                className="text-konjo-fg-muted ml-1"
                style={{ fontSize: size * 0.11 }}
              >
                {unit}
              </span>
            )}
          </div>
          {sublabel && (
            <div
              className="text-konjo-mono text-konjo-fg-muted mt-1.5"
              style={{ fontSize: Math.max(10, size * 0.06) }}
            >
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
