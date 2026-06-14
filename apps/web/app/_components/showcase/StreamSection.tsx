"use client";

import { StagePipeline, TokenStream, color } from "@konjoai/ui";
import type { Stage, StreamToken } from "@konjoai/ui";
import { useStreamTokens, usePipelineTick } from "@/lib/hooks";

const TOKENS: StreamToken[] = [
  { text: "Analyzing query",              color: color.fgMuted },
  { text: " — multi-hop reasoning",       color: color.accent,  weight: 0.75 },
  { text: " detected.\n\nSearching ",     color: color.fgMuted },
  { text: "42.7 M",                       color: color.accent,  weight: 0.9  },
  { text: " vectors · top-1 ",            color: color.fgMuted },
  { text: "0.947",                        color: color.good,    weight: 0.95 },
  { text: "\n\nRetrieved: ",              color: color.fgMuted },
  { text: "EU AI Act Art. 9",             color: color.warm,    weight: 0.85 },
  { text: " · ",                          color: color.fgFaint  },
  { text: "NIST AI RMF",                 color: color.warm,    weight: 0.65 },
  { text: " · ",                          color: color.fgFaint  },
  { text: "ISO/IEC 42001",               color: color.cool,    weight: 0.6  },
  { text: "\n\nGrounding response with ", color: color.fgMuted },
  { text: "source attribution",          color: color.violet,  weight: 0.6  },
  { text: " + ",                          color: color.fgMuted },
  { text: "calibrated confidence",       color: color.accent,  weight: 0.5  },
  { text: "...",                          color: color.fgFaint  },
];

type StageDef = Omit<Stage, "status">;

const RAG_BASE: StageDef[] = [
  { id: "intent",  label: "Intent",   durationMs: 4             },
  { id: "dense",   label: "Dense",    durationMs: 22, detail: "42.7M vecs · 0.94" },
  { id: "sparse",  label: "BM25",     durationMs: 11            },
  { id: "rrf",     label: "RRF",      durationMs: 1             },
  { id: "rerank",  label: "Rerank",   durationMs: 64, detail: "ColBERT · 0.947"   },
  { id: "gen",     label: "Generate"                            },
];

/** Live RAG pipeline + attention-weighted token stream showcase. */
export function StreamSection() {
  const tokens = useStreamTokens(TOKENS, 100);
  const tick = usePipelineTick(RAG_BASE.length, 1100);

  const stages: Stage[] = RAG_BASE.map((s, idx): Stage => ({
    ...s,
    status: tick > idx ? "done" : tick === idx ? "active" : "pending",
  }));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          StagePipeline · kyro RAG retrieval
        </p>
        <StagePipeline stages={stages} />
      </div>
      <div>
        <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          TokenStream · miru attention trace
        </p>
        <TokenStream tokens={tokens} maxHeight={200} />
      </div>
    </div>
  );
}
