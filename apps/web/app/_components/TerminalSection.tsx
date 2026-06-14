"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "motion/react";
import { ease } from "@konjoai/ui";
import { ScrambleText } from "./ScrambleText";

type TermKind = "cmd" | "out" | "gap";

type TermLine = {
  kind: TermKind;
  text: string;
  pauseAfter?: number;
};

type DisplayLine = TermLine & { chars: number };

const SCRIPT: TermLine[] = [
  { kind: "cmd", text: "squish generate --model mlx-4 --stream",                pauseAfter: 420 },
  { kind: "out", text: "  ▶  MLX path · 847 tok/s · p50 12ms · p99 28ms",     pauseAfter: 80  },
  { kind: "out", text: '  "The attention mechanism enables arbitrary scale..."' },
  { kind: "gap", text: "" },
  { kind: "cmd", text: 'kyro search "attention is all you need" --top-k 5',      pauseAfter: 360 },
  { kind: "out", text: "  ▶  5 chunks · confidence 0.94 · 18ms",               pauseAfter: 80  },
  { kind: "out", text: "  [1] Vaswani 2017 §3.2  score 0.97" },
  { kind: "gap", text: "" },
  { kind: "cmd", text: "vectro compress vecs.npy --codec VQZ --ratio 4x",        pauseAfter: 360 },
  { kind: "out", text: "  ▶  2048-dim → 512-dim · 12.4 MB → 3.1 MB · 99.2%", pauseAfter: 80  },
  { kind: "out", text: "  Mojo SIMD backend · 2.4 s · fidelity preserved"       },
];

const CHAR_MS = 36;
const OUT_MS  = 100;
const END_MS  = 2800;

const CLI_FEATURES: { icon: string; title: string; desc: string }[] = [
  { icon: "→", title: "Streaming",   desc: "Token-by-token output with backpressure. Pipe anywhere." },
  { icon: "◈", title: "Composable",  desc: "Unix-style. Chain squish | kyro | vectro in one step."  },
  { icon: "◐", title: "Metrics",     desc: "Every command reports throughput, latency, and memory."  },
  { icon: "◇", title: "Auth-aware",  desc: "konjo-auth handles keys, scopes, and rotation."          },
];

/** Animated CLI showcase — types out three product commands in sequence and loops. */
export function TerminalSection() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [lines, setLines] = useState<DisplayLine[]>([]);
  const [replayCount, setReplayCount] = useState(0);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runRef = useRef(0);

  const copyCmd = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCmd(text);
      document.dispatchEvent(new CustomEvent("konjo:toast", {
        detail: { message: "Command copied to clipboard", tone: "success" },
      }));
      setTimeout(() => setCopiedCmd(null), 2000);
    }).catch(() => {/* clipboard blocked */});
  }, []);

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      setLines(SCRIPT.map((l) => ({ ...l, chars: l.text.length })));
      return;
    }

    const run = ++runRef.current;
    setLines([]);

    function clear() {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    function schedule(fn: () => void, ms: number) {
      clear();
      timerRef.current = setTimeout(() => {
        if (runRef.current === run) fn();
      }, ms);
    }

    function step(lineIdx: number, charIdx: number): void {
      if (lineIdx >= SCRIPT.length) {
        // Loop once then stop — manual replay via button
        return;
      }

      const line = SCRIPT[lineIdx];

      if (line.kind === "cmd") {
        if (charIdx === 0) {
          setLines((prev) => [...prev, { ...line, chars: 0 }]);
          schedule(() => step(lineIdx, 1), line.pauseAfter ?? 0);
        } else if (charIdx <= line.text.length) {
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = { ...next[next.length - 1], chars: charIdx };
            return next;
          });
          schedule(() => step(lineIdx, charIdx + 1), CHAR_MS);
        } else {
          step(lineIdx + 1, 0);
        }
      } else {
        schedule(() => {
          setLines((prev) => [...prev, { ...line, chars: line.text.length }]);
          schedule(() => step(lineIdx + 1, 0), line.pauseAfter ?? OUT_MS);
        }, OUT_MS);
      }
    }

    schedule(() => step(0, 0), replayCount === 0 ? 600 : 120);

    return () => {
      clear();
      ++runRef.current;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, replayCount]);

  const lastLine = lines[lines.length - 1];
  const isTypingCmd =
    lastLine?.kind === "cmd" && lastLine.chars < lastLine.text.length;

  return (
    <section
      id="terminal"
      ref={sectionRef}
      aria-label="Product CLI showcase"
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
          konjo-cli · open-source toolchain
        </p>
        <ScrambleText
          as="h2"
          text="Ship from the terminal"
          className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={120}
        />
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Every product ships a first-class CLI. Inference, retrieval,
          compression — composable and scriptable.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.1 }}
          className="glass-konjo rounded-konjo-xl overflow-hidden border border-konjo-line/50"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-konjo-line/40 bg-konjo-surface/60 px-4 py-3">
            <span className="size-3 rounded-full" style={{ background: "#ff5f57" }} aria-hidden />
            <span className="size-3 rounded-full" style={{ background: "#febc2e" }} aria-hidden />
            <span className="size-3 rounded-full" style={{ background: "#28c840" }} aria-hidden />
            <span className="text-konjo-mono ml-2 flex-1 text-center text-[11px] text-konjo-fg-faint">
              konjo — bash
            </span>
            <button
              type="button"
              onClick={() => setReplayCount((n) => n + 1)}
              aria-label="Replay terminal demo"
              className="text-konjo-mono flex items-center gap-1 rounded border border-konjo-line/40 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-konjo-fg-faint transition-colors hover:border-konjo-line hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
            >
              <span aria-hidden>↺</span> replay
            </button>
          </div>

          {/* Terminal body */}
          <div
            className="text-konjo-mono min-h-[260px] px-5 py-4 text-[13px] leading-6"
            aria-live="polite"
            aria-atomic="false"
            aria-label="CLI output"
          >
            {lines.map((line, i) =>
              line.kind === "cmd" ? (
                <div key={i} className="group/line relative flex items-start justify-between gap-2">
                  <p className="flex-1">
                    <span style={{ color: "var(--color-konjo-brand)" }}>❯ </span>
                    <span className="text-konjo-fg">{line.text.slice(0, line.chars)}</span>
                    {line.chars < line.text.length && (
                      <span
                        className="konjo-pulse ml-px inline-block h-[0.9em] w-[1.5px] -mb-[1px] align-middle rounded-[1px]"
                        style={{ background: "var(--color-konjo-brand)" }}
                        aria-hidden
                      />
                    )}
                  </p>
                  {line.chars === line.text.length && (
                    <AnimatePresence>
                      <motion.button
                        key="copy"
                        type="button"
                        onClick={() => copyCmd(line.text)}
                        aria-label={`Copy command: ${line.text}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="shrink-0 rounded border border-konjo-line/30 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-konjo-fg-faint opacity-0 transition-all group-hover/line:opacity-100 hover:border-konjo-brand/40 hover:text-konjo-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
                      >
                        {copiedCmd === line.text ? "✓" : "copy"}
                      </motion.button>
                    </AnimatePresence>
                  )}
                </div>
              ) : line.kind === "gap" ? (
                <div key={i} className="h-2" />
              ) : (
                <p key={i} className="text-konjo-fg-muted">{line.text}</p>
              )
            )}
            {!isTypingCmd && (
              <p>
                <span style={{ color: "var(--color-konjo-brand)" }}>❯ </span>
                <span
                  className="konjo-pulse inline-block h-[0.9em] w-[1.5px] -mb-[1px] align-middle rounded-[1px]"
                  style={{ background: "var(--color-konjo-brand)" }}
                  aria-hidden
                />
              </p>
            )}
          </div>
        </motion.div>

        {/* Feature list */}
        <ul role="list" className="flex flex-col gap-3 self-start">
          {CLI_FEATURES.map(({ icon, title, desc }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: ease.kanjo, delay: 0.2 + i * 0.07 }}
              className="glass-konjo rounded-konjo p-4 text-sm"
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  aria-hidden
                  className="text-konjo-mono font-semibold"
                  style={{ color: "var(--color-konjo-brand-soft)" }}
                >
                  {icon}
                </span>
                <span className="font-medium text-konjo-fg">{title}</span>
              </div>
              <p className="text-konjo-fg-muted leading-relaxed">{desc}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
