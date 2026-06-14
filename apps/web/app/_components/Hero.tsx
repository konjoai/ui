"use client";

import { motion } from "motion/react";
import { ease } from "@konjoai/ui";

const STATS = [
  { value: "14", label: "components", color: "text-konjo-accent" },
  { value: "9",  label: "products",   color: "text-konjo-violet" },
  { value: "79", label: "tests",      color: "text-konjo-good"   },
  { value: "v0.2", label: "current",  color: "text-konjo-warm"   },
] as const;

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pt-28 pb-20 text-center sm:pt-36 sm:pb-28">
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
        className="text-konjo-display text-konjo-gradient text-6xl font-semibold tracking-tight sm:text-8xl"
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
        {STATS.map((s, i) => (
          <div key={i} className="flex items-baseline gap-1">
            <span className={`font-semibold tabular-nums ${s.color}`}>{s.value}</span>
            <span className="text-konjo-fg-faint">{s.label}</span>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
