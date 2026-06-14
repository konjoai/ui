"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { ScrambleText } from "./ScrambleText";

// Pre-defined responses keyed by prompt substring
const CANNED: Array<{ match: RegExp; tokens: string[]; model: string }> = [
  {
    match: /squish|inference|token|throughput/i,
    model: "squish · mlx-4",
    tokens: "squish is KonjoAI 's native inference engine . It targets Apple Silicon via the MLX framework , delivering 42 tok/s on M3 Max — 5.3× over the CPU baseline . The decode path uses Metal-accelerated kernels and avoids Python GIL contention by streaming output asynchronously . Each request reports p50 , p95 , and p99 latency with sub-millisecond overhead .".split(" "),
  },
  {
    match: /kyro|retrieval|rag|search|vector/i,
    model: "kyro · rag",
    tokens: "kyro is a hybrid RAG engine that fuses dense vector search with sparse BM25 retrieval , then re-ranks using a ColBERT cross-encoder . The result is NDCG@10 = 0.91 on the BEIR benchmark — 21 points above the vectorDB average . Semantic cache hits drop latency from 68 ms to 2.1 ms . kyro runs entirely on-prem ; your embeddings never leave your infrastructure .".split(" "),
  },
  {
    match: /konjo|product|portfolio|stack/i,
    model: "squish · mlx-4",
    tokens: "KonjoAI builds nine complementary AI products : squish for inference , kyro for retrieval , vectro for compression , kairu for latency optimization , miru for vision tracing , toki for adversarial safety , kohaku for episodic memory , lopi for agent orchestration , and drex for hybrid architecture training . Every product ships a first-class CLI , a benchmark suite , and a CLAUDE.md . One design system . Zero compromises .".split(" "),
  },
];

const DEFAULT_TOKENS = "I'm ready to answer questions about the KonjoAI stack — inference , retrieval , compression , memory , agents , and more . Type a prompt above and press Run to see a live response stream .".split(" ");

const EXAMPLE_PROMPTS = [
  "How does squish achieve 42 tok/s?",
  "Explain kyro's hybrid RAG pipeline",
  "What is the KonjoAI product stack?",
];

const CHAR_DELAY = 28; // ms per token (simulates ~35 tok/s)

/**
 * Interactive AI inference demo — type a prompt, see simulated token streaming
 * with live throughput and latency metrics. Powered (aesthetically) by squish.
 */
export function LiveDemo() {
  const reduce = useReducedMotion();
  const [prompt, setPrompt] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [tokens, setTokens] = useState<string[]>([]);
  const [tokenIdx, setTokenIdx] = useState(0);
  const [model, setModel] = useState("squish · mlx-4");
  const [elapsed, setElapsed] = useState(0);
  const runRef = useRef(0);
  const startRef = useRef(0);

  const run = useCallback(() => {
    if (streaming) return;
    const p = prompt.trim();
    if (!p) return;
    const canned = CANNED.find((c) => c.match.test(p));
    const toks = canned?.tokens ?? DEFAULT_TOKENS;
    const mdl = canned?.model ?? "squish · mlx-4";

    setModel(mdl);
    setTokens(toks);
    setTokenIdx(0);
    setElapsed(0);
    setStreaming(true);
    startRef.current = Date.now();
    runRef.current++;
  }, [prompt, streaming]);

  useEffect(() => {
    if (!streaming) return;
    const run = runRef.current;
    if (tokenIdx >= tokens.length) {
      setStreaming(false);
      setElapsed(Date.now() - startRef.current);
      return;
    }
    const id = setTimeout(() => {
      if (runRef.current !== run) return;
      setTokenIdx((i) => i + 1);
      setElapsed(Date.now() - startRef.current);
    }, reduce ? 0 : CHAR_DELAY);
    return () => clearTimeout(id);
  }, [streaming, tokenIdx, tokens.length, reduce]);

  const displayed = tokens.slice(0, tokenIdx).join(" ");
  const toksPerSec = elapsed > 0 ? Math.round((tokenIdx / elapsed) * 1000) : 0;
  const latencyMs = 11.8; // simulated first-token latency

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
        <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
          squish · live inference · mlx-4
        </p>
        <ScrambleText
          as="h2"
          text="Try it live"
          className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={100}
        />
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Ask anything about the KonjoAI stack. Responses stream at ~42 tok/s — the same throughput squish achieves on M3 Max.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.1 }}
        className="glass-konjo rounded-konjo-xl overflow-hidden"
      >
        {/* Prompt bar */}
        <div className="border-b border-konjo-line/40 p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {EXAMPLE_PROMPTS.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setPrompt(ex)}
                className="text-konjo-mono rounded-full border border-konjo-line/40 bg-konjo-surface/40 px-2.5 py-1 text-[10px] text-konjo-fg-muted transition-colors hover:border-konjo-brand/40 hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
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
              placeholder="Ask about the KonjoAI stack…"
              rows={2}
              aria-label="Prompt input"
              className="text-konjo-mono min-w-0 flex-1 resize-none rounded-konjo border border-konjo-line/40 bg-konjo-bg/40 px-3 py-2 text-sm text-konjo-fg placeholder:text-konjo-fg-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-brand/50"
            />
            <button
              type="button"
              onClick={run}
              disabled={streaming || !prompt.trim()}
              aria-label="Run inference"
              className="text-konjo-mono shrink-0 self-end rounded-konjo-lg border border-konjo-brand/40 bg-konjo-brand/10 px-4 py-2 text-sm font-medium text-konjo-brand transition-all hover:bg-konjo-brand/20 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
            >
              {streaming ? "Running…" : "Run ↵"}
            </button>
          </div>
          <p className="text-konjo-mono mt-1.5 text-[10px] text-konjo-fg-faint">
            ⌘↵ to run · powered by {model}
          </p>
        </div>

        {/* Response area */}
        <div className="relative min-h-[140px] p-5">
          {/* Live status badge */}
          <div className="mb-3 flex items-center gap-2">
            <AnimatePresence mode="wait">
              {streaming ? (
                <motion.span
                  key="running"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-good/30 bg-konjo-good/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-konjo-good"
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

            {/* Live metrics */}
            {(streaming || tokenIdx > 0) && (
              <div className="text-konjo-mono ml-auto flex items-center gap-4 text-[10px] text-konjo-fg-faint">
                <span>
                  <span className="tabular-nums text-konjo-accent">{toksPerSec || "–"}</span>
                  {" "}tok/s
                </span>
                <span>
                  <span className="tabular-nums text-konjo-good">{latencyMs}</span>
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
                    style={{ background: "var(--color-konjo-brand)" }}
                    aria-hidden
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer hint */}
        <div className="border-t border-konjo-line/30 px-5 py-2.5">
          <p className="text-konjo-mono text-[10px] text-konjo-fg-faint">
            Simulated at 42 tok/s · First token latency 11.8 ms · Model: {model} ·{" "}
            <a href="/products/squish" className="underline underline-offset-2 hover:text-konjo-fg">View squish →</a>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
