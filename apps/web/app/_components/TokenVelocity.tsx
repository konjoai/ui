"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, animate, AnimatePresence } from "motion/react";
import { ease, severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";
import Link from "next/link";

/** Deterministic base throughput per product (tokens per second). */
const BASE_TPS: Record<string, number> = {
  squish:  42,
  kyro:    18,
  vectro:  67,
  kairu:   38,
  miru:    29,
  toki:    12,
  kohaku:  24,
  lopi:    33,
  drex:    51,
};

const AMP: Record<string, number> = {
  squish:  4,
  kyro:    3,
  vectro:  6,
  kairu:   5,
  miru:    4,
  toki:    2,
  kohaku:  3,
  lopi:    4,
  drex:    5,
};

type Tps = Record<string, number>;

function seedTps(): Tps {
  return Object.fromEntries(
    PRODUCTS.map((p) => [p.slug, BASE_TPS[p.slug] ?? 20]),
  );
}

function nudge(slug: string): number {
  const base = BASE_TPS[slug] ?? 20;
  const amp = AMP[slug] ?? 3;
  return Math.max(1, Math.round(base + (Math.random() - 0.5) * amp * 2));
}

/** Single digit morphs up or down with a vertical flip. */
function FlipDigit({ char, reduce }: { char: string; reduce: boolean | null }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={char}
        initial={reduce ? { opacity: 0 } : { y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 14, opacity: 0 }}
        transition={{ duration: 0.2, ease: ease.nehan }}
        className="inline-block tabular-nums"
      >
        {char}
      </motion.span>
    </AnimatePresence>
  );
}

/** Renders a number as individually-animated digit characters. */
function FlipNumber({
  value,
  reduce,
}: {
  value: number;
  reduce: boolean | null;
}) {
  const str = String(value).padStart(2, " ");
  return (
    <span className="inline-flex" aria-label={String(value)}>
      {str.split("").map((ch, i) => (
        <FlipDigit key={i} char={ch} reduce={reduce} />
      ))}
    </span>
  );
}

/** Single product velocity card. */
function VelocityCard({
  slug,
  tps,
  index,
  inView,
  reduce,
}: {
  slug: string;
  tps: number;
  index: number;
  inView: boolean;
  reduce: boolean | null;
}) {
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  const col = sevColor[product.metric.severity];
  const prevTps = useRef(tps);
  const trend = tps > prevTps.current ? "up" : tps < prevTps.current ? "down" : "flat";
  useEffect(() => { prevTps.current = tps; });

  const trendGlyph = trend === "up" ? "↑" : trend === "down" ? "↓" : "";
  const trendCol =
    trend === "up"
      ? "var(--color-konjo-good)"
      : trend === "down"
        ? "var(--color-konjo-warm)"
        : "transparent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        ease: ease.kanjo,
        delay: inView ? index * 0.045 : 0,
      }}
    >
      <Link
        href={`/products/${slug}`}
        className="group glass-konjo rounded-konjo-lg block p-4 transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
        style={{
          ["--hover-col" as string]: col,
        }}
      >
        {/* Glyph + slug */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-konjo-mono text-xl leading-none"
              style={{ color: col }}
              aria-hidden
            >
              {product.glyph}
            </span>
            <span className="text-konjo-mono text-[11px] text-konjo-fg-muted">
              {slug}
            </span>
          </div>
          {trendGlyph && !reduce && (
            <motion.span
              key={trend + tps}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              className="text-konjo-mono text-xs"
              style={{ color: trendCol }}
              aria-hidden
            >
              {trendGlyph}
            </motion.span>
          )}
        </div>

        {/* Big TPS number */}
        <div
          className="text-konjo-display text-4xl font-semibold leading-none tabular-nums"
          style={{ color: col }}
        >
          <FlipNumber value={tps} reduce={reduce} />
        </div>
        <div className="text-konjo-mono mt-1.5 text-[10px] text-konjo-fg-faint uppercase tracking-widest">
          tok/s live
        </div>

        {/* Mini bar: tps vs max */}
        <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-konjo-surface/60">
          <motion.div
            className="h-full rounded-full"
            style={{ background: col }}
            animate={{ width: `${Math.min(100, (tps / 80) * 100)}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.4, ease: ease.kanjo }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * Live token velocity grid — nine cards each showing live tok/s with
 * per-digit flip animation. Values jitter every 1.8 s to convey streaming telemetry.
 */
export function TokenVelocity() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [tps, setTps] = useState<Tps>(seedTps);

  // Animate the total counter
  const [total, setTotal] = useState(0);
  const totalTps = Object.values(tps).reduce((s, v) => s + v, 0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(0, totalTps, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setTotal(Math.round(v)),
    });
    return () => ctrl.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    setTotal(totalTps);
  }, [totalTps]);

  // Jitter 2 random products every 1.8 s
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setTps((prev) => {
        const slugs = Object.keys(prev);
        const next = { ...prev };
        for (let k = 0; k < 2; k++) {
          const s = slugs[Math.floor(Math.random() * slugs.length)];
          next[s] = nudge(s);
        }
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <section
      id="velocity"
      ref={ref}
      aria-label="Live token velocity"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
            token velocity · 9 channels · real-time
          </p>
          <h2 className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Live throughput
          </h2>
          <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
            Per-product token velocity — digits flip as each sample arrives.
          </p>
        </div>
        {/* Aggregate counter */}
        <div className="shrink-0 text-right">
          <div
            className="text-konjo-display text-5xl font-semibold tabular-nums"
            style={{ color: "var(--color-konjo-brand)" }}
            aria-live="polite"
            aria-label={`${total} total tokens per second`}
          >
            {total}
          </div>
          <div className="text-konjo-mono mt-1 text-[11px] uppercase tracking-widest text-konjo-fg-faint">
            tok/s combined
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <VelocityCard
            key={p.slug}
            slug={p.slug}
            tps={tps[p.slug] ?? BASE_TPS[p.slug] ?? 20}
            index={i}
            inView={inView}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  );
}
