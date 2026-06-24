"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, animate, AnimatePresence } from "motion/react";
import { ease, cn } from "@konjoai/ui";
import { ScrambleText } from "./ScrambleText";

type Baseline = "cpu" | "gpt4o";

type BenchmarkRow = {
  glyph: string;
  slug: string;
  metric: string;
  konjoDisplay: string;
  kanjoPct: number;
  color: string;
  cpu: { display: string; pct: number; gainValue: number; gainSuffix: string; gainPrefix: string };
  gpt4o: { display: string; pct: number; gainValue: number; gainSuffix: string; gainPrefix: string };
};

const ROWS: BenchmarkRow[] = [
  {
    glyph:        "◐",
    slug:         "squish",
    metric:       "Inference Throughput",
    konjoDisplay: "42 tok/s",
    kanjoPct:     85,
    color:        "var(--color-konjo-brand)",
    cpu:   { display: "8 tok/s · CPU baseline",  pct: 16, gainValue: 5.3, gainSuffix: "×", gainPrefix: "" },
    gpt4o: { display: "28 tok/s · GPT-4o API",   pct: 57, gainValue: 1.5, gainSuffix: "×", gainPrefix: "" },
  },
  {
    glyph:        "✸",
    slug:         "kyro",
    metric:       "NDCG@10 Retrieval",
    konjoDisplay: "91%",
    kanjoPct:     80,
    color:        "var(--color-konjo-accent)",
    cpu:   { display: "75% · vectorDB avg",       pct: 66, gainValue: 21, gainSuffix: "%", gainPrefix: "+" },
    gpt4o: { display: "82% · GPT-4o RAG",         pct: 72, gainValue: 11, gainSuffix: "%", gainPrefix: "+" },
  },
  {
    glyph:        "❖",
    slug:         "kohaku",
    metric:       "Memory Recall",
    konjoDisplay: "89%",
    kanjoPct:     78,
    color:        "var(--color-konjo-good)",
    cpu:   { display: "60% · naive KV",           pct: 52, gainValue: 48, gainSuffix: "%", gainPrefix: "+" },
    gpt4o: { display: "71% · GPT-4o memory",      pct: 62, gainValue: 25, gainSuffix: "%", gainPrefix: "+" },
  },
  {
    glyph:        "⌬",
    slug:         "lopi",
    metric:       "Task Success Rate",
    konjoDisplay: "94%",
    kanjoPct:     83,
    color:        "var(--color-konjo-warm)",
    cpu:   { display: "50% · manual orchestration", pct: 44, gainValue: 88, gainSuffix: "%", gainPrefix: "+" },
    gpt4o: { display: "76% · GPT-4o Assistants",    pct: 67, gainValue: 24, gainSuffix: "%", gainPrefix: "+" },
  },
];

function Bar({
  row,
  index,
  inView,
  reduce,
  mode,
}: {
  row: BenchmarkRow;
  index: number;
  inView: boolean;
  reduce: boolean | null;
  mode: Baseline;
}) {
  const baseline = row[mode];
  const isFloat = !Number.isInteger(baseline.gainValue);
  const delay = index * 0.1;
  const [gainDisplay, setGainDisplay] = useState(
    reduce ? baseline.gainValue : 0,
  );

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setGainDisplay(baseline.gainValue); return; }
    const ctrl = animate(0, baseline.gainValue, {
      duration: 0.9,
      ease: "easeOut",
      delay: delay + 0.15,
      onUpdate: (v) =>
        setGainDisplay(
          isFloat ? Math.round(v * 10) / 10 : Math.round(v),
        ),
    });
    return () => ctrl.stop();
  }, [inView, baseline.gainValue, reduce, delay, isFloat]);

  const gainStr = `${baseline.gainPrefix}${gainDisplay}${baseline.gainSuffix}`;

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
            <span className="ml-2 text-[11px] text-konjo-fg-faint">
              {row.metric}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-konjo-mono text-sm font-semibold text-konjo-fg">
            {row.konjoDisplay}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={gainStr}
              initial={{ opacity: 0, y: -4, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.88 }}
              transition={{ duration: 0.18, ease: ease.nehan }}
              className="text-konjo-mono rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide tabular-nums"
              style={{
                background: `color-mix(in oklch, ${row.color} 15%, transparent)`,
                color: row.color,
              }}
              aria-label={`${gainStr} vs ${mode === "cpu" ? "CPU" : "GPT-4o"}`}
            >
              {gainStr}
            </motion.span>
          </AnimatePresence>
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
          animate={inView ? { width: `${baseline.pct}%` } : { width: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: delay + 0.15 }
          }
        />
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-2.5 text-[10px] text-konjo-fg-faint whitespace-nowrap">
          {baseline.display}
        </span>
      </div>
    </Link>
  );
}

/** Competitive benchmark bars — four products with switchable comparison baseline. */
export function BenchmarkSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [mode, setMode] = useState<Baseline>("cpu");

  return (
    <section
      id="benchmarks"
      ref={ref}
      aria-label="Performance benchmarks"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
            benchmarks · measured on M2 Pro
          </p>
          <ScrambleText
            as="h2"
            text="Built to outperform"
            className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
            delay={150}
          />
          <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
            Four headline metrics against two industry baselines — toggle to compare.
          </p>
        </div>

        {/* Baseline toggle */}
        <div
          className="flex items-center gap-1 rounded-konjo border border-konjo-line/40 bg-konjo-surface/30 p-1"
          role="group"
          aria-label="Select comparison baseline"
        >
          {(["cpu", "gpt4o"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "text-konjo-mono rounded px-3 py-1.5 text-[11px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent",
                mode === m
                  ? "bg-konjo-brand/15 text-konjo-fg"
                  : "text-konjo-fg-muted hover:text-konjo-fg",
              )}
            >
              {m === "cpu" ? "vs CPU" : "vs GPT-4o"}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.1 }}
        className="glass-konjo rounded-konjo-xl divide-y divide-konjo-line/30 overflow-hidden"
      >
        {ROWS.map((row, i) => (
          <Bar
            key={row.slug}
            row={row}
            index={i}
            inView={inView}
            reduce={reduce}
            mode={mode}
          />
        ))}
      </motion.div>
    </section>
  );
}
