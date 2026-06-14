"use client";

import { useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ease, severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";
import { ScrambleText } from "./ScrambleText";

// SVG coordinate space: 400 wide × 32 tall per row
const VW = 400;
const VH = 32;

type WaveCfg = { freq: number; amp: number; spd: number };

// freq = cycles per VW; amp = peak-to-center pixels (SVG units); spd = seconds per loop
const WAVE_CFG: Record<string, WaveCfg> = {
  squish:  { freq: 7,   amp: 10, spd: 3.8 },
  kyro:    { freq: 4,   amp: 7,  spd: 5.5 },
  vectro:  { freq: 5,   amp: 6,  spd: 6.0 },
  kairu:   { freq: 3,   amp: 12, spd: 4.5 },
  miru:    { freq: 6,   amp: 9,  spd: 4.8 },
  toki:    { freq: 1.5, amp: 4,  spd: 9.0 },
  kohaku:  { freq: 2.5, amp: 7,  spd: 7.5 },
  lopi:    { freq: 3,   amp: 8,  spd: 5.5 },
  drex:    { freq: 4.5, amp: 11, spd: 4.2 },
};

/** Generates two full periods of a sine wave path in SVG coordinate space. */
function makePath({ freq, amp }: WaveCfg): string {
  const total = VW * 2; // two periods for seamless loop
  const cy = VH / 2;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = (i / 120) * total;
    const y = cy + Math.sin((x / VW) * freq * Math.PI * 2) * amp;
    pts.push(i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return pts.join("");
}

const WAVE_DATA = Object.fromEntries(
  PRODUCTS.map((p) => {
    const cfg = WAVE_CFG[p.slug] ?? { freq: 3, amp: 7, spd: 6 };
    return [p.slug, { cfg, d: makePath(cfg) }];
  }),
);

/** Single animated waveform channel for one product. */
function WaveRow({
  product,
  dim,
  inView,
  index,
}: {
  product: (typeof PRODUCTS)[number];
  dim: boolean;
  inView: boolean;
  index: number;
}) {
  const reduce = useReducedMotion();
  const col = sevColor[product.metric.severity];
  const { cfg, d } = WAVE_DATA[product.slug];
  const metricVal = Number.isInteger(product.metric.value)
    ? String(product.metric.value)
    : product.metric.value.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={
        inView ? { opacity: dim ? 0.22 : 1, x: 0 } : { opacity: 0, x: -10 }
      }
      transition={{
        duration: dim ? 0.12 : 0.4,
        ease: ease.kanjo,
        delay: inView ? index * 0.045 : 0,
      }}
      className="flex items-center gap-3 border-b border-konjo-line/20 px-5 py-1.5 last:border-0"
    >
      {/* Product label */}
      <div className="flex w-[80px] shrink-0 items-center gap-1.5">
        <span
          className="text-konjo-mono text-base leading-none"
          style={{ color: col }}
          aria-hidden
        >
          {product.glyph}
        </span>
        <span className="text-konjo-mono text-[10px] text-konjo-fg-muted">
          {product.slug}
        </span>
      </div>

      {/* Waveform */}
      <div className="min-w-0 flex-1 overflow-hidden rounded">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <g>
            {/* SVG-native animation stays in SVG coordinate space — loop is always exact */}
            {!reduce && (
              <animateTransform
                attributeName="transform"
                type="translate"
                from={`0,0`}
                to={`-${VW},0`}
                dur={`${cfg.spd}s`}
                repeatCount="indefinite"
              />
            )}
            <path
              d={d}
              fill="none"
              stroke={col}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={0.55}
            />
          </g>
        </svg>
      </div>

      {/* Metric value */}
      <div className="w-[60px] shrink-0 text-right">
        <span
          className="text-konjo-mono text-xs font-semibold tabular-nums"
          style={{ color: col }}
        >
          {metricVal}
          <span className="ml-px text-[9px] font-normal text-konjo-fg-faint">
            {product.metric.unit}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Oscilloscope-style section — nine animated sine-wave channels, one per product.
 * Wave frequency encodes throughput density; amplitude encodes variance.
 * Hover a row to isolate that channel and dim the rest.
 */
export function SignalMonitor() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <section
      id="signals"
      ref={ref}
      aria-label="Product signal monitor"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8"
      >
        <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
          signal monitor · 9 channels · live
        </p>
        <ScrambleText
          as="h2"
          text="Live signal feed"
          className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={150}
        />
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Nine inference channels — frequency encodes throughput density,
          amplitude encodes output variance. Hover to isolate.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.1 }}
        className="glass-konjo rounded-konjo-xl overflow-hidden"
        onMouseLeave={() => setActiveSlug(null)}
      >
        {/* Monitor header */}
        <div className="flex items-center justify-between border-b border-konjo-line/30 bg-konjo-surface/40 px-5 py-2.5">
          <div className="flex items-center gap-2">
            {!reduce && (
              <span
                className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good"
                aria-hidden
              />
            )}
            <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-good">
              Live
            </span>
          </div>
          <div className="text-konjo-mono flex items-center gap-4 text-[10px] text-konjo-fg-faint">
            <span>9 channels active</span>
            <span>
              <span className="text-konjo-accent">freq</span> = throughput ·{" "}
              <span className="text-konjo-warm">amp</span> = variance
            </span>
          </div>
        </div>

        {/* Waveform rows */}
        <div>
          {PRODUCTS.map((p, i) => (
            <div
              key={p.slug}
              onMouseEnter={() => setActiveSlug(p.slug)}
              className="cursor-default"
            >
              <WaveRow
                product={p}
                dim={activeSlug !== null && activeSlug !== p.slug}
                inView={inView}
                index={i}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
