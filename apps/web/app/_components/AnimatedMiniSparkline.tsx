"use client";

import { motion, useReducedMotion } from "motion/react";

function seed(slug: string): number {
  return slug.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
}

interface AnimatedMiniSparklineProps {
  slug: string;
  width?: number;
  height?: number;
  color?: string;
  hovered?: boolean;
}

/**
 * Client-side sparkline that draws its path into view on mount and re-draws
 * on card hover — pathLength 0→1 with a spring easing for a premium feel.
 */
export function AnimatedMiniSparkline({
  slug,
  width = 72,
  height = 28,
  color = "var(--color-konjo-good)",
  hovered = false,
}: AnimatedMiniSparklineProps) {
  const reduce = useReducedMotion();
  const s = seed(slug);
  const pts = Array.from({ length: 8 }, (_, i) => {
    const v = 97.5 + Math.sin((s + i * 2.7) * 0.6) * 2.1 + Math.cos((s * 0.3 + i) * 0.9) * 1.1;
    return Math.max(92, Math.min(100, v));
  });
  const lo = Math.min(...pts);
  const hi = Math.max(...pts);
  const range = hi - lo || 1;
  const pad = 3;
  const coords = pts.map((v, i) => [
    (i / (pts.length - 1)) * width,
    height - pad - ((v - lo) / range) * (height - pad * 2),
  ] as const);
  const d = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  if (reduce) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="hidden sm:block">
        <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className="hidden sm:block"
    >
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.5 }}
        animate={
          hovered
            ? { pathLength: 1, opacity: 0.9 }
            : { pathLength: 0.85, opacity: 0.6 }
        }
        transition={{ duration: hovered ? 0.55 : 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
