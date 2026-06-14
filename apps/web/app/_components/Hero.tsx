"use client";

import { motion, animate, useInView, useReducedMotion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { ease } from "@konjoai/ui";

type Stat = { display: string; label: string; color: string; countTo?: number };

const STATS: Stat[] = [
  { display: "14",   countTo: 14, label: "components", color: "text-konjo-accent" },
  { display: "9",    countTo: 9,  label: "products",   color: "text-konjo-violet" },
  { display: "79",   countTo: 79, label: "tests",      color: "text-konjo-good"   },
  { display: "v0.2",              label: "current",    color: "text-konjo-warm"   },
];

/** Positions, durations, and delays are fixed so SSR and client agree. */
const GLYPH_CONFIG = [
  { glyph: "◐", x: "6%",  top: "22%", dur: 3.8, delay: 0.0  },
  { glyph: "◇", x: "89%", top: "14%", dur: 4.5, delay: 0.5  },
  { glyph: "✸", x: "77%", top: "68%", dur: 4.2, delay: 0.9  },
  { glyph: "▲", x: "12%", top: "74%", dur: 3.6, delay: 1.4  },
  { glyph: "⬡", x: "48%", top: "88%", dur: 5.0, delay: 0.3  },
  { glyph: "◈", x: "93%", top: "44%", dur: 4.0, delay: 1.0  },
] as const;

/** Softly breathing product glyphs — constellation backdrop for the hero. */
function FloatingGlyphs() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {GLYPH_CONFIG.map(({ glyph, x, top, dur, delay }) => (
        <motion.span
          key={glyph}
          className="absolute text-2xl sm:text-3xl"
          style={{ left: x, top, color: "var(--color-konjo-violet)" }}
          initial={{ opacity: 0 }}
          animate={{ y: [0, -14, 0], opacity: [0.07, 0.16, 0.07] }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {glyph}
        </motion.span>
      ))}
    </div>
  );
}

/** Counts from 0 to `stat.countTo` once the element enters the viewport. */
function AnimatedStat({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(stat.countTo !== undefined ? "0" : stat.display);

  useEffect(() => {
    if (!inView || stat.countTo === undefined) return;
    const controls = animate(0, stat.countTo, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, stat.countTo]);

  return (
    <div className="flex items-baseline gap-1">
      <span ref={ref} className={`font-semibold tabular-nums ${stat.color}`}>
        {display}
      </span>
      <span className="text-konjo-fg-faint">{stat.label}</span>
    </div>
  );
}

/** Homepage hero — animated headline, count-up stats, floating glyph constellation. */
export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 pb-20 text-center sm:pt-36 sm:pb-28">
      <FloatingGlyphs />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.kanjo }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-konjo-line bg-konjo-surface/60 px-4 py-1.5 text-xs text-konjo-fg-muted backdrop-blur"
      >
        <span
          className="konjo-pulse inline-block size-1.5 rounded-full"
          style={{ background: "var(--color-konjo-brand)" }}
          aria-hidden
        />
        <span className="text-konjo-mono">v0.2 · Sprint 0.5 of the Konjo UI Initiative</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.kanjo, delay: 0.05 }}
        className="text-konjo-display text-konjo-gradient-flow text-6xl font-semibold tracking-tight sm:text-8xl"
      >
        KonjoAI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.kanjo, delay: 0.15 }}
        className="mt-6 max-w-2xl text-balance text-lg text-konjo-fg-muted sm:text-xl"
      >
        High-performance AI infrastructure, built in the{" "}
        <span className="text-konjo-fg">Konjo</span> way.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-konjo-mono mt-4 text-xs text-konjo-fg-faint"
      >
        ቆንጆ beauty · 根性 fighting spirit · 康宙 system health · 건조 strip to essence
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.4 }}
        className="mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href="#projects"
          className="shadow-konjo-brand rounded-konjo-lg px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
          style={{ background: "var(--color-konjo-brand)" }}
        >
          Explore the constellation
        </a>
        <a
          href="https://github.com/konjoai"
          target="_blank"
          rel="noreferrer"
          className="rounded-konjo-lg border border-konjo-line bg-konjo-surface/60 px-6 py-3 text-sm font-medium text-konjo-fg backdrop-blur transition-colors hover:border-konjo-line/0 hover:bg-konjo-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
        >
          GitHub →
        </a>
      </motion.div>

      <motion.dl
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="text-konjo-mono mt-10 flex flex-wrap items-center justify-center gap-6 text-xs"
        aria-label="Design system stats"
      >
        {STATS.map((s) => (
          <AnimatedStat key={s.label} stat={s} />
        ))}
      </motion.dl>
    </section>
  );
}
