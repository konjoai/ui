"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ease } from "@konjoai/ui";

type Span = { text: string; kind: "kw" | "str" | "cmt" | "fn" | "num" | "plain" };

const KW =
  /^(import|from|async|await|for|in|if|else|elif|return|with|as|class|def|True|False|None)\b/;

function tokenize(code: string): Span[] {
  const spans: Span[] = [];
  let rest = code;
  while (rest.length > 0) {
    let m: RegExpMatchArray | null;
    // Comment
    if ((m = rest.match(/^(#[^\n]*)/))) {
      spans.push({ text: m[1], kind: "cmt" }); rest = rest.slice(m[1].length); continue;
    }
    // String (double/single, f-string)
    if ((m = rest.match(/^([fF]?"[^"\\]*(?:\\.[^"\\]*)*"|[fF]?'[^'\\]*(?:\\.[^'\\]*)*')/))) {
      spans.push({ text: m[1], kind: "str" }); rest = rest.slice(m[1].length); continue;
    }
    // Keyword
    if ((m = rest.match(KW))) {
      spans.push({ text: m[1], kind: "kw" }); rest = rest.slice(m[1].length); continue;
    }
    // Function/method call (word before `(`)
    if ((m = rest.match(/^([a-zA-Z_]\w*)\(/))) {
      spans.push({ text: m[1], kind: "fn" });
      spans.push({ text: "(", kind: "plain" });
      rest = rest.slice(m[0].length); continue;
    }
    // Number
    if ((m = rest.match(/^(\d+\.?\d*)/))) {
      spans.push({ text: m[1], kind: "num" }); rest = rest.slice(m[1].length); continue;
    }
    spans.push({ text: rest[0], kind: "plain" }); rest = rest.slice(1);
  }
  return spans;
}

const KIND_COLOR: Record<Span["kind"], string | undefined> = {
  kw:    "var(--color-konjo-violet)",
  str:   "var(--color-konjo-warm)",
  cmt:   "var(--color-konjo-fg-faint)",
  fn:    "var(--color-konjo-accent)",
  num:   "var(--color-konjo-good)",
  plain: undefined,
};

const SNIPPETS: Record<string, { file: string; lang: string; code: string }> = {
  squish: {
    file: "example.py", lang: "python",
    code: `import squish

client = squish.Client(model="mlx-4")

# Stream tokens as they decode
for token in client.stream("Explain attention"):
    print(token, end="", flush=True)

result = client.generate("Summarise in 3 bullets", metrics=True)
# 42 tok/s  ·  p50 4ms  ·  p99 8ms`,
  },
  vectro: {
    file: "compress.py", lang: "python",
    code: `import numpy as np
from vectro import compress, decompress

embeddings = np.load("vecs.npy")  # shape (N, 2048)

compressed = compress(embeddings, codec="VQZ", ratio=4)
# 12.4 MB → 3.1 MB  ·  fidelity 99.2%  ·  2.4 s

restored = decompress(compressed)
assert np.allclose(embeddings, restored, atol=0.08)`,
  },
  kyro: {
    file: "search.py", lang: "python",
    code: `from kyro import KyroClient

client = KyroClient(index="docs-v2")

results = client.search(
    query="How does attention work?",
    top_k=5,
    rerank=True,   # ColBERT cross-encoder
)
# confidence 0.94  ·  latency 18ms

for doc in results:
    print(f"[{doc.score:.3f}] {doc.title}")`,
  },
  kairu: {
    file: "benchmark.py", lang: "python",
    code: `from kairu import InferenceOptimizer, LatencyBudget

opt = InferenceOptimizer(
    budget=LatencyBudget(p50_ms=4, p99_ms=10),
    strategy="speculative",  # draft + verify
)

result = opt.run(prompt="Summarise in 3 bullets")
print(result.metrics)
# p50 4.2ms  ·  p95 6.8ms  ·  p99 8.2ms`,
  },
  miru: {
    file: "trace.py", lang: "python",
    code: `from miru import MiruClient

client = MiruClient()

trace = client.analyze(
    image="desk.jpg",
    prompt="Describe what you see",
    layers=[18, 22, 24],  # ViT-L attention layers
)

print(f"Coverage: {trace.attention_coverage:.0%}")
trace.overlay.save("attention_map.png")`,
  },
  toki: {
    file: "red_team.py", lang: "python",
    code: `from toki import TokiSuite

suite = TokiSuite(target="https://api.example.com/v1")

results = suite.run(
    categories=["jailbreak", "injection", "edge"],
    samples=100,
)

print(f"Robustness: {results.score:.0%}")
# jailbreak 89%  ·  injection 76%  ·  edge 63%`,
  },
  kohaku: {
    file: "memory.py", lang: "python",
    code: `from kohaku import MemoryClient

mem = MemoryClient(dimensions=10_000)  # HDC

# Store an episode
mem.store("user", "Loves espresso and functional types")

# Recall semantically — no exact match needed
hits = mem.recall("What does the user drink?", top_k=3)
for h in hits:
    print(f"[{h.score:.2f}] {h.content}")`,
  },
  lopi: {
    file: "orchestrate.py", lang: "python",
    code: `from lopi import AgentPool

pool = AgentPool(
    model="claude-sonnet-4-6",
    concurrency=4,
    isolation="git-branch",  # branch per task
)

tasks = [
    "Fix the failing test in auth/",
    "Add OpenAPI docs to /api/users",
]

results = pool.run(tasks, retry=3)
for r in results:
    print(f"{r.task}: {r.status}  {r.branch}")`,
  },
  drex: {
    file: "train.py", lang: "python",
    code: `from drex import HybridModel, Trainer

# ESN + HDC + Mamba hybrid architecture
model = HybridModel(
    d_model=256,
    n_layers=6,
    reservoir="echo-state",   # ESN component
)

trainer = Trainer(model, lr=3e-4)
trainer.fit(dataset, epochs=50)

print(f"Loss: {trainer.history[-1]:.4f}")`,
  },
};

function HighlightedCode({ code }: { code: string }) {
  const spans = tokenize(code);
  return (
    <code>
      {spans.map((span, i) =>
        span.kind === "plain" ? (
          span.text
        ) : (
          <span key={i} style={{ color: KIND_COLOR[span.kind] }}>
            {span.text}
          </span>
        )
      )}
    </code>
  );
}

/** Per-product quick-start code snippet with syntax highlighting and a copy button. */
export function ProductCodeSnippet({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const snippet = SNIPPETS[slug];
  if (!snippet) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently skip
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <h2 className="text-konjo-display mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        Quick start
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: ease.kanjo }}
        className="glass-konjo rounded-konjo-xl overflow-hidden border border-konjo-line/50"
      >
        {/* File bar */}
        <div className="flex items-center justify-between border-b border-konjo-line/40 bg-konjo-surface/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: "#ff5f57" }} aria-hidden />
            <span className="size-2.5 rounded-full" style={{ background: "#febc2e" }} aria-hidden />
            <span className="size-2.5 rounded-full" style={{ background: "#28c840" }} aria-hidden />
            <span className="text-konjo-mono ml-2 text-[11px] text-konjo-fg-faint">
              {snippet.file}
            </span>
          </div>
          <button
            type="button"
            onClick={copy}
            aria-label={copied ? "Code copied" : "Copy code to clipboard"}
            className="text-konjo-mono rounded-konjo border border-konjo-line/50 px-2.5 py-1 text-[10px] text-konjo-fg-faint transition-colors hover:border-konjo-line hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-offset-1"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>

        {/* Code body */}
        <pre
          className="text-konjo-mono overflow-x-auto px-5 py-4 text-[13px] leading-6 text-konjo-fg-muted"
          tabIndex={0}
        >
          <HighlightedCode code={snippet.code} />
        </pre>
      </motion.div>
    </section>
  );
}
