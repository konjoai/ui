"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { ScrambleText } from "./ScrambleText";

type TaskStatus = "pending" | "running" | "done";
type Phase = "idle" | "planning" | "parallel" | "composing" | "generating" | "done";

type SubTask = {
  id: string;
  product: string;
  glyph: string;
  color: string;
  action: string;
  detail: string;
  durationMs: number;
};

const INPUT_TASK =
  "Build an enhanced RAG pipeline: retrieve context, compress vectors, recall memory, stream response.";

const PARALLEL: SubTask[] = [
  {
    id: "kyro",
    product: "kyro",
    glyph: "✸",
    color: "var(--color-konjo-accent)",
    action: "Hybrid retrieval",
    detail: "BM25 + dense · ColBERT rerank · 5 chunks · NDCG 0.94",
    durationMs: 370,
  },
  {
    id: "vectro",
    product: "vectro",
    glyph: "◇",
    color: "var(--color-konjo-violet)",
    action: "Compress vectors",
    detail: "768-dim → 192-dim · VQZ codec · 4× compression · fidelity 99.1%",
    durationMs: 260,
  },
  {
    id: "kohaku",
    product: "kohaku",
    glyph: "❖",
    color: "var(--color-konjo-good)",
    action: "Episodic recall",
    detail: "3 memories · HDC 89% recall rate · half-life 4.2 h",
    durationMs: 190,
  },
];

const SEQUENTIAL: SubTask = {
  id: "squish",
  product: "squish",
  glyph: "◐",
  color: "var(--color-konjo-brand)",
  action: "Stream generation",
  detail: "42 tok/s · MLX Metal backend · OpenAI-compatible SSE",
  durationMs: 540,
};

const OUTPUT_LINES = [
  "Context assembled: 5 chunks · 192-dim vectors · 3 episodic memories",
  'Streaming: "A production RAG pipeline should start with hybrid…"',
  "Complete · 184 tokens · 42 tok/s · round-trip 1.24 s",
];

const STAGGER = 100;
const T_PLAN = 700;
const T_STARTS = PARALLEL.map((_, i) => T_PLAN + i * STAGGER);
const T_ENDS = PARALLEL.map((t, i) => T_STARTS[i] + t.durationMs);
const T_ALL_DONE = Math.max(...T_ENDS);
const T_COMPOSE = T_ALL_DONE + 240;
const T_GEN = T_COMPOSE + 320;
const T_GEN_END = T_GEN + SEQUENTIAL.durationMs;
const T_LINES = OUTPUT_LINES.map((_, i) => T_GEN_END + 120 + i * 220);
const T_DONE = T_LINES[T_LINES.length - 1] + 280;

function StatusDot({ status, color }: { status: TaskStatus; color: string }) {
  if (status === "pending")
    return <span className="inline-block size-1.5 rounded-full bg-konjo-line/40" aria-hidden />;
  if (status === "running")
    return (
      <span
        className="konjo-pulse inline-block size-1.5 rounded-full"
        style={{ background: color }}
        aria-hidden
      />
    );
  return (
    <motion.span
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="inline-block size-1.5 rounded-full"
      style={{ background: color }}
      aria-hidden
    />
  );
}

function TaskCard({
  task,
  status,
  reduce,
  animDelay,
}: {
  task: SubTask;
  status: TaskStatus;
  reduce: boolean | null;
  animDelay: number;
}) {
  const active = status !== "pending";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: ease.kanjo, delay: animDelay }}
      className="glass-konjo rounded-konjo-lg flex flex-col gap-2.5 p-3.5"
      style={
        active
          ? { borderColor: `color-mix(in oklch, ${task.color} 30%, transparent)` }
          : undefined
      }
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-0.5 shrink-0 text-xl leading-none"
          style={{ color: task.color }}
          aria-hidden
        >
          {task.glyph}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span
              className="text-konjo-mono text-[9px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: task.color }}
            >
              {task.product}
            </span>
            <StatusDot status={status} color={task.color} />
          </div>
          <p className="text-konjo-mono mt-0.5 text-[11px] font-medium text-konjo-fg">
            {task.action}
          </p>
        </div>
      </div>

      <div className="h-0.5 overflow-hidden rounded-full bg-konjo-surface/60">
        <motion.div
          className="h-full origin-left rounded-full"
          style={{ background: task.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: status === "pending" ? 0 : 1 }}
          transition={
            status === "running"
              ? { duration: reduce ? 0 : task.durationMs / 1000, ease: "linear" }
              : { duration: reduce ? 0 : 0.18, ease: ease.kanjo }
          }
        />
      </div>

      <AnimatePresence>
        {status === "done" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: ease.nehan }}
            className="text-konjo-mono text-[9px] leading-relaxed text-konjo-fg-faint"
          >
            {task.detail}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FlowConnector({ label, visible }: { label: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="flex flex-col items-center gap-1 py-2"
          aria-hidden
        >
          <div className="h-4 w-px bg-konjo-line/40" />
          <span className="text-konjo-mono rounded-full border border-konjo-line/30 bg-konjo-surface/40 px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-konjo-fg-faint">
            {label}
          </span>
          <div className="h-4 w-px bg-konjo-line/40" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Animated lopi agent orchestration demo — shows a task decomposed into parallel
 * sub-agents (kyro, vectro, kohaku) then composed for sequential generation (squish).
 * Auto-plays when scrolled into view; replay button on completion.
 */
export function AgentFlow() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>({});
  const [lines, setLines] = useState<string[]>([]);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const runRef = useRef(0);
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => { timerIds.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const startRun = useCallback(() => {
    timerIds.current.forEach(clearTimeout);
    timerIds.current = [];
    const run = ++runRef.current;

    function at(ms: number, fn: () => void) {
      const id = setTimeout(() => {
        if (runRef.current !== run) return;
        fn();
      }, reduce ? 0 : ms);
      timerIds.current.push(id);
    }

    setPhase("planning");
    setStatuses({});
    setLines([]);

    if (reduce) {
      setPhase("done");
      setStatuses({ kyro: "done", vectro: "done", kohaku: "done", squish: "done" });
      setLines(OUTPUT_LINES);
      return;
    }

    PARALLEL.forEach((task, i) => {
      at(T_STARTS[i], () => {
        setPhase("parallel");
        setStatuses((prev) => ({ ...prev, [task.id]: "running" }));
      });
      at(T_ENDS[i], () =>
        setStatuses((prev) => ({ ...prev, [task.id]: "done" })),
      );
    });

    at(T_COMPOSE, () => setPhase("composing"));
    at(T_GEN, () => {
      setPhase("generating");
      setStatuses((prev) => ({ ...prev, squish: "running" }));
    });
    at(T_GEN_END, () =>
      setStatuses((prev) => ({ ...prev, squish: "done" })),
    );

    OUTPUT_LINES.forEach((_, i) => {
      at(T_LINES[i], () =>
        setLines((prev) => [...prev, OUTPUT_LINES[i]]),
      );
    });

    at(T_DONE, () => setPhase("done"));
  }, [reduce]);

  useEffect(() => {
    if (inView && phase === "idle") startRun();
  }, [inView, phase, startRun]);

  const status = (id: string): TaskStatus => statuses[id] ?? "pending";
  const showPlan = phase !== "idle" && phase !== "planning";
  const showCompose = phase === "composing" || phase === "generating" || phase === "done";
  const showGen = phase === "generating" || phase === "done";

  const headerColor =
    phase === "planning"
      ? "var(--color-konjo-warm)"
      : phase === "done"
      ? "var(--color-konjo-good)"
      : "var(--color-konjo-brand)";

  const headerLabel =
    phase === "idle"
      ? "standby"
      : phase === "planning"
      ? "analyzing…"
      : phase === "composing"
      ? "composing…"
      : phase === "done"
      ? "complete"
      : "running";

  return (
    <section
      id="agents"
      ref={sectionRef}
      aria-label="lopi agent orchestration demo"
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
            lopi · agent orchestrator · parallel dispatch
          </p>
          <ScrambleText
            as="h2"
            text="One task. Four products."
            className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
            delay={140}
          />
          <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
            lopi decomposes the task and fans out to kyro, vectro, and kohaku in
            parallel — then routes the assembled context to squish for streaming
            generation. Zero coordination overhead.
          </p>
        </div>

        {phase === "done" && (
          <button
            type="button"
            onClick={startRun}
            className="text-konjo-mono flex shrink-0 items-center gap-1.5 rounded-konjo border border-konjo-line/50 bg-konjo-surface/60 px-3 py-1.5 text-xs text-konjo-fg-faint transition-colors hover:border-konjo-brand/40 hover:text-konjo-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
          >
            <span aria-hidden>↺</span> replay
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.08 }}
        className="glass-konjo overflow-hidden rounded-konjo-xl"
      >
        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-konjo-line/40 bg-konjo-surface/50 px-4 py-3">
          <span
            className={`inline-block size-1.5 rounded-full ${phase !== "done" ? "konjo-pulse" : ""}`}
            style={{ background: headerColor }}
            aria-hidden
          />
          <span
            className="text-konjo-mono text-[10px] uppercase tracking-widest"
            style={{ color: headerColor }}
          >
            lopi · {headerLabel}
          </span>
          <span className="text-konjo-mono ml-auto text-[10px] text-konjo-fg-faint">
            ⌬ agent orchestrator
          </span>
        </div>

        <div className="flex flex-col px-4 py-5 sm:px-6">
          {/* Input task */}
          <div className="rounded-konjo border border-konjo-line/40 bg-konjo-surface/30 px-4 py-3">
            <p className="text-konjo-mono mb-1.5 text-[9px] uppercase tracking-widest text-konjo-fg-faint">
              task input
            </p>
            <p className="text-konjo-mono text-xs leading-relaxed text-konjo-fg">
              {INPUT_TASK}
            </p>
            {phase === "planning" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                className="text-konjo-mono mt-2 text-[9px] uppercase tracking-wider text-konjo-warm"
              >
                ↺ lopi planning decomposition…
              </motion.p>
            )}
          </div>

          <FlowConnector label="parallel dispatch" visible={showPlan} />

          <AnimatePresence>
            {showPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {PARALLEL.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    status={status(task.id)}
                    reduce={reduce}
                    animDelay={i * 0.07}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <FlowConnector label="context assembled" visible={showCompose} />

          <AnimatePresence>
            {showGen && (
              <TaskCard
                task={SEQUENTIAL}
                status={status("squish")}
                reduce={reduce}
                animDelay={0}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {lines.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: ease.kanjo }}
                className="mt-3 flex flex-col gap-1.5 rounded-konjo border border-konjo-line/30 bg-konjo-surface/20 px-4 py-3"
              >
                <p className="text-konjo-mono mb-0.5 text-[9px] uppercase tracking-widest text-konjo-good">
                  ✓ output
                </p>
                {lines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, ease: ease.nehan }}
                    className="text-konjo-mono text-[10px] leading-relaxed text-konjo-fg-faint"
                  >
                    {line}
                  </motion.p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer legend */}
        <div className="flex flex-wrap gap-3 border-t border-konjo-line/30 bg-konjo-surface/30 px-4 py-2">
          {[...PARALLEL, SEQUENTIAL].map((t) => (
            <span
              key={t.id}
              className="text-konjo-mono flex items-center gap-1 text-[9px] uppercase tracking-widest"
              style={{ color: t.color }}
            >
              <span aria-hidden>{t.glyph}</span> {t.product}
            </span>
          ))}
          <span className="text-konjo-mono ml-auto text-[9px] text-konjo-fg-faint">
            simulated · real latencies shown
          </span>
        </div>
      </motion.div>
    </section>
  );
}
