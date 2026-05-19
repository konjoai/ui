import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { cn } from "../lib/cn";
import { color, severity as severityToken } from "../lib/tokens";
import type { Severity } from "../lib/tokens";
import { ease } from "../lib/motion";

/** A single data point in a TimeSeriesChart. */
export interface TimeSeriesPoint {
  /** Monotonic time value — Unix ms, step index, or any number. */
  t: number;
  value: number;
}

/** Props for TimeSeriesChart. */
export interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  /** Label shown top-left above the latest value. */
  label?: string;
  /** Unit suffix — e.g. "tok/s", "ms", "%". */
  unit?: string;
  /** Line/fill color tint. Default "info". */
  severity?: Severity;
  width?: number;
  height?: number;
  /** Render an area fill below the line. Default true. */
  fill?: boolean;
  /** Number of horizontal y-axis guide lines. Default 3. */
  yGuides?: number;
  className?: string;
}

const PAD = { top: 14, right: 10, bottom: 22, left: 34 } as const;

/**
 * Konjo TimeSeriesChart — a rolling sparkline for live metric streams.
 *
 * Used by kairu (tok/s over time), squish (throughput monitor), toki (training
 * loss curves). The SVG path draws in via `kanjo` on mount; the area fill fades
 * in behind it. Honors `prefers-reduced-motion` — sets duration to 0.
 */
export function TimeSeriesChart({
  data,
  label,
  unit,
  severity = "info",
  width = 400,
  height = 130,
  fill = true,
  yGuides = 3,
  className,
}: TimeSeriesChartProps) {
  const reduce = useReducedMotion();
  const uid = useId();
  const gradId = `tsc-grad-${uid.replace(/:/g, "")}`;

  const c = severityToken[severity];
  const iw = width - PAD.left - PAD.right;
  const ih = height - PAD.top - PAD.bottom;

  if (data.length < 2) {
    return (
      <div
        role="img"
        aria-label={label ?? "Time series chart — no data"}
        className={cn(
          "relative flex items-center justify-center rounded-konjo",
          "bg-konjo-surface/60 border border-konjo-line",
          className,
        )}
        style={{ width, height }}
      >
        <span className="text-konjo-fg-faint text-konjo-mono text-[11px]">no data</span>
      </div>
    );
  }

  const minT = data[0].t;
  const maxT = data[data.length - 1].t;
  const vals = data.map((d) => d.value);
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const rangeV = maxV === minV ? 1 : maxV - minV;
  const rangeT = maxT === minT ? 1 : maxT - minT;

  const toX = (t: number) => PAD.left + ((t - minT) / rangeT) * iw;
  const toY = (v: number) => PAD.top + ih - ((v - minV) / rangeV) * ih;

  const pts = data.map((d) => ({ x: toX(d.t), y: toY(d.value) }));
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = [
    linePath,
    `L ${pts[pts.length - 1].x.toFixed(1)} ${(PAD.top + ih).toFixed(1)}`,
    `L ${PAD.left.toFixed(1)} ${(PAD.top + ih).toFixed(1)} Z`,
  ].join(" ");

  const latest = data[data.length - 1].value;
  const latestStr = Number.isInteger(latest) ? `${latest}` : latest.toFixed(2);

  const guides = Array.from({ length: yGuides }, (_, i) => {
    const frac = i / (yGuides - 1);
    const v = minV + frac * rangeV;
    return { y: toY(v), text: Number.isInteger(v) ? `${Math.round(v)}` : v.toFixed(1) };
  });

  return (
    <div
      role="img"
      aria-label={`${label ?? "Chart"}: latest ${latestStr}${unit ? ` ${unit}` : ""}`}
      className={cn("relative rounded-konjo bg-konjo-surface/60 border border-konjo-line overflow-hidden", className)}
      style={{ width, height }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor={c} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y guides */}
        {guides.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD.left} x2={PAD.left + iw}
              y1={g.y} y2={g.y}
              stroke={color.line} strokeWidth={1}
            />
            <text
              x={PAD.left - 4} y={g.y + 4}
              textAnchor="end" fill={color.fgFaint}
              fontSize={9} fontFamily="monospace"
            >
              {g.text}
            </text>
          </g>
        ))}

        {/* Area fill */}
        {fill && (
          <motion.path
            d={areaPath}
            fill={`url(#${gradId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: ease.kanjo }}
          />
        )}

        {/* Line */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={c}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 5px ${c})` }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 1.1, ease: ease.kanjo }}
        />

        {/* Latest dot */}
        <motion.circle
          cx={pts[pts.length - 1].x}
          cy={pts[pts.length - 1].y}
          r={4}
          fill={c}
          style={{ filter: `drop-shadow(0 0 8px ${c})` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : 1.0, ease: ease.kanjo }}
        />
      </svg>

      {/* Label + latest value overlay */}
      {(label ?? unit) && (
        <div className="absolute top-2 left-2 flex items-baseline gap-1.5 pointer-events-none">
          {label && (
            <span className="text-konjo-mono text-[10px] uppercase tracking-[0.14em] text-konjo-fg-muted">
              {label}
            </span>
          )}
          <span className="text-konjo-mono text-[12px] tabular-nums" style={{ color: c }}>
            {latestStr}
            {unit && (
              <span className="text-konjo-fg-muted ml-0.5 text-[10px]">{unit}</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
