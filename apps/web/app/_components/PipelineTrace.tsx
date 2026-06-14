"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { ease } from "@konjoai/ui";
import { ScrambleText } from "./ScrambleText";

type TraceStage = {
  product: string;
  glyph: string;
  color: string;
  action: string;
  durationMs: number;
  output: string;
};

const STAGES: TraceStage[] = [
  {
    product: "squish",
    glyph: "◐",
    color: "var(--color-konjo-brand)",
    action: "Route & tokenize query",
    durationMs: 12,
    output: '84 tokens · MLX path selected · Metal backend',
  },
  {
    product: "kyro",
    glyph: "✸",
    color: "var(--color-konjo-accent)",
    action: "Hybrid retrieval — BM25 + dense",
    durationMs: 18,
    output: '5 chunks · confidence 0.94 · ColBERT rerank done',
  },
  {
    product: "kohaku",
    glyph: "❖",
    color: "var(--color-konjo-good)",
    action: "Inject episodic memory context",
    durationMs: 3,
    output: '3 memories · HDC recall 89% · half-life 4.2h',
  },
  {
    product: "squish",
    glyph: "◐",
    color: "var(--color-konjo-brand)",
    action: "Generate response — 42 tok/s",
    durationMs: 84,
    output: '"The attention mechanism enables transformers to…"',
  },
  {
    product: "vectro",
    glyph: "◇",
    color: "var(--color-konjo-violet)",
    action: "Compress output vectors",
    durationMs: 7,
    output: '768-dim → 192-dim · VQZ codec · fidelity 99.1%',
  },
];

const TOTAL_MS = STAGES.reduce((s, st) => s + st.durationMs, 0);
/** Cumulative delay before each stage starts (in animation-time seconds). */
const STAGE_DELAYS = STAGES.reduce<number[]>((acc, st, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + STAGES[i - 1].durationMs / 60);
  return acc;
}, []);

type StageState = "pending" | "running" | "done";

/** Single animated pipeline stage row. */
function StageRow({
  stage,
  state,
  delay,
  reduce,
}: {
  stage: TraceStage;
  state: StageState;
  delay: number;
  reduce: boolean | null;
}) {
  const isDone    = state === "done";
  const isRunning = state === "running";

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay, ease: ease.kanjo }}
      className="flex items-start gap-3 rounded-konjo px-3 py-2.5 transition-colors duration-200"
      style={{
        background: isRunning
          ? `color-mix(in oklch, ${stage.color} 8%, transparent)`
          : "transparent",
      }}
    >
      {/* Stage connector line + glyph */}
      <div className="relative flex flex-col items-center">
        <span
          className="text-konjo-mono z-10 text-base leading-none"
          style={{
            color: isDone || isRunning ? stage.color : "var(--color-konjo-fg-faint)",
          }}
          aria-hidden
        >
          {stage.glyph}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-konjo-mono text-[11px] font-semibold"
            style={{ color: isDone || isRunning ? stage.color : "var(--color-konjo-fg-faint)" }}
          >
            {stage.product}
          </span>
          <span className="text-xs text-konjo-fg-muted">{stage.action}</span>

          {/* Running spinner */}
          {isRunning && !reduce && (
            <motion.span
              className="text-konjo-mono text-[10px]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ color: stage.color }}
              aria-hidden
            >
              ···
            </motion.span>
          )}
        </div>

        {/* Output — appears when done */}
        <AnimatePresence>
          {isDone && (
            <motion.p
              initial={reduce ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.25, ease: ease.nehan }}
              className="text-konjo-mono mt-0.5 text-[10px] text-konjo-fg-faint"
            >
              {stage.output}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Timing badge */}
      <div className="shrink-0 text-right">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <motion.span
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint"
            >
              running
            </motion.span>
          ) : isDone ? (
            <motion.span
              key="done"
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: ease.kanjo }}
              className="text-konjo-mono text-[10px] tabular-nums"
              style={{ color: stage.color }}
            >
              {stage.durationMs} ms
            </motion.span>
          ) : (
            <motion.span
              key="pending"
              className="text-konjo-mono text-[10px] text-konjo-fg-faint/40"
            >
              — ms
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/** Animated request trace — shows a user query flowing through 5 KonjoAI products. */
export function PipelineTrace() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [states, setStates] = useState<StageState[]>(STAGES.map(() => "pending"));
  const [complete, setComplete] = useState(false);
  const runRef = useRef(0);

  const runTrace = useCallback(() => {
    const run = ++runRef.current;
    setStates(STAGES.map(() => "pending"));
    setComplete(false);

    if (reduce) {
      setStates(STAGES.map(() => "done"));
      setComplete(true);
      return;
    }

    STAGES.forEach((stage, i) => {
      const startMs = STAGE_DELAYS[i] * 1000 * 60;
      const endMs   = startMs + stage.durationMs * 16;
      setTimeout(() => {
        if (runRef.current !== run) return;
        setStates((prev) => prev.map((s, idx) => idx === i ? "running" : s));
      }, startMs);
      setTimeout(() => {
        if (runRef.current !== run) return;
        setStates((prev) => prev.map((s, idx) => idx === i ? "done" : s));
        if (i === STAGES.length - 1) setComplete(true);
      }, endMs);
    });
  }, [reduce]);

  useEffect(() => {
    if (!inView) return;
    runTrace();
  }, [inView, runTrace]);

  function handleReplay() {
    runTrace();
  }

  return (
    <section
      id="trace"
      ref={sectionRef}
      aria-label="Live request pipeline trace"
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
            composable infrastructure
          </p>
          <ScrambleText
            as="h2"
            text="One query. Five products. 124 ms."
            className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
            delay={120}
          />
          <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
            Products don't just run independently — they compose. Watch a single user
            query route through inference, retrieval, memory, generation, and compression.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReplay}
          aria-label="Replay the pipeline trace"
          className="text-konjo-mono shrink-0 flex items-center gap-1.5 rounded-konjo border border-konjo-line/50 bg-konjo-surface/60 px-3 py-1.5 text-xs text-konjo-fg-faint transition-colors hover:border-konjo-brand/40 hover:text-konjo-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
        >
          <span aria-hidden>↺</span> replay
        </button>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">
        {/* Trace panel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.08 }}
          className="glass-konjo rounded-konjo-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-konjo-line/40 bg-konjo-surface/50 px-4 py-3">
            <span
              className="text-konjo-mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest"
              style={{ color: "var(--color-konjo-good)" }}
            >
              <span
                className="konjo-pulse inline-block size-1.5 rounded-full"
                style={{ background: "var(--color-konjo-good)" }}
                aria-hidden
              />
              trace active
            </span>
            <span className="text-konjo-mono ml-auto text-[10px] text-konjo-fg-faint">
              query: "explain attention mechanism"
            </span>
          </div>

          {/* Stages */}
          <div className="divide-y divide-konjo-line/20 px-2 py-2" role="list" aria-label="Pipeline stages">
            {STAGES.map((stage, i) => (
              <div key={`${stage.product}-${i}`} role="listitem">
                <StageRow
                  stage={stage}
                  state={states[i]}
                  delay={STAGE_DELAYS[i]}
                  reduce={reduce}
                />
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-konjo-line/40 bg-konjo-surface/30 px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                total round-trip
              </span>
              <AnimatePresence mode="wait">
                {complete ? (
                  <motion.span
                    key="total"
                    initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, ease: ease.kanjo }}
                    className="text-konjo-mono text-sm font-semibold tabular-nums"
                    style={{ color: "var(--color-konjo-brand)" }}
                  >
                    {TOTAL_MS} ms
                  </motion.span>
                ) : (
                  <motion.span
                    key="waiting"
                    animate={reduce ? {} : { opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-konjo-mono text-sm text-konjo-fg-faint tabular-nums"
                  >
                    — ms
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Product summary cards */}
        <motion.ul
          role="list"
          className="flex flex-col gap-2 self-start"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: ease.kanjo, delay: 0.18 }}
        >
          {[
            { product: "squish",  glyph: "◐", color: "var(--color-konjo-brand)",  desc: "Local LLM inference — 42 tok/s"        },
            { product: "kyro",    glyph: "✸", color: "var(--color-konjo-accent)", desc: "Hybrid RAG — BM25 + dense + ColBERT"   },
            { product: "kohaku",  glyph: "❖", color: "var(--color-konjo-good)",   desc: "Episodic memory — HDC vectors"          },
            { product: "vectro",  glyph: "◇", color: "var(--color-konjo-violet)", desc: "Vector compression — VQZ · 4× ratio"   },
          ].map(({ product, glyph, color, desc }, i) => (
            <motion.li
              key={product}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.22 + i * 0.06, ease: ease.kanjo }}
              className="glass-konjo rounded-konjo flex items-center gap-3 px-3 py-2.5"
            >
              <span className="text-konjo-mono text-base" style={{ color }} aria-hidden>{glyph}</span>
              <div className="min-w-0">
                <a
                  href={`/products/${product}`}
                  className="text-konjo-mono text-[11px] font-medium text-konjo-fg hover:underline"
                  style={{ color }}
                >
                  {product}
                </a>
                <p className="text-[10px] text-konjo-fg-faint">{desc}</p>
              </div>
            </motion.li>
          ))}

          <li className="px-3 pt-2 text-konjo-mono text-[9px] uppercase tracking-[0.2em] text-konjo-fg-faint">
            + kairu · miru · toki · lopi · drex
          </li>
        </motion.ul>
      </div>
    </section>
  );
}
