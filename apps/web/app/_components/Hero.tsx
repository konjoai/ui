"use client";

import { motion, animate, useInView, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "motion/react";
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

/** Homepage hero — animated headline, count-up stats, floating glyph constellation, cursor glow. */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(-600);
  const mouseY = useMotionValue(-600);
  const glowX = useSpring(mouseX, { stiffness: 70, damping: 18 });
  const glowY = useSpring(mouseY, { stiffness: 70, damping: 18 });

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    mouseX.set(-600);
    mouseY.set(-600);
  }

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 pb-20 text-center sm:pt-36 sm:pb-28"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient cursor glow */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            x: glowX,
            y: glowY,
            width: 520,
            height: 520,
            background:
              "radial-gradient(circle, rgba(124,58,237,0.13) 0%, rgba(167,139,250,0.05) 45%, transparent 70%)",
          }}
        />
      )}

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

      <ScrollHint />
    </section>
  );
}

/** Bouncing down-arrow that fades out once the user starts scrolling. */
function ScrollHint() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handler = () => setVisible(window.scrollY < 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-hint"
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -4 }}
          animate={
            reduce
              ? { opacity: 0.35 }
              : { opacity: [0.25, 0.6, 0.25], y: [0, 7, 0] }
          }
          exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
          transition={reduce ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <span className="text-konjo-fg-faint text-lg select-none">↓</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
