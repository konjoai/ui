import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";
import { color, severity as severityToken } from "../lib/tokens";
import type { Severity } from "../lib/tokens";
import { ease } from "../lib/motion";

export interface RiskRingItem {
  label: string;
  /** 0..1 — how filled the ring is. */
  value: number;
  /** Tints the ring stroke. */
  severity?: Severity;
  /** Override the formatted center display for this ring (when active). */
  display?: string;
}

export interface RiskRingProps {
  /** Outer to inner. Up to 4 rings; 3 is canonical. */
  rings: RiskRingItem[];
  size?: number;
  /** Stroke width per ring. Default = size / 22. */
  thickness?: number;
  /** Gap between rings. Default = size / 36. */
  gap?: number;
  /** Center title. Default first ring's label. */
  title?: string;
  /** Center subtitle below the score. */
  subtitle?: string;
  className?: string;
}

const TAU = Math.PI * 2;

/**
 * Konjo RiskRing — concentric arcs for nested risk metrics.
 *
 * Built for squash (EU AI Act / NIST RMF / OWASP LLM Top-10 tri-ring) but
 * generic enough for any nested 0..1 metric. The first (outermost) ring is
 * the headline; inner rings are increasingly specific.
 *
 * Interpretation: a fuller ring = better. Use `severity` to color the
 * outcome (green = ok, red = critical), not the raw fill amount.
 */
export function RiskRing({
  rings,
  size = 280,
  thickness,
  gap,
  title,
  subtitle,
  className,
}: RiskRingProps) {
  const reduce = useReducedMotion();
  if (rings.length === 0) return null;

  const t = thickness ?? size / 22;
  const g = gap ?? size / 36;
  const cx = size / 2;
  const cy = size / 2;

  // Precompute radii (outer to inner)
  const radii = rings.map((_, i) => (size / 2) - t / 2 - i * (t + g));

  const headline = rings[0];
  const headlineColor = severityToken[headline.severity ?? "info"];

  return (
    <div
      className={cn("relative inline-flex flex-col items-center", className)}
      style={{ width: size, height: size }}
      role="group"
      aria-label="Risk ring"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          {rings.map((r, i) => {
            const c = severityToken[r.severity ?? "info"];
            return (
              <filter key={i} id={`konjo-glow-${i}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feFlood floodColor={c} floodOpacity="0.6" />
                <feComposite in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            );
          })}
        </defs>
        {rings.map((r, i) => {
          const radius = radii[i];
          const circ = TAU * radius;
          const value = Math.max(0, Math.min(1, r.value));
          const c = severityToken[r.severity ?? "info"];
          return (
            <g key={i} transform={`rotate(-90 ${cx} ${cy})`}>
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={color.line}
                strokeWidth={t}
                opacity={0.5}
              />
              <motion.circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={c}
                strokeWidth={t}
                strokeLinecap="round"
                strokeDasharray={circ}
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: circ * (1 - value) }}
                transition={{ duration: reduce ? 0 : 1.2 + i * 0.2, ease: ease.kanjo }}
                filter={`url(#konjo-glow-${i})`}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <div
          className="text-[10px] uppercase tracking-[0.22em] text-konjo-fg-muted"
          style={{ fontSize: Math.max(9, size * 0.04) }}
        >
          {title ?? headline.label}
        </div>
        <div
          className="text-konjo-display text-konjo-fg leading-none mt-1.5 tabular-nums"
          style={{ fontSize: size * 0.16, color: headlineColor }}
        >
          {headline.display ?? `${Math.round(headline.value * 100)}`}
          <span className="text-konjo-fg-muted ml-0.5" style={{ fontSize: size * 0.07 }}>
            %
          </span>
        </div>
        {subtitle && (
          <div
            className="text-konjo-mono text-konjo-fg-muted mt-2"
            style={{ fontSize: Math.max(10, size * 0.045) }}
          >
            {subtitle}
          </div>
        )}
        {/* Ring legend */}
        <div className="mt-3 flex flex-col gap-1">
          {rings.slice(1).map((r) => {
            const c = severityToken[r.severity ?? "info"];
            return (
              <div
                key={r.label}
                className="flex items-center gap-2 text-[11px] text-konjo-fg-muted"
              >
                <span
                  className="inline-block rounded-full"
                  style={{ width: 6, height: 6, background: c, boxShadow: `0 0 6px ${c}` }}
                />
                <span className="text-konjo-mono">{r.label}</span>
                <span className="text-konjo-mono tabular-nums" style={{ color: c }}>
                  {Math.round(r.value * 100)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
