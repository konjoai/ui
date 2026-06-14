"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { StatusBadge, FeatureCard, ProductHero } from "@konjoai/ui";
import type { StatusLevel } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

const STATUS_LEVELS: StatusLevel[] = [
  "operational",
  "degraded",
  "outage",
  "research",
  "checking",
];

const FEATURE_CARDS = [
  {
    glyph: "✶",
    title: "Hybrid retrieval",
    description:
      "BM25 + dense fusion with HyDE expansion and ColBERT reranking — measured against RAGAS end-to-end.",
    eyebrow: "kyro",
  },
  {
    glyph: "◈",
    title: "Production-grade",
    description:
      "OTel + Prometheus, distributed Redis cache, Helm charts, multi-tenant by default.",
    eyebrow: "kyro",
  },
  {
    glyph: "⌘",
    title: "MCP server included",
    description:
      "Drop kyro into Claude Code or any MCP host as a first-class retrieval primitive.",
    eyebrow: "kyro",
  },
] as const;

const CYCLE_MS = 3200;

/**
 * Showcase for shell & layout primitives: StatusBadge (all levels),
 * FeatureCard grid, and a ProductHero preview that cycles all nine products.
 */
export function ShellSection() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % PRODUCTS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const product = PRODUCTS[idx];

  return (
    <div className="flex flex-col gap-10">
      {/* StatusBadge */}
      <div>
        <p className="text-konjo-mono mb-4 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          StatusBadge · all five health levels
        </p>
        <div className="flex flex-wrap gap-3" role="list" aria-label="Status badge examples">
          {STATUS_LEVELS.map((level) => (
            <div key={level} role="listitem">
              <StatusBadge level={level} />
            </div>
          ))}
        </div>
      </div>

      {/* FeatureCard */}
      <div>
        <p className="text-konjo-mono mb-4 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          FeatureCard · feature tile grid
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURE_CARDS.map((f) => (
            <FeatureCard
              key={f.title}
              glyph={f.glyph}
              title={f.title}
              description={f.description}
              eyebrow={f.eyebrow}
            />
          ))}
        </div>
      </div>

      {/* ProductHero cycling preview */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            ProductHero · cycling all 9 products
          </p>
          <div className="flex gap-1" aria-label="Product indicator">
            {PRODUCTS.map((_, i) => (
              <button
                key={i}
                aria-label={`Show product ${i + 1}`}
                onClick={() => setIdx(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === idx ? "20px" : "6px",
                  background: i === idx
                    ? "var(--color-konjo-brand)"
                    : "var(--color-konjo-line)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-konjo-xl border border-konjo-line">
          <div className="aurora-konjo-bg" aria-hidden />
          <AnimatePresence mode="wait">
            <motion.div
              key={product.slug}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              <ProductHero
                name={product.name}
                tagline={product.tagline}
                glyph={product.glyph}
                eyebrow={product.eyebrow}
                version={product.version}
                status={<StatusBadge level={product.status} />}
                actions={
                  <a
                    href={product.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-konjo-mono rounded-konjo border border-konjo-line bg-konjo-surface-2/60 px-4 py-2 text-sm text-konjo-fg transition-colors hover:bg-konjo-surface-2"
                  >
                    github.com/konjoai/{product.slug} ↗
                  </a>
                }
                className="pt-10 pb-8 sm:pt-12"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
