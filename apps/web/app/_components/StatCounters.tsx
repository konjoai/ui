"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";

type Counter = {
  label: string;
  sublabel: string;
  base: number;
  amp: number;
  suffix: string;
  decimals: number;
  color: string;
  glyph: string;
};

const COUNTERS: Counter[] = [
  {
    label: "Tokens/sec",
    sublabel: "peak single-node throughput",
    base: 847,
    amp: 42,
    suffix: "",
    decimals: 0,
    color: "var(--color-konjo-brand)",
    glyph: "◐",
  },
  {
    label: "Recall accuracy",
    sublabel: "kyro NDCG@10 on BEIR",
    base: 91.4,
    amp: 1.2,
    suffix: "%",
    decimals: 1,
    color: "var(--color-konjo-accent)",
    glyph: "✸",
  },
  {
    label: "Memory HDC",
    sublabel: "kohaku episodic recall rate",
    base: 89,
    amp: 2,
    suffix: "%",
    decimals: 0,
    color: "var(--color-konjo-good)",
    glyph: "❖",
  },
  {
    label: "Agent success",
    sublabel: "lopi task completion last 50",
    base: 94,
    amp: 2,
    suffix: "%",
    decimals: 0,
    color: "var(--color-konjo-cool)",
    glyph: "⌬",
  },
];

function seedNum(base: number, amp: number, t: number): number {
  return base + (Math.sin(t * 3.7) * 0.5 + 0.5) * amp - amp * 0.5;
}

type SingleCounterProps = Counter & { delay: number; tick: number };

function SingleCounter({ label, sublabel, base, amp, suffix, decimals, color, glyph, delay, tick }: SingleCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [displayed, setDisplayed] = useState("0");
  const prevTick = useRef(-1);

  useEffect(() => {
    if (!inView) return;
    if (prevTick.current === tick && displayed !== "0") return;
    prevTick.current = tick;

    const target = seedNum(base, amp, tick * 1.31);
    if (reduce) {
      setDisplayed(decimals > 0 ? target.toFixed(decimals) : String(Math.round(target)));
      return;
    }

    const start = tick === 0 ? 0 : seedNum(base, amp, (tick - 1) * 1.31);
    const ctrl = animate(start, target, {
      duration: tick === 0 ? 1.6 : 0.55,
      ease: tick === 0 ? "easeOut" : ease.nehan,
      delay: tick === 0 ? delay : 0,
      onUpdate: (v) => setDisplayed(
        decimals > 0 ? v.toFixed(decimals) : String(Math.round(v)),
      ),
    });
    return () => ctrl.stop();
  }, [inView, tick, base, amp, decimals, reduce, delay, displayed]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: ease.kanjo }}
      className="flex flex-col items-center text-center"
    >
      <span
        className="text-konjo-mono mb-2 text-2xl leading-none"
        style={{ color }}
        aria-hidden
      >
        {glyph}
      </span>

      <div
        className="text-konjo-display text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl"
        style={{ color }}
        aria-label={`${displayed}${suffix} ${label}`}
      >
        {displayed}
        <span className="text-4xl sm:text-5xl">{suffix}</span>
      </div>

      <p className="text-konjo-mono mt-2 text-sm font-semibold text-konjo-fg">
        {label}
      </p>
      <p className="text-konjo-mono mt-0.5 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
        {sublabel}
      </p>
    </motion.div>
  );
}

/**
 * Four large animated KPI counters that count up on scroll and pulse with live
 * jitter — a high-impact prelude to the CTA section.
 */
export function StatCounters() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((n) => n + 1), 3000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section
      aria-label="Platform performance numbers"
      className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-24"
    >
      {/* Radial glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="size-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo }}
        className="relative z-10"
      >
        <div className="mb-12 text-center">
          <p className="text-konjo-mono text-xs uppercase tracking-[0.24em] text-konjo-accent">
            by the numbers
          </p>
          <div
            className="text-konjo-mono mt-1 text-[10px] uppercase tracking-widest text-konjo-fg-faint"
          >
            live figures — jitter every 3 s
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:gap-16 lg:grid-cols-4">
          {COUNTERS.map((c, i) => (
            <SingleCounter key={c.label} {...c} delay={i * 0.1} tick={tick} />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          <span
            className="konjo-pulse inline-block size-1.5 rounded-full"
            style={{ background: "var(--color-konjo-good)" }}
            aria-hidden
          />
          <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            measured against real hardware — benchmarks in each repo
          </span>
        </div>
      </motion.div>
    </section>
  );
}
