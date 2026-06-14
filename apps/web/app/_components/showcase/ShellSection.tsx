"use client";

import { StatusBadge, FeatureCard, ProductHero } from "@konjoai/ui";
import type { StatusLevel } from "@konjoai/ui";

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

/**
 * Showcase for shell & layout primitives: StatusBadge (all levels),
 * FeatureCard grid, and ProductHero preview.
 */
export function ShellSection() {
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

      {/* ProductHero preview */}
      <div>
        <p className="text-konjo-mono mb-4 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          ProductHero · product page header
        </p>
        <div className="relative overflow-hidden rounded-konjo-xl border border-konjo-line">
          {/* Aurora bg for the preview */}
          <div className="aurora-konjo-bg" aria-hidden />
          <ProductHero
            name="kyro"
            tagline="Production RAG with hybrid retrieval, ColBERT reranking, and end-to-end RAGAS evals."
            glyph="✸"
            eyebrow="Sprint 5 · RAG Observatory"
            version="v1.2.0"
            status={<StatusBadge level="operational" />}
            actions={
              <a
                href="https://github.com/konjoai/kyro"
                target="_blank"
                rel="noreferrer"
                className="text-konjo-mono rounded-konjo border border-konjo-line bg-konjo-surface-2/60 px-4 py-2 text-sm text-konjo-fg transition-colors hover:bg-konjo-surface-2"
              >
                github.com/konjoai/kyro ↗
              </a>
            }
            className="pt-10 pb-8 sm:pt-12"
          />
        </div>
      </div>
    </div>
  );
}
