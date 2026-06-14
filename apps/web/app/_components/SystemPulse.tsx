"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";

type MetricDef = {
  id: string;
  glyph: string;
  label: string;
  unit: string;
  base: number;
  amp: number;
  decimals: number;
  color: string;
};

const METRICS: MetricDef[] = [
  { id: "throughput", glyph: "◐", label: "throughput", unit: " tok/s", base: 847,  amp: 42,  decimals: 0, color: "var(--color-konjo-brand)"  },
  { id: "latency",    glyph: "▲", label: "p99 latency", unit: " ms",   base: 8.2,  amp: 1.4, decimals: 1, color: "var(--color-konjo-warm)"   },
  { id: "recalls",    glyph: "❖", label: "recalls/min", unit: "",       base: 241,  amp: 28,  decimals: 0, color: "var(--color-konjo-good)"   },
  { id: "agents",     glyph: "⌬", label: "agents live", unit: "",       base: 4,    amp: 2,   decimals: 0, color: "var(--color-konjo-cool)"   },
  { id: "coverage",   glyph: "◉", label: "attn cov.",  unit: "%",       base: 76,   amp: 5,   decimals: 0, color: "var(--color-konjo-accent)" },
];

function seedVal(base: number, amp: number, seed: number): number {
  return base + (Math.sin(seed * 7.3) * 0.5 + 0.5) * amp - amp * 0.5;
}

/** Single metric chip — value animates between updates with a brief scale bounce. */
function MetricChip({ metric, value }: { metric: MetricDef; value: number }) {
  const reduce = useReducedMotion();
  const formatted = metric.decimals > 0 ? value.toFixed(metric.decimals) : String(Math.round(value));

  return (
    <div className="flex items-center gap-1.5 text-konjo-mono">
      <span className="text-sm leading-none" style={{ color: metric.color }} aria-hidden>
        {metric.glyph}
      </span>
      <div className="flex items-baseline gap-0.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={formatted}
            initial={reduce ? { opacity: 0.7 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: ease.nehan }}
            className="tabular-nums text-xs font-medium"
            style={{ color: metric.color }}
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] text-konjo-fg-faint">{metric.unit}</span>
      </div>
      <span className="hidden text-[9px] uppercase tracking-widest text-konjo-fg-faint sm:inline">
        {metric.label}
      </span>
    </div>
  );
}

/**
 * Compact live system metrics strip — shows five aggregate KPIs that pulse
 * with realistic jitter every ~2 s. Placed between the hero and the live ticker.
 */
export function SystemPulse() {
  const reduce = useReducedMotion();
  const tickRef = useRef(0);
  const [values, setValues] = useState<number[]>(() =>
    METRICS.map((m) => seedVal(m.base, m.amp, 0)),
  );

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      tickRef.current++;
      setValues(METRICS.map((m) => seedVal(m.base, m.amp, tickRef.current)));
    }, 2200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div
      className="border-b border-konjo-line/30 bg-konjo-surface/20 backdrop-blur-sm"
      aria-label="Live system metrics"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2.5">
        {/* Live badge */}
        <div className="flex items-center gap-1.5 text-konjo-mono shrink-0">
          <span
            className="konjo-pulse inline-block size-1.5 rounded-full"
            style={{ background: "var(--color-konjo-good)" }}
            aria-hidden
          />
          <span className="text-[10px] uppercase tracking-[0.2em] text-konjo-good">
            system live
          </span>
        </div>

        {/* Metric chips */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5">
          {METRICS.map((m, i) => (
            <MetricChip key={m.id} metric={m} value={values[i]} />
          ))}
        </div>

        {/* Vertical separator dot visible on wide screens */}
        <span
          className="hidden text-[10px] text-konjo-fg-faint xl:inline text-konjo-mono"
          aria-hidden
        >
          9 products · all operational
        </span>
      </div>
    </div>
  );
}
