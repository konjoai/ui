"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { ScrambleText } from "./ScrambleText";

type ChangelogEntry = {
  date: string;
  product: string;
  glyph: string;
  color: string;
  type: "feat" | "fix" | "perf" | "chore";
  title: string;
  detail?: string;
  version?: string;
};

const TYPE_LABEL: Record<ChangelogEntry["type"], string> = {
  feat:  "feat",
  fix:   "fix",
  perf:  "perf",
  chore: "chore",
};

const TYPE_COLOR: Record<ChangelogEntry["type"], string> = {
  feat:  "var(--color-konjo-accent)",
  fix:   "var(--color-konjo-warm)",
  perf:  "var(--color-konjo-good)",
  chore: "var(--color-konjo-fg-faint)",
};

const ENTRIES: ChangelogEntry[] = [
  {
    date: "2026-06-12",
    product: "squish",
    glyph: "◐",
    color: "var(--color-konjo-brand)",
    type: "feat",
    title: "INT4 AWQ gate: Qwen2.5-1.5B ships only at ≥ 70.6% arc_easy",
    detail: "SQINT2 path blocked until accuracy gate passes CI.",
    version: "v9.14.0",
  },
  {
    date: "2026-06-11",
    product: "kyro",
    glyph: "✸",
    color: "var(--color-konjo-accent)",
    type: "perf",
    title: "Redis semantic cache reduces repeat query latency from 68 ms → 2 ms",
    version: "v1.2.0",
  },
  {
    date: "2026-06-10",
    product: "lopi",
    glyph: "⌬",
    color: "var(--color-konjo-cool)",
    type: "feat",
    title: "Telegram + WhatsApp remote control via teloxide",
    detail: "Control running agents from mobile — pause, branch, or abort tasks.",
    version: "v0.1.0",
  },
  {
    date: "2026-06-09",
    product: "vectro",
    glyph: "◇",
    color: "var(--color-konjo-violet)",
    type: "perf",
    title: "Mojo SIMD path: VQZ compression 2.4× faster on SIMD-friendly hardware",
    version: "v8.0.0",
  },
  {
    date: "2026-06-08",
    product: "kohaku",
    glyph: "❖",
    color: "var(--color-konjo-good)",
    type: "feat",
    title: "OpenAI-compatible memory middleware — drop-in for /v1/chat/completions",
    version: "v0.4.0",
  },
  {
    date: "2026-06-07",
    product: "kairu",
    glyph: "▲",
    color: "var(--color-konjo-warm)",
    type: "perf",
    title: "Speculative decoding: draft accept rate 0.74 — p99 falls from 12 → 8.2 ms",
    version: "v0.6.0",
  },
  {
    date: "2026-06-06",
    product: "toki",
    glyph: "✕",
    color: "var(--color-konjo-hot)",
    type: "fix",
    title: "DAN v4.3 jailbreak now blocked by classifier + fine-tune — 89% robustness",
    version: "v0.5.0",
  },
  {
    date: "2026-06-05",
    product: "drex",
    glyph: "✦",
    color: "var(--color-konjo-fg-muted)",
    type: "feat",
    title: "KAN readout layer integrated — 136 tests green across oxidizr + blazr crates",
    version: "v0.2",
  },
];

const SHOW_INITIAL = 4;

function EntryRow({ entry, index, reduce }: { entry: ChangelogEntry; index: number; reduce: boolean | null }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: ease.kanjo }}
      className="group relative grid grid-cols-[1px_1fr] gap-x-4"
    >
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <div
          className="z-10 mt-[5px] size-2 shrink-0 rounded-full"
          style={{
            background: entry.color,
            boxShadow: `0 0 0 2px color-mix(in oklch, ${entry.color} 25%, transparent), 0 0 8px -1px ${entry.color}`,
          }}
          aria-hidden
        />
        <div className="flex-1 w-[1px] bg-konjo-line/30 mt-1" aria-hidden />
      </div>

      {/* Content */}
      <div className="pb-5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
          {/* Product badge */}
          <span
            className="text-konjo-mono inline-flex items-center gap-1 text-[10px] font-medium"
            style={{ color: entry.color }}
          >
            <span aria-hidden>{entry.glyph}</span>
            {entry.product}
          </span>

          {/* Type badge */}
          <span
            className="text-konjo-mono rounded px-1 text-[9px] uppercase tracking-widest"
            style={{
              color: TYPE_COLOR[entry.type],
              background: `color-mix(in oklch, ${TYPE_COLOR[entry.type]} 12%, transparent)`,
            }}
          >
            {TYPE_LABEL[entry.type]}
          </span>

          {/* Version */}
          {entry.version && (
            <span className="text-konjo-mono text-[9px] text-konjo-fg-faint">
              {entry.version}
            </span>
          )}

          {/* Date — right-aligned on wider screens */}
          <span className="text-konjo-mono ml-auto text-[9px] text-konjo-fg-faint tabular-nums">
            {entry.date}
          </span>
        </div>

        <p className="text-sm text-konjo-fg leading-snug">{entry.title}</p>

        {entry.detail && (
          <>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-konjo-mono mt-1 text-[10px] text-konjo-fg-faint hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent rounded"
              aria-expanded={expanded}
            >
              {expanded ? "▲ less" : "▼ more"}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.p
                  initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: ease.nehan }}
                  className="mt-1.5 text-xs text-konjo-fg-muted leading-relaxed"
                >
                  {entry.detail}
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Vertical timeline of recent commits / releases across the KonjoAI portfolio.
 * Expandable entries; "Show more" reveals the full log.
 */
export function ChangelogFeed() {
  const reduce = useReducedMotion();
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? ENTRIES : ENTRIES.slice(0, SHOW_INITIAL);

  return (
    <section
      id="changelog"
      aria-label="Portfolio changelog"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8 flex items-end justify-between gap-4 flex-wrap"
      >
        <div>
          <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
            sprint log · all nine products
          </p>
          <ScrambleText
            as="h2"
            text="Built in the open, shipped with grit"
            className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
            delay={120}
          />
          <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
            Every change passes typecheck, tests, and a konjo_review adversarial audit
            before merging. The log proves it.
          </p>
        </div>

        <a
          href="https://github.com/konjoai"
          target="_blank"
          rel="noreferrer"
          className="text-konjo-mono shrink-0 rounded-konjo border border-konjo-line/50 bg-konjo-surface/60 px-3 py-1.5 text-xs text-konjo-fg-faint transition-colors hover:border-konjo-brand/40 hover:text-konjo-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
        >
          github.com/konjoai ↗
        </a>
      </motion.div>

      <div className="glass-konjo rounded-konjo-xl px-5 py-5 sm:px-8 sm:py-6">
        <AnimatePresence initial={false}>
          {visible.map((entry, i) => (
            <EntryRow key={`${entry.date}-${entry.product}`} entry={entry} index={i} reduce={reduce} />
          ))}
        </AnimatePresence>

        {!showAll && ENTRIES.length > SHOW_INITIAL && (
          <motion.button
            type="button"
            onClick={() => setShowAll(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-konjo-mono mt-1 ml-6 text-xs text-konjo-fg-faint transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent rounded"
          >
            Show {ENTRIES.length - SHOW_INITIAL} more entries ↓
          </motion.button>
        )}
      </div>
    </section>
  );
}
