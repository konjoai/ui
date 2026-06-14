"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";

type BenchmarkRow = {
  glyph: string;
  slug: string;
  metric: string;
  konjoDisplay: string;
  kanjoPct: number;
  baselineDisplay: string;
  baselinePct: number;
  gain: string;
  color: string;
};

const ROWS: BenchmarkRow[] = [
  {
    glyph: "◐",
    slug: "squish",
    metric: "Inference Throughput",
    konjoDisplay: "42 tok/s",
    kanjoPct: 85,
    baselineDisplay: "8 tok/s · CPU baseline",
    baselinePct: 16,
    gain: "5.3×",
    color: "var(--color-konjo-brand)",
  },
  {
    glyph: "✸",
    slug: "kyro",
    metric: "NDCG@10 Retrieval",
    konjoDisplay: "91%",
    kanjoPct: 80,
    baselineDisplay: "75% · vectorDB avg",
    baselinePct: 66,
    gain: "+21%",
    color: "var(--color-konjo-accent)",
  },
  {
    glyph: "❖",
    slug: "kohaku",
    metric: "Memory Recall",
    konjoDisplay: "89%",
    kanjoPct: 78,
    baselineDisplay: "60% · naive KV",
    baselinePct: 52,
    gain: "+48%",
    color: "var(--color-konjo-good)",
  },
  {
    glyph: "⌬",
    slug: "lopi",
    metric: "Task Success Rate",
    konjoDisplay: "94%",
    kanjoPct: 83,
    baselineDisplay: "50% · manual orchestration",
    baselinePct: 44,
    gain: "+88%",
    color: "var(--color-konjo-warm)",
  },
];

function Bar({
  row,
  index,
  inView,
  reduce,
}: {
  row: BenchmarkRow;
  index: number;
  inView: boolean;
  reduce: boolean | null;
}) {
  const delay = index * 0.1;
  return (
    <Link
      href={`/products/${row.slug}`}
      className="group block rounded-konjo px-4 py-3.5 transition-colors hover:bg-konjo-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-offset-1"
    >
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span
            className="text-konjo-mono text-lg leading-none"
            style={{ color: row.color }}
            aria-hidden
          >
            {row.glyph}
          </span>
          <div>
            <span className="text-konjo-mono text-xs font-semibold text-konjo-fg">
              {row.slug}
            </span>
            <span className="ml-2 text-[11px] text-konjo-fg-faint">{row.metric}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-konjo-mono text-sm font-semibold text-konjo-fg">
            {row.konjoDisplay}
          </span>
          <span
            className="text-konjo-mono rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            style={{
              background: `color-mix(in oklch, ${row.color} 15%, transparent)`,
              color: row.color,
            }}
          >
            {row.gain}
          </span>
        </div>
      </div>

      {/* Konjo bar */}
      <div className="relative mb-1.5 h-1.5 overflow-hidden rounded-full bg-konjo-surface/60">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: row.color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${row.kanjoPct}%` } : { width: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }
          }
        />
      </div>

      {/* Baseline bar */}
      <div className="relative h-1 overflow-hidden rounded-full bg-konjo-surface/60">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-konjo-line/50"
          initial={{ width: 0 }}
          animate={inView ? { width: `${row.baselinePct}%` } : { width: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + 0.15 }
          }
        />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2.5 text-[10px] text-konjo-fg-faint whitespace-nowrap">
          {row.baselineDisplay}
        </span>
      </div>
    </Link>
  );
}

/** Competitive benchmark bars — four products vs. industry baseline, animated on scroll. */
export function BenchmarkSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      aria-label="Performance benchmarks"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8"
      >
        <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
          benchmarks · measured on M2 Pro
        </p>
        <h2 className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Built to outperform
        </h2>
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Four headline metrics against industry baselines. Every number is
          reproducible — each repo ships its own benchmark suite.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.1 }}
        className="glass-konjo rounded-konjo-xl divide-y divide-konjo-line/30 overflow-hidden"
      >
        {ROWS.map((row, i) => (
          <Bar key={row.slug} row={row} index={i} inView={inView} reduce={reduce} />
        ))}
      </motion.div>
    </section>
  );
}
