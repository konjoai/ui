import { useEffect, useRef, useState } from "react";
import {
  KonjoApp,
  Dial,
  TokenStream,
  StagePipeline,
  RiskRing,
} from "./components";
import type { Stage, StreamToken } from "./components";
import { color } from "./lib/tokens";

const SAMPLE_REASONING: StreamToken[] = [
  { text: "I see ",          color: color.fgMuted },
  { text: "a wooden table",  color: color.accent, weight: 0.7 },
  { text: " with " },
  { text: "three objects",   color: color.violet, weight: 0.55 },
  { text: ": a " },
  { text: "ceramic mug",     color: color.warm,   weight: 0.85 },
  { text: ", a " },
  { text: "leather notebook",color: color.warm,   weight: 0.6 },
  { text: ", and a " },
  { text: "fountain pen",    color: color.warm,   weight: 0.45 },
  { text: ".\n\nThe lighting suggests " },
  { text: "morning",         color: color.cool,   weight: 0.5 },
  { text: " — likely from a " },
  { text: "window to the left",color: color.cool, weight: 0.4 },
];

function useStreamingTokens(all: StreamToken[], intervalMs = 90) {
  const [tokens, setTokens] = useState<StreamToken[]>([]);
  const i = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (i.current < all.length) {
        i.current += 1;
        setTokens(all.slice(0, i.current));
      } else {
        // restart loop
        i.current = 0;
        setTokens([]);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [all, intervalMs]);
  return tokens;
}

function Section({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <header className="mb-4">
        <h2 className="text-konjo-display text-konjo-fg" style={{ fontSize: 22, fontWeight: 600 }}>
          {title}
        </h2>
        {caption && (
          <p className="text-konjo-fg-muted mt-1" style={{ fontSize: 13 }}>
            {caption}
          </p>
        )}
      </header>
      <div className="glass-konjo rounded-konjo-lg p-6">{children}</div>
    </section>
  );
}

function App() {
  const [pipelineTick, setPipelineTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPipelineTick((t) => (t + 1) % 6), 1100);
    return () => clearInterval(id);
  }, []);

  const stages: Stage[] = [
    { id: "intent", label: "Intent",  status: pipelineTick > 0 ? "done" : "active", durationMs: 4 },
    { id: "dense",  label: "Dense",   status: pipelineTick > 1 ? "done" : pipelineTick === 1 ? "active" : "pending", durationMs: 22, detail: "12 docs · top 0.87" },
    { id: "sparse", label: "BM25",    status: pipelineTick > 2 ? "done" : pipelineTick === 2 ? "active" : "pending", durationMs: 11 },
    { id: "rrf",    label: "RRF",     status: pipelineTick > 3 ? "done" : pipelineTick === 3 ? "active" : "pending", durationMs: 1 },
    { id: "rerank", label: "Rerank",  status: pipelineTick > 4 ? "done" : pipelineTick === 4 ? "active" : "pending", durationMs: 64, detail: "ce-base · top score 0.94" },
    { id: "gen",    label: "Generate",status: pipelineTick === 5 ? "active" : "pending" },
  ];

  const tokens = useStreamingTokens(SAMPLE_REASONING, 110);

  return (
    <KonjoApp
      product="ui"
      tagline="The Konjo design system — beauty, honesty, motion."
      status={{ label: "v0.1.0", severity: "info" }}
    >
      {/* Hero */}
      <section className="mb-14 text-center">
        <p className="text-konjo-mono uppercase tracking-[0.32em] text-konjo-accent" style={{ fontSize: 11 }}>
          @konjoai/ui · sprint 0
        </p>
        <h1
          className="text-konjo-display text-konjo-fg mt-4 mx-auto"
          style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.025em", maxWidth: 880, lineHeight: 1.05 }}
        >
          Eight apps. <span style={{ color: color.accent }}>One soul.</span>
        </h1>
        <p
          className="text-konjo-fg-muted mt-5 mx-auto"
          style={{ fontSize: 17, maxWidth: 640, lineHeight: 1.55 }}
        >
          The shared visual language for the KonjoAI portfolio.
          ቆንጆ <span className="text-konjo-fg-faint">·</span> 根性 <span className="text-konjo-fg-faint">·</span> 康宙 <span className="text-konjo-fg-faint">·</span> 건조.
        </p>
      </section>

      {/* Dials */}
      <Section title="Dial" caption="Circular gauge for any min..max metric. Used for compression, throughput, latency, significance.">
        <div className="flex flex-wrap justify-around items-end gap-8">
          <Dial value={87}   label="Recall@10"   unit="%"    severity="ok"    sublabel="vs. fp32 baseline" />
          <Dial value={42}   label="Throughput"  unit="tok/s" severity="info" min={0} max={120} />
          <Dial value={9.4}  label="p99 latency" unit="ms"   severity="warn"  min={0} max={20} format={(v) => v.toFixed(1)} />
          <Dial value={3}    label="Critical findings" severity="high" min={0} max={10} />
          <Dial value={32}   label="Compression" unit="×"    severity="info" min={0} max={64} size={150} />
        </div>
      </Section>

      {/* RiskRing */}
      <Section title="RiskRing" caption="Concentric arcs for nested risk metrics. Built for squash; reusable across compliance / quality / safety.">
        <div className="flex justify-center">
          <RiskRing
            size={320}
            title="Compliance"
            subtitle="GPT-7 Mini · ATT-7af3"
            rings={[
              { label: "EU AI Act",      value: 0.88, severity: "ok" },
              { label: "NIST AI RMF",    value: 0.74, severity: "warn" },
              { label: "OWASP LLM Top-10", value: 0.91, severity: "info" },
            ]}
          />
        </div>
      </Section>

      {/* StagePipeline */}
      <Section title="StagePipeline" caption="A multi-step process as a flowing river — pending, active (pulsing), done, error.">
        <StagePipeline stages={stages} />
      </Section>

      {/* TokenStream */}
      <Section title="TokenStream" caption="Streaming text with per-token color and attention-weight halo. Built for miru, squish, kairu, kyro, toki.">
        <TokenStream tokens={tokens} maxHeight={220} />
      </Section>

      {/* Footer note */}
      <footer
        className="mt-16 pt-8 border-t border-konjo-line/60 text-konjo-fg-muted text-konjo-mono"
        style={{ fontSize: 12 }}
      >
        <div>
          built for <span className="text-konjo-fg">vectro · squish · kyro · miru · kohaku · kairu · toki · squash</span>
        </div>
      </footer>
    </KonjoApp>
  );
}

export default App;
