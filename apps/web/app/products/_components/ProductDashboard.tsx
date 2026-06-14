"use client";

import {
  Dial, TokenStream, StagePipeline, RiskRing, MetricCard,
  TimeSeriesChart, ComparisonBar, RankList, StatusMatrix, color,
} from "@konjoai/ui";
import type {
  Stage, StreamToken, ComparisonBarItem, RankListItem,
  TimeSeriesPoint, StatusMatrixRow,
} from "@konjoai/ui";
import { useStreamTokens, usePipelineTick, useLiveTimeSeries } from "@/lib/hooks";
import { ScrambleText } from "@/app/_components/ScrambleText";

// ─── shared data ────────────────────────────────────────────────────────────

const MIRU_TOKENS: StreamToken[] = [
  { text: "I see ",            color: color.fgMuted                },
  { text: "a wooden table",   color: color.accent,  weight: 0.7   },
  { text: " with ",           color: color.fgMuted                },
  { text: "three objects",    color: color.violet,  weight: 0.55  },
  { text: ": a ",             color: color.fgMuted                },
  { text: "ceramic mug",      color: color.warm,    weight: 0.85  },
  { text: ", a ",             color: color.fgMuted                },
  { text: "leather notebook", color: color.warm,    weight: 0.6   },
  { text: ", and a ",         color: color.fgMuted                },
  { text: "fountain pen",     color: color.warm,    weight: 0.45  },
  { text: ".\n\nLighting: ",  color: color.fgMuted                },
  { text: "morning window",   color: color.cool,    weight: 0.5   },
  { text: " to the left",     color: color.cool,    weight: 0.4   },
  { text: "...",              color: color.fgFaint               },
];

const KYRO_RANKS: RankListItem[] = [
  { label: "EU AI Act Article 9",    score: 0.947, sublabel: "Risk management requirements" },
  { label: "NIST AI RMF 1.0",        score: 0.891, sublabel: "Govern 1.2 — risk tolerance"  },
  { label: "ISO/IEC 42001:2023",     score: 0.834, sublabel: "Clause 6.1 — risk assessment" },
];

const TOKI_MATRIX: StatusMatrixRow[] = [
  { label: "Jailbreak",  cells: [{ status: "fail" }, { status: "pass", detail: "fine-tuned" }, { status: "warn"  }] },
  { label: "Injection",  cells: [{ status: "warn" }, { status: "pass" },                       { status: "pass"  }] },
  { label: "Edge Cases", cells: [{ status: "pass" }, { status: "warn", detail: "review" },     { status: "pass"  }] },
];

const TOKI_RANKS: RankListItem[] = [
  { label: "Prompt injection",    score: 0.89, sublabel: "direct · 142 examples" },
  { label: "Jailbreak — DAN",    score: 0.76, sublabel: "role-play · 89 examples" },
  { label: "Boundary probing",   score: 0.63, sublabel: "edge case · 204 examples" },
];

const VECTRO_CODECS: ComparisonBarItem[] = [
  { label: "INT8",   value: 87, baseline: 91 },
  { label: "NF4",    value: 84, baseline: 91 },
  { label: "PQ-96",  value: 79, baseline: 91 },
  { label: "Binary", value: 71, baseline: 91 },
];

const KAIRU_SEED: TimeSeriesPoint[] = Array.from({ length: 40 }, (_, i) => ({
  t: i * 500,
  value: 42 + Math.sin(i * 0.38) * 14 + (i % 6) * 1.8,
}));

const DREX_SEED: TimeSeriesPoint[] = Array.from({ length: 40 }, (_, i) => ({
  t: i * 500,
  value: Math.max(0.05, 2.4 * Math.exp(-i * 0.07) + 0.12),
}));

// ─── per-product dashboards ──────────────────────────────────────────────────

function SquishDashboard() {
  const tick = usePipelineTick(3, 1100);
  const stages: Stage[] = [
    { id: "tok",    label: "Tokenize",   status: tick > 0 ? "done" : tick === 0 ? "active" : "pending", durationMs: 2  },
    { id: "pre",    label: "Prefill",    status: tick > 1 ? "done" : tick === 1 ? "active" : "pending", durationMs: 18 },
    { id: "dec",    label: "Decode",     status: tick > 2 ? "done" : tick === 2 ? "active" : "pending"                 },
    { id: "dtok",   label: "Detokenize", status: tick === 3 ? "active" : "pending",                     durationMs: 1  },
  ];
  return (
    <div className="flex flex-col gap-6">
      <StagePipeline stages={stages} />
      <div className="flex justify-center">
        <Dial value={42} label="Throughput" unit="tok/s" severity="info" size={120} min={0} max={120} sublabel="MLX · M3 Max" />
      </div>
    </div>
  );
}

function VectroDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <ComparisonBar items={VECTRO_CODECS} unit="%" max={100} />
      <div className="flex justify-center">
        <Dial value={32} label="Compression" unit="×" severity="info" size={120} min={0} max={64} sublabel="PQ-96 · 768-dim" />
      </div>
    </div>
  );
}

function KyroDashboard() {
  const tick = usePipelineTick(5, 1100);
  const stages: Stage[] = [
    { id: "intent", label: "Intent",   status: tick > 0 ? "done" : tick === 0 ? "active" : "pending", durationMs: 4  },
    { id: "dense",  label: "Dense",    status: tick > 1 ? "done" : tick === 1 ? "active" : "pending", durationMs: 22, detail: "0.94" },
    { id: "sparse", label: "BM25",     status: tick > 2 ? "done" : tick === 2 ? "active" : "pending", durationMs: 11 },
    { id: "rrf",    label: "RRF",      status: tick > 3 ? "done" : tick === 3 ? "active" : "pending", durationMs: 1  },
    { id: "rerank", label: "Rerank",   status: tick > 4 ? "done" : tick === 4 ? "active" : "pending", durationMs: 64, detail: "ColBERT" },
    { id: "gen",    label: "Generate", status: tick === 5 ? "active" : "pending"                                       },
  ];
  return (
    <div className="flex flex-col gap-6">
      <StagePipeline stages={stages} />
      <RankList items={KYRO_RANKS} maxScore={1} scoreDecimals={3} />
    </div>
  );
}

function KairuDashboard() {
  const data = useLiveTimeSeries(KAIRU_SEED, 800, 60,
    (t) => 42 + Math.sin(t * 0.001) * 14 + Math.random() * 6,
  );
  return (
    <div className="flex flex-col gap-6">
      <TimeSeriesChart data={data} label="Throughput" unit="tok/s" severity="ok" width={640} height={130} />
      <div className="grid grid-cols-3 gap-3">
        <MetricCard value={4.2}  label="p50 Latency" unit="ms" severity="ok"   />
        <MetricCard value={6.8}  label="p95 Latency" unit="ms" severity="info" />
        <MetricCard value={8.2}  label="p99 Latency" unit="ms" severity="warn" />
      </div>
    </div>
  );
}

function MiruDashboard() {
  const tokens = useStreamTokens(MIRU_TOKENS, 95);
  return (
    <div className="flex flex-col gap-6">
      <TokenStream tokens={tokens} maxHeight={180} />
      <div className="flex justify-center">
        <Dial value={76} label="Attn. Coverage" unit="%" severity="info" size={120} sublabel="ViT-L · layer 18" />
      </div>
    </div>
  );
}

function TokiDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <StatusMatrix rows={TOKI_MATRIX} columns={["Classifier", "Fine-tune", "Rejection"]} />
      <RankList items={TOKI_RANKS} maxScore={1} scoreDecimals={2} />
    </div>
  );
}

function KohakuDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start gap-6">
        <RiskRing
          size={220}
          title="Memory Health"
          subtitle="HDC · 10k-dim"
          rings={[
            { label: "Recall",    value: 0.89, severity: "ok"   },
            { label: "Precision", value: 0.84, severity: "ok"   },
            { label: "Stability", value: 0.71, severity: "warn" },
          ]}
        />
        <div className="flex flex-col gap-3">
          <MetricCard value={89}  label="Memory Recall"   unit="%" delta={4}  deltaLabel="vs baseline" severity="ok"   />
          <MetricCard value={84}  label="Precision"       unit="%" delta={2}  deltaLabel="vs baseline" severity="ok"   />
          <MetricCard value={4.2} label="Decay half-life" unit="h" severity="info" />
        </div>
      </div>
    </div>
  );
}

function LopiDashboard() {
  const tick = usePipelineTick(4, 1300);
  const stages: Stage[] = [
    { id: "plan",    label: "Plan",    status: tick > 0 ? "done" : tick === 0 ? "active" : "pending" },
    { id: "branch",  label: "Branch",  status: tick > 1 ? "done" : tick === 1 ? "active" : "pending" },
    { id: "execute", label: "Execute", status: tick > 2 ? "done" : tick === 2 ? "active" : "pending" },
    { id: "review",  label: "Review",  status: tick > 3 ? "done" : tick === 3 ? "active" : "pending" },
    { id: "merge",   label: "Merge",   status: tick === 4 ? "active" : "pending"                      },
  ];
  return (
    <div className="flex flex-col gap-6">
      <StagePipeline stages={stages} />
      <div className="flex justify-center">
        <Dial value={94} label="Success Rate" unit="%" severity="ok" size={120} sublabel="last 50 tasks" />
      </div>
    </div>
  );
}

function DrexDashboard() {
  const loss = useLiveTimeSeries(DREX_SEED, 900, 60,
    (t) => Math.max(0.04, 0.18 * Math.exp(-t * 0.00015) + 0.04 + Math.random() * 0.012),
  );
  return (
    <div className="flex flex-col gap-6">
      <TimeSeriesChart data={loss} label="Training Loss" severity="info" width={640} height={130} />
      <div className="flex justify-center">
        <Dial value={38} label="Progress" unit="%" severity="info" size={120} sublabel="ESN+HDC+Mamba" />
      </div>
    </div>
  );
}

// ─── router ──────────────────────────────────────────────────────────────────

const DASHBOARDS: Record<string, () => React.JSX.Element> = {
  squish:  SquishDashboard,
  vectro:  VectroDashboard,
  kyro:    KyroDashboard,
  kairu:   KairuDashboard,
  miru:    MiruDashboard,
  toki:    TokiDashboard,
  kohaku:  KohakuDashboard,
  lopi:    LopiDashboard,
  drex:    DrexDashboard,
};

/** Live product-specific dashboard section for each product page. */
export function ProductDashboard({ slug }: { slug: string }) {
  const Dashboard = DASHBOARDS[slug];
  if (!Dashboard) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="mb-6 flex items-center gap-3">
        <ScrambleText
          as="h2"
          text="Live dashboard"
          className="text-konjo-display text-2xl font-semibold tracking-tight sm:text-3xl"
          delay={80}
        />
        <span
          className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-good/30 bg-konjo-good/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-konjo-good"
          aria-label="Live data"
        >
          <span className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good" aria-hidden />
          Live
        </span>
      </div>
      <div className="glass-konjo rounded-konjo-xl p-6 sm:p-8">
        <Dashboard />
      </div>
    </section>
  );
}
