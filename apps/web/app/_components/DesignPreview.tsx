"use client";

import { Dial, ComparisonBar } from "@konjoai/ui";
import type { ComparisonBarItem } from "@konjoai/ui";

const BENCHMARKS: ComparisonBarItem[] = [
  { label: "EU AI Act score",   value: 88, baseline: 75, sublabel: "squash" },
  { label: "Retrieval NDCG@10", value: 91, baseline: 88, sublabel: "kyro"   },
  { label: "Recall@10",         value: 87, baseline: 85, sublabel: "vectro" },
  { label: "MRR@10",            value: 74, baseline: 79, sublabel: "kyro"   },
];

export function DesignPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="mb-8">
        <p className="text-konjo-mono text-xs uppercase tracking-[0.24em] text-konjo-accent">
          @konjoai/ui · design system
        </p>
        <h2 className="text-konjo-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Live components
        </h2>
        <p className="mt-2 text-sm text-konjo-fg-muted">
          Shared visual primitives powering every KonjoAI product.
        </p>
      </div>

      <div className="glass-konjo rounded-konjo-xl p-6 sm:p-8">
        <div className="flex flex-wrap justify-around gap-6 pb-8 border-b border-konjo-line/60">
          <Dial value={88}  label="EU AI Act"   unit="%" severity="ok"   size={140} sublabel="squash" />
          <Dial value={42}  label="Throughput"  unit="tok/s" severity="info" size={140} sublabel="kairu" min={0} max={120} />
          <Dial value={91}  label="NDCG@10"    unit="%" severity="ok"   size={140} sublabel="kyro" />
          <Dial value={38}  label="Compression" unit="×" severity="info" size={140} sublabel="vectro" min={0} max={64} />
        </div>

        <div className="pt-6">
          <ComparisonBar items={BENCHMARKS} unit="%" max={100} />
        </div>
      </div>
    </section>
  );
}
