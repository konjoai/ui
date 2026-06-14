"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { severity as sevColor } from "@konjoai/ui";
import type { ProductMetric } from "@/lib/products";

interface ProductMetricStripProps {
  metric: ProductMetric;
  productName: string;
}

/**
 * Full-width animated headline metric strip — the key KPI counts up from 0
 * once it enters the viewport. Sits between the breadcrumbs and the product hero.
 */
export function ProductMetricStrip({ metric, productName }: ProductMetricStripProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState("0");

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
    </div>
  );
}
