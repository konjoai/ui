"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease, cn } from "@konjoai/ui";
import { toast } from "@/lib/toast";
import { ScrambleText } from "./ScrambleText";

type ModelId = "squish" | "kyro" | "miru" | "lopi";

type ModelDef = {
  id: ModelId;
  label: string;
  glyph: string;
  engine: string;
  tokPerSec: number;
  ttftMs: number;
  color: string;
  accent: string;
  examples: string[];
  responses: Array<{ match: RegExp; tokens: string[] }>;
  fallback: string[];
};

const MODELS: ModelDef[] = [
  {
    id: "squish",
    label: "squish",
    glyph: "◐",
    engine: "mlx-4 · Apple Silicon",
    tokPerSec: 42,
    ttftMs: 11.8,
    color: "var(--color-konjo-brand)",
    accent: "var(--color-konjo-accent)",
    examples: [
      "How does squish achieve 42 tok/s?",
      "What is the KonjoAI product stack?",
      "Explain Metal-accelerated inference",
    ],
    responses: [
      {
        match: /squish|inference|token|throughput|metal|mlx/i,
        tokens: "squish is KonjoAI 's native inference engine . It targets Apple Silicon via the MLX framework , delivering 42 tok/s on M3 Max — 5.3× over the CPU baseline . The decode path uses Metal-accelerated kernels and avoids Python GIL contention by streaming output asynchronously . Each request reports p50 , p95 , and p99 latency with sub-millisecond overhead . The batch-pipelining scheduler sustains throughput even under concurrent workloads .".split(" "),
      },
      {
        match: /konjo|product|portfolio|stack/i,
        tokens: "KonjoAI builds nine complementary AI products : squish for inference , kyro for retrieval , vectro for compression , kairu for latency optimization , miru for vision tracing , toki for adversarial safety , kohaku for episodic memory , lopi for agent orchestration , and drex for hybrid architecture training . Every product ships a first-class CLI , a benchmark suite , and a CLAUDE.md . One design system . Zero compromises .".split(" "),
      },
    ],
    fallback: "I'm squish — the KonjoAI inference engine . I run on Apple Silicon via MLX and decode tokens at 42 tok/s . Try asking me about throughput , Metal path , or the full KonjoAI stack .".split(" "),
  },
  {
    id: "kyro",
    label: "kyro",
    glyph: "✸",
    engine: "hybrid RAG · ColBERT",
    tokPerSec: 18,
    ttftMs: 22.4,
    color: "var(--color-konjo-accent)",
    accent: "var(--color-konjo-cool)",
    examples: [
      "Explain kyro's hybrid RAG pipeline",
      "How does ColBERT reranking work?",
      "What is NDCG@10 and why does it matter?",
    ],
    responses: [
      {
        match: /kyro|retrieval|rag|search|vector|ndcg|colbert|bm25/i,
        tokens: "kyro is a hybrid RAG engine that fuses dense vector search with sparse BM25 retrieval , then re-ranks using a ColBERT cross-encoder . The result is NDCG@10 = 0.91 on the BEIR benchmark — 21 points above the vectorDB average . Semantic cache hits drop latency from 68 ms to 2.1 ms . kyro runs entirely on-prem ; your embeddings never leave your infrastructure . The hybrid fusion step uses Reciprocal Rank Fusion ( RRF ) to merge dense and sparse results before reranking .".split(" "),
      },
    ],
    fallback: "I'm kyro — KonjoAI 's hybrid RAG engine . I fuse dense vector search with BM25 and re-rank with ColBERT to hit NDCG@10 = 0.91 . Ask me about retrieval pipelines , semantic caching , or on-prem RAG .".split(" "),
  },
  {
    id: "miru",
    label: "miru",
    glyph: "◉",
    engine: "ViT-L · attention trace",
    tokPerSec: 29,
    ttftMs: 34.1,
    color: "var(--color-konjo-violet)",
    accent: "var(--color-konjo-brand-soft)",
    examples: [
      "How does miru trace visual attention?",
      "Explain ViT attention head analysis",
      "What is miru's annotation pipeline?",
    ],
    responses: [
      {
        match: /miru|vision|visual|vit|attention|image|annotation/i,
        tokens: "miru is KonjoAI 's vision tracing system . It wraps ViT-L with a layer-by-layer attention extractor , producing weighted region maps that reveal where the model 'looks' . Coverage across the 18 transformer layers averages 76% of the input canvas . miru 's annotation pipeline exports COCO-format masks , bounding-box attributions , and heat maps in a single pass — letting ML engineers debug visual reasoning without writing custom hooks .".split(" "),
      },
    ],
    fallback: "I'm miru — KonjoAI 's vision tracing system . I extract and visualize attention maps from ViT-L , achieving 76% canvas coverage across 18 transformer layers . Try asking about visual attention , ViT internals , or annotation pipelines .".split(" "),
  },
  {
    id: "lopi",
    label: "lopi",
    glyph: "⌬",
    engine: "agent graph · tree search",
    tokPerSec: 33,
    ttftMs: 18.6,
    color: "var(--color-konjo-warm)",
    accent: "var(--color-konjo-good)",
    examples: [
      "How does lopi orchestrate agent tasks?",
      "What is lopi's task success rate?",
      "Explain branch-and-merge agent planning",
    ],
    responses: [
      {
        match: /lopi|agent|orchestrat|task|plan|branch|tree/i,
        tokens: "lopi is KonjoAI 's agent orchestration layer . It implements a branch-and-merge planner that decomposes tasks into parallel sub-goals , executes them across independent branches , then merges results via a critic pass . On the GAIA benchmark , lopi achieves a 94% task success rate — 88 points above single-agent baselines . The planner uses A*-guided tree search to avoid redundant branches and supports tool-call batching to minimize round-trip latency .".split(" "),
      },
    ],
    fallback: "I'm lopi — KonjoAI 's agent orchestration layer . I use branch-and-merge planning to achieve 94% task success on GAIA . Ask me about agent graphs , parallel planning , or tool-call batching .".split(" "),
  },
];

const MODEL_MAP = Object.fromEntries(MODELS.map((m) => [m.id, m])) as Record<ModelId, ModelDef>;

type HistoryEntry = { prompt: string; response: string; modelLabel: string };

/**
 * Interactive multi-model inference demo — select a product, type a prompt,
 * see simulated token streaming with live tok/s, TTFT, and token count.
 */
export function LiveDemo() {
  const reduce = useReducedMotion();
  const [selectedId, setSelectedId] = useState<ModelId>("squish");
  const [prompt, setPrompt] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [tokens, setTokens] = useState<string[]>([]);
  const [tokenIdx, setTokenIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const runRef = useRef(0);
  const startRef = useRef(0);
  const lastPromptRef = useRef("");
  const activeModel = MODEL_MAP[selectedId];

  const run = useCallback(() => {
    if (streaming) return;
    const p = prompt.trim();
    if (!p) return;

    const mdl = MODEL_MAP[selectedId];
    const canned = mdl.responses.find((r) => r.match.test(p));
    const toks = canned?.tokens ?? mdl.fallback;

    lastPromptRef.current = p;
    setTokens(toks);
    setTokenIdx(0);
    setElapsed(0);
    setStreaming(true);
    setCopied(false);
    startRef.current = Date.now();
    runRef.current++;
  }, [prompt, streaming, selectedId]);

  useEffect(() => {
    if (!streaming) return;
    const runId = runRef.current;
    if (tokenIdx >= tokens.length) {
      setStreaming(false);
      setElapsed(Date.now() - startRef.current);
      const response = tokens.join(" ");
      setHistory((prev) =>
        [{ prompt: lastPromptRef.current, response, modelLabel: activeModel.label }, ...prev].slice(0, 3),
      );
      return;
    }
    const delayMs = reduce ? 0 : Math.round(1000 / activeModel.tokPerSec);
    const id = setTimeout(() => {
      if (runRef.current !== runId) return;
      setTokenIdx((i) => i + 1);
      setElapsed(Date.now() - startRef.current);
    }, delayMs);
    return () => clearTimeout(id);
  }, [streaming, tokenIdx, tokens.length, reduce, activeModel.tokPerSec, activeModel.label]);

  const displayed = tokens.slice(0, tokenIdx).join(" ");
  const liveTps = elapsed > 0 ? Math.round((tokenIdx / elapsed) * 1000) : 0;

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      run();
    }
  }

  return (
    <section
      id="demo"
      aria-label="Interactive inference demo"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8"
      >
        <p
          className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em]"
          style={{ color: activeModel.color }}
        >
          {activeModel.label} · {activeModel.engine}
        </p>
        <ScrambleText
          as="h2"
          text="Try it live"
          className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={100}
        />
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Select a model, type a prompt, watch it stream. Each product responds at its real throughput.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.1 }}
        className="glass-konjo rounded-konjo-xl overflow-hidden"
      >
        {/* Model selector */}
        <div
          className="flex items-center gap-1 border-b border-konjo-line/30 bg-konjo-surface/40 p-3"
          role="group"
          aria-label="Select inference model"
        >
          {MODELS.map((m) => {
            const active = m.id === selectedId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedId(m.id);
                  setPrompt("");
                  setTokens([]);
                  setTokenIdx(0);
                  setElapsed(0);
                  setStreaming(false);
                  setCopied(false);
                }}
                aria-pressed={active}
                className={cn(
                  "text-konjo-mono inline-flex items-center gap-1.5 rounded-konjo border px-3 py-1.5 text-[11px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent",
                  active
                    ? "border-transparent text-konjo-fg"
                    : "border-konjo-line/40 bg-transparent text-konjo-fg-muted hover:text-konjo-fg",
                )}
                style={active ? { background: `color-mix(in oklch, ${m.color} 15%, transparent)`, borderColor: `color-mix(in oklch, ${m.color} 40%, transparent)` } : undefined}
              >
                <span style={{ color: m.color }} aria-hidden>{m.glyph}</span>
                {m.label}
                <span className="text-[9px] text-konjo-fg-faint tabular-nums">{m.tokPerSec}</span>
              </button>
            );
          })}
          <span className="text-konjo-mono ml-auto text-[10px] text-konjo-fg-faint">
            {activeModel.engine}
          </span>
        </div>

        {/* Prompt bar */}
        <div className="border-b border-konjo-line/40 p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {activeModel.examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setPrompt(ex)}
                className="text-konjo-mono rounded-full border border-konjo-line/40 bg-konjo-surface/40 px-2.5 py-1 text-[10px] text-konjo-fg-muted transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
                style={{ ["--tw-border-opacity" as string]: "1" }}
              >
                {ex}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Ask ${activeModel.label} anything…`}
              rows={2}
              aria-label="Prompt input"
              className="text-konjo-mono min-w-0 flex-1 resize-none rounded-konjo border border-konjo-line/40 bg-konjo-bg/40 px-3 py-2 text-sm text-konjo-fg placeholder:text-konjo-fg-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-brand/50"
            />
            <button
              type="button"
              onClick={run}
              disabled={streaming || !prompt.trim()}
              aria-label="Run inference"
              className="text-konjo-mono shrink-0 self-end rounded-konjo-lg border px-4 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
              style={{
                borderColor: `color-mix(in oklch, ${activeModel.color} 40%, transparent)`,
                background: `color-mix(in oklch, ${activeModel.color} 10%, transparent)`,
                color: activeModel.color,
              }}
            >
              {streaming ? "Running…" : "Run ↵"}
            </button>
          </div>
          <p className="text-konjo-mono mt-1.5 text-[10px] text-konjo-fg-faint">
            ⌘↵ to run · {activeModel.tokPerSec} tok/s · {activeModel.ttftMs} ms TTFT
          </p>
        </div>

        {/* Response area */}
        <div className="relative min-h-[140px] p-5">
          {/* Live status + metrics */}
          <div className="mb-3 flex items-center gap-2">
            <AnimatePresence mode="wait">
              {streaming ? (
                <motion.span
                  key="running"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border bg-konjo-good/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-konjo-good"
                  style={{ borderColor: "color-mix(in oklch, var(--color-konjo-good) 30%, transparent)" }}
                >
                  <span className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good" aria-hidden />
                  Streaming
                </motion.span>
              ) : tokenIdx > 0 ? (
                <motion.span
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-line/40 bg-konjo-surface/40 px-2 py-0.5 text-[10px] uppercase tracking-widest text-konjo-fg-faint"
                >
                  Complete
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint"
                >
                  Awaiting prompt
                </motion.span>
              )}
            </AnimatePresence>

            {(streaming || tokenIdx > 0) && (
              <div className="text-konjo-mono ml-auto flex items-center gap-4 text-[10px] text-konjo-fg-faint">
                <span>
                  <span className="tabular-nums" style={{ color: activeModel.color }}>{liveTps || "–"}</span>
                  {" "}tok/s
                </span>
                <span>
                  <span className="tabular-nums text-konjo-good">{activeModel.ttftMs}</span>
                  {" "}ms ttft
                </span>
                <span>
                  <span className="tabular-nums">{tokenIdx}</span>
                  {" "}tokens
                </span>
              </div>
            )}
          </div>

          {/* Output text */}
          <div
            className="text-konjo-mono text-sm leading-7 text-konjo-fg-muted"
            aria-live="polite"
            aria-label="Model response"
          >
            {tokenIdx === 0 && !streaming ? (
              <span className="text-konjo-fg-faint italic">Response will appear here…</span>
            ) : (
              <>
                {displayed}
                {streaming && (
                  <span
                    className="konjo-pulse ml-px inline-block h-[0.85em] w-[1.5px] -mb-[1px] align-middle rounded-[1px]"
                    style={{ background: activeModel.color }}
                    aria-hidden
                  />
                )}
              </>
            )}
          </div>

          {/* Copy response button */}
          <AnimatePresence>
            {!streaming && tokenIdx > 0 && (
              <motion.button
                key="copy-response"
                type="button"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  navigator.clipboard.writeText(displayed).then(() => {
                    setCopied(true);
                    toast("Response copied to clipboard", "success");
                    setTimeout(() => setCopied(false), 2000);
                  }).catch(() => {/* clipboard blocked */});
                }}
                className="text-konjo-mono mt-3 flex items-center gap-1.5 rounded-konjo border border-konjo-line/40 px-2.5 py-1 text-[10px] text-konjo-fg-faint transition-colors hover:border-konjo-brand/40 hover:text-konjo-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
                aria-label="Copy model response to clipboard"
              >
                {copied ? "✓ Copied" : "⎘ Copy response"}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Response history */}
        <AnimatePresence>
          {history.length > 0 && (
            <motion.div
              key="history"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: ease.nehan }}
              className="overflow-hidden border-t border-konjo-line/20"
            >
              <div className="px-5 py-3">
                <p className="text-konjo-mono mb-2 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                  Previous responses
                </p>
                <div className="flex flex-col gap-2">
                  {history.map((h, i) => (
                    <div key={i} className="text-konjo-mono flex items-start gap-2 text-[11px]">
                      <span className="mt-0.5 shrink-0" style={{ color: MODEL_MAP[h.modelLabel as ModelId]?.color ?? "var(--color-konjo-brand)" }}>
                        {MODEL_MAP[h.modelLabel as ModelId]?.glyph ?? "›"}
                      </span>
                      <span className="text-konjo-fg-faint line-clamp-1">
                        <span className="text-konjo-fg-muted">{h.prompt}</span>
                        <span className="mx-1 text-konjo-line">·</span>
                        {h.response.slice(0, 60)}…
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="border-t border-konjo-line/30 px-5 py-2.5">
          <p className="text-konjo-mono text-[10px] text-konjo-fg-faint">
            Simulated at {activeModel.tokPerSec} tok/s · TTFT {activeModel.ttftMs} ms ·{" "}
            <a
              href={`/products/${activeModel.id}`}
              className="underline underline-offset-2 hover:text-konjo-fg"
            >
              View {activeModel.label} →
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
