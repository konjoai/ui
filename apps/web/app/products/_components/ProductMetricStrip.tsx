"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { severity as sevColor } from "@konjoai/ui";
import type { ProductMetric } from "@/lib/products";

interface ProductMetricStripProps {
  metric: ProductMetric;
  productName: string;
}

/**
 * Full-width animated headline metric strip — KPI counts up from 0 on viewport entry.
 * When metric.min / metric.max are defined, renders an animated range bar beneath the value.
 */
export function ProductMetricStrip({ metric, productName }: ProductMetricStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState("0");

  const hasRange = metric.min !== undefined && metric.max !== undefined;
  const pct = hasRange
    ? Math.round(((metric.value - metric.min!) / (metric.max! - metric.min!)) * 100)
    : 0;

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(
        Number.isInteger(metric.value) ? String(metric.value) : metric.value.toFixed(1),
      );
      return;
    }
    const controls = animate(0, metric.value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) =>
        setDisplay(Number.isInteger(metric.value) ? String(Math.round(v)) : v.toFixed(1)),
    });
    return () => controls.stop();
  }, [inView, metric.value, reduce]);

  const color = sevColor[metric.severity];

  return (
    <div
      ref={ref}
      className="mx-auto max-w-6xl border-b border-konjo-line/40 px-6 py-5"
      aria-label={`${productName} headline metric: ${metric.label} ${metric.value}${metric.unit}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2.5">
          <span
            className="text-konjo-display text-5xl font-semibold tabular-nums leading-none sm:text-6xl"
            style={{ color }}
          >
            {display}
            <span className="ml-1.5 text-2xl text-konjo-fg-muted">{metric.unit}</span>
          </span>
          <span className="text-konjo-mono text-xs uppercase tracking-widest text-konjo-fg-faint">
            {metric.label}
          </span>
        </div>
        <span
          className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-good/30 bg-konjo-good/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-konjo-good"
          aria-label="Live metric"
        >
          <span className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good" aria-hidden />
          Live
        </span>
      </div>

      {hasRange && (
        <div className="mt-4 max-w-sm">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "rgba(124,58,237,0.12)" }}
            role="meter"
            aria-valuenow={metric.value}
            aria-valuemin={metric.min}
            aria-valuemax={metric.max}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: color }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${pct}%` } : { width: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 1.6, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <div className="text-konjo-mono mt-1.5 flex justify-between text-[10px] text-konjo-fg-faint">
            <span>{metric.min}{metric.unit}</span>
            <span className="tabular-nums" style={{ color }}>{pct}%</span>
            <span>{metric.max}{metric.unit}</span>
          </div>
        </div>
      )}
    </div>
  );
}
