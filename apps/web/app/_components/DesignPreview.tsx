"use client";

import { motion } from "motion/react";
import { ease } from "@konjoai/ui";
import { StreamSection }     from "./showcase/StreamSection";
import { MetricsSection }    from "./showcase/MetricsSection";
import { ComplianceSection } from "./showcase/ComplianceSection";
import { RankingsSection }   from "./showcase/RankingsSection";

type Block = {
  id: string;
  title: string;
  description: string;
  tag: string;
  live: boolean;
  Section: React.ComponentType;
};

const BLOCKS: Block[] = [
  {
    id: "stream",
    title: "Intelligence Stream",
    description: "Live RAG pipeline and attention-weighted token generation.",
    tag: "miru · kyro · squish",
    live: true,
    Section: StreamSection,
  },
  {
    id: "metrics",
    title: "Live Metrics",
    description: "Headline KPIs with animated gauges and delta indicators.",
    tag: "kairu · squish · vectro · kyro",
    live: true,
    Section: MetricsSection,
  },
  {
    id: "compliance",
    title: "Compliance Monitor",
    description: "EU AI Act article grid, concentric risk arcs, score vs. threshold.",
    tag: "squash",
    live: false,
    Section: ComplianceSection,
  },
  {
    id: "rankings",
    title: "Rankings & Charts",
    description: "Live throughput sparklines and scored result rankings.",
    tag: "kyro · toki · miru",
    live: true,
    Section: RankingsSection,
  },
];

export function DesignPreview() {
  return (
    <section
      aria-label="Design system showcase"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo }}
        className="mb-14"
      >
        <div className="flex items-center gap-3 mb-3">
          <p className="text-konjo-mono text-xs uppercase tracking-[0.24em] text-konjo-accent">
            @konjoai/ui · 14 components
          </p>
          <span
            className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-good/30 bg-konjo-good/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-konjo-good"
            aria-label="Live data"
          >
            <span className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good" aria-hidden />
            Live
          </span>
        </div>
        <h2 className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Live design system
        </h2>
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Every primitive, alive. The shared visual language powering eight KonjoAI products.
        </p>
      </motion.div>

      <div className="flex flex-col gap-10">
        {BLOCKS.map(({ id, title, description, tag, live, Section }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: ease.kanjo, delay: i * 0.05 }}
          >
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-konjo-display text-xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  {live && (
                    <span
                      className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-accent"
                      aria-label="live"
                    />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-konjo-fg-muted">{description}</p>
              </div>
              <span className="text-konjo-mono shrink-0 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                {tag}
              </span>
            </div>
            <div className="glass-konjo rounded-konjo-xl p-6 sm:p-8">
              <Section />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
