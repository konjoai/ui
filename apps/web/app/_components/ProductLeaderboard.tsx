"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { ease, severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";
import Link from "next/link";
import { ScrambleText } from "./ScrambleText";

/** Normalized performance score 0-100 for each product, seeded from their headline metric. */
const BASE_SCORE: Record<string, number> = {
  squish:  88,
  kyro:    82,
  vectro:  91,
  kairu:   78,
  miru:    74,
  toki:    65,
  kohaku:  85,
  lopi:    79,
  drex:    62,
};

const SCORE_AMP: Record<string, number> = {
  squish:  3,
  kyro:    4,
  vectro:  3,
  kairu:   5,
  miru:    4,
  toki:    6,
  kohaku:  3,
  lopi:    4,
  drex:    5,
};

type RankedProduct = { slug: string; score: number };

function seedScores(): RankedProduct[] {
  return PRODUCTS.map((p) => ({ slug: p.slug, score: BASE_SCORE[p.slug] ?? 70 }))
    .sort((a, b) => b.score - a.score);
}

/** Single row — layout animation handles rank reordering. */
function LeaderRow({
  ranked,
  rank,
  prevRank,
  reduce,
}: {
  ranked: RankedProduct;
  rank: number;
  prevRank: number;
  reduce: boolean | null;
}) {
  const product = PRODUCTS.find((p) => p.slug === ranked.slug);
  if (!product) return null;
  const col = sevColor[product.metric.severity];
  const movement = prevRank - rank;

  return (
    <motion.div
      layout={!reduce}
      layoutId={ranked.slug}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: ease.kanjo }}
      className="group relative"
    >
      <Link
        href={`/products/${ranked.slug}`}
        className="flex items-center gap-3 rounded-konjo px-4 py-3 transition-colors hover:bg-konjo-surface/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
      >
        {/* Rank number */}
        <div className="w-7 shrink-0 text-right">
          <span className="text-konjo-mono text-sm font-semibold text-konjo-fg-faint">
            {String(rank).padStart(2, "0")}
          </span>
        </div>

        {/* Movement indicator */}
        <div className="w-4 shrink-0 text-center">
          {!reduce && movement !== 0 && (
            <motion.span
              key={`${ranked.slug}-${rank}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-konjo-mono text-[10px]"
              style={{
                color:
                  movement > 0
                    ? "var(--color-konjo-good)"
                    : "var(--color-konjo-warm)",
              }}
              aria-hidden
            >
              {movement > 0 ? "↑" : "↓"}
            </motion.span>
          )}
        </div>

        {/* Glyph + slug */}
        <div className="flex w-28 shrink-0 items-center gap-2">
          <span
            className="text-konjo-mono text-xl leading-none"
            style={{ color: col }}
            aria-hidden
          >
            {product.glyph}
          </span>
          <span className="text-konjo-mono text-xs font-semibold text-konjo-fg">
            {product.slug}
          </span>
        </div>

        {/* Score bar */}
        <div className="relative flex-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-konjo-surface/60">
            <motion.div
              className="h-full rounded-full"
              style={{ background: col }}
              animate={{ width: `${ranked.score}%` }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.55, ease: ease.kanjo }
              }
            />
          </div>
        </div>

        {/* Score value */}
        <div className="w-10 shrink-0 text-right">
          <motion.span
            className="text-konjo-mono text-xs font-semibold tabular-nums"
            style={{ color: col }}
            animate={{ opacity: 1 }}
          >
            {ranked.score}
          </motion.span>
        </div>
      </Link>

      {/* Rank 1 gets a subtle glow underline */}
      {rank === 1 && !reduce && (
        <div
          className="pointer-events-none absolute inset-x-4 -bottom-px h-px rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${col}, transparent)`,
            opacity: 0.5,
          }}
          aria-hidden
        />
      )}
    </motion.div>
  );
}

/**
 * Live product leaderboard — scores fluctuate every 2.2 s and products reorder
 * with motion layout animations so rank changes are immediately visible.
 */
export function ProductLeaderboard() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [ranked, setRanked] = useState<RankedProduct[]>(seedScores);
  const prevOrder = useRef<Map<string, number>>(new Map());

  // Store rank before update for movement indicators
  useEffect(() => {
    ranked.forEach(({ slug }, i) => prevOrder.current.set(slug, i + 1));
  }, [ranked]);

  // Jitter 2 random scores every 2.2 s and re-sort
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setRanked((prev) => {
        const next = prev.map(({ slug, score }) => {
          const amp = SCORE_AMP[slug] ?? 3;
          const jitter = Math.floor((Math.random() - 0.5) * amp * 2);
          const base = BASE_SCORE[slug] ?? 70;
          return { slug, score: Math.max(base - 8, Math.min(base + 8, score + jitter)) };
        });
        return [...next].sort((a, b) => b.score - a.score);
      });
    }, 2200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section
      id="leaderboard"
      ref={ref}
      aria-label="Product performance leaderboard"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8"
      >
        <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
          performance rank · 9 products · live
        </p>
        <ScrambleText
          as="h2"
          text="Live leaderboard"
          className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={150}
        />
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Composite performance score — ranks update live as metrics fluctuate. Click any row to explore.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.1 }}
        className="glass-konjo rounded-konjo-xl overflow-hidden"
      >
        {/* Header */}
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
          <span className="text-konjo-mono text-[10px] text-konjo-fg-faint">
            composite score · updates every 2 s
          </span>
        </div>

        {/* Rows */}
        <div
          className="divide-y divide-konjo-line/15 px-1 py-1"
          role="list"
          aria-label="Product rankings"
        >
          <AnimatePresence initial={false}>
            {ranked.map((r, i) => (
              <LeaderRow
                key={r.slug}
                ranked={r}
                rank={i + 1}
                prevRank={prevOrder.current.get(r.slug) ?? i + 1}
                reduce={reduce}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
