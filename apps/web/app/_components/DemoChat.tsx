"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { ScrambleText } from "./ScrambleText";

type Role = "user" | "assistant";

type ContextTag = {
  source: "kohaku" | "kyro";
  text: string;
};

type Message = {
  id: number;
  role: Role;
  content: string;
  streaming?: boolean;
  contextTags?: ContextTag[];
};

const GLYPH_SOURCE: Record<ContextTag["source"], { glyph: string; color: string; label: string }> = {
  kohaku: { glyph: "❖", color: "var(--color-konjo-good)",   label: "memory"    },
  kyro:   { glyph: "✸", color: "var(--color-konjo-accent)", label: "retrieval" },
};

type Turn = {
  user: string;
  assistantLines: string[];
  contextTags: ContextTag[];
  delayMs: number;
};

const SCRIPT: Turn[] = [
  {
    user: "How does attention work in transformers?",
    contextTags: [
      { source: "kyro",   text: "Vaswani 2017 §3.2 — Scaled dot-product attention" },
      { source: "kohaku", text: "Recalled: user prefers concise technical answers"   },
    ],
    assistantLines: [
      "Attention computes a weighted sum of values, where weights come from comparing a query to keys.",
      " The scaled dot-product: softmax(QK^T / √d_k)V.",
      " Multi-head attention runs this h times in parallel — each head attends to different subspaces.",
    ],
    delayMs: 55,
  },
  {
    user: "What makes the scaling by √d_k important?",
    contextTags: [
      { source: "kyro",   text: "Vaswani 2017 §3.2.1 — Motivation for scaling factor" },
      { source: "kohaku", text: "Context: previous turn discussed dot-product attention" },
    ],
    assistantLines: [
      "Without it, dot products grow large in high dimensions — the softmax saturates and gradients vanish.",
      " Dividing by √d_k keeps values in a range where softmax returns meaningful gradients.",
    ],
    delayMs: 50,
  },
  {
    user: "Show me the squish implementation",
    contextTags: [
      { source: "kyro",   text: "squish README §Attention — MLX-native implementation"   },
      { source: "kohaku", text: "Recalled: user is on Apple Silicon, prefers MLX path"    },
    ],
    assistantLines: [
      "In squish (MLX path):",
      "\n  scores = (q @ k.T) / math.sqrt(q.shape[-1])",
      "\n  attn = mx.softmax(scores, axis=-1)",
      "\n  out  = attn @ v",
      "\n\nThe Metal backend fuses the softmax and matmul for ~2× throughput vs eager mode.",
    ],
    delayMs: 42,
  },
];

const CHAR_MS_NORMAL = 22;

let msgId = 0;

function ContextBadge({ tag }: { tag: ContextTag }) {
  const src = GLYPH_SOURCE[tag.source];
  return (
    <div
      className="text-konjo-mono flex items-start gap-1.5 rounded-konjo border px-2 py-1"
      style={{
        borderColor: `color-mix(in oklch, ${src.color} 30%, transparent)`,
        background: `color-mix(in oklch, ${src.color} 8%, transparent)`,
      }}
    >
      <span className="text-[10px] leading-4 shrink-0" style={{ color: src.color }} aria-hidden>
        {src.glyph}
      </span>
      <div className="min-w-0">
        <span
          className="block text-[8px] uppercase tracking-[0.18em] mb-0.5"
          style={{ color: src.color }}
        >
          {src.label}
        </span>
        <span className="block text-[10px] text-konjo-fg-faint leading-relaxed">
          {tag.text}
        </span>
      </div>
    </div>
  );
}

function ChatMessage({ msg, reduce }: { msg: Message; reduce: boolean | null }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: ease.nehan }}
      className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
    >
      {/* Context tags — above assistant messages */}
      {!isUser && msg.contextTags && msg.contextTags.length > 0 && (
        <div className="flex flex-col gap-1 w-full max-w-[90%]">
          {msg.contextTags.map((tag, i) => (
            <ContextBadge key={i} tag={tag} />
          ))}
        </div>
      )}

      <div
        className={`max-w-[90%] rounded-konjo-lg px-3 py-2 text-sm leading-relaxed ${
          isUser
            ? "text-white"
            : "bg-konjo-surface/60 text-konjo-fg"
        }`}
        style={isUser ? { background: "var(--color-konjo-brand)" } : undefined}
      >
        <span className="text-konjo-mono text-[9px] uppercase tracking-widest block mb-1"
          style={{ color: isUser ? "rgba(255,255,255,0.55)" : "var(--color-konjo-fg-faint)" }}
        >
          {isUser ? "you" : "squish · mlx-4"}
        </span>
        <span className="whitespace-pre-wrap">{msg.content}</span>
        {msg.streaming && (
          <span
            className="konjo-pulse ml-px inline-block h-[0.85em] w-[1.5px] -mb-[1px] align-middle rounded-[1px]"
            style={{ background: "var(--color-konjo-accent)" }}
            aria-hidden
          />
        )}
      </div>
    </motion.div>
  );
}

/**
 * Multi-turn chat demo showing squish inference + kohaku memory + kyro retrieval
 * composing together. Context tags reveal which product contributed to each response.
 */
export function DemoChat() {
  const reduce = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [turnIdx, setTurnIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const runRef = useRef(0);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const streamAssistant = useCallback((
    turn: Turn,
    run: number,
    onDone: () => void,
  ) => {
    const id = ++msgId;
    const charMs = reduce ? 0 : turn.delayMs;
    const full = turn.assistantLines.join("");

    setMessages((prev) => [...prev, {
      id, role: "assistant", content: "", streaming: true, contextTags: turn.contextTags,
    }]);

    if (reduce) {
      setMessages((prev) => prev.map((m) =>
        m.id === id ? { ...m, content: full, streaming: false } : m,
      ));
      setTimeout(onDone, 80);
      return;
    }

    let charIdx = 0;
    const tick = setInterval(() => {
      if (runRef.current !== run) { clearInterval(tick); return; }
      charIdx++;
      setMessages((prev) => prev.map((m) =>
        m.id === id
          ? { ...m, content: full.slice(0, charIdx), streaming: charIdx < full.length }
          : m,
      ));
      if (charIdx >= full.length) {
        clearInterval(tick);
        setTimeout(onDone, 600);
      }
    }, charMs);
  }, [reduce]);

  const playTurn = useCallback((idx: number, run: number) => {
    if (idx >= SCRIPT.length || runRef.current !== run) return;
    const turn = SCRIPT[idx];

    // Add user message
    setMessages((prev) => [...prev, { id: ++msgId, role: "user", content: turn.user }]);
    setTurnIdx(idx);

    setTimeout(() => {
      if (runRef.current !== run) return;
      streamAssistant(turn, run, () => {
        if (idx + 1 < SCRIPT.length) {
          setTimeout(() => playTurn(idx + 1, run), 800);
        } else {
          setPhase("done");
        }
      });
    }, 600);
  }, [streamAssistant]);

  useEffect(() => {
    if (!inView || phase !== "idle") return;
    const run = ++runRef.current;
    setPhase("playing");
    setTimeout(() => playTurn(0, run), 500);
  }, [inView, phase, playTurn]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function replay() {
    const run = ++runRef.current;
    setMessages([]);
    setTurnIdx(0);
    setPhase("playing");
    setTimeout(() => playTurn(0, run), 300);
  }

  return (
    <section
      id="chat"
      ref={sectionRef}
      aria-label="Multi-turn chat demo"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8 flex items-end justify-between gap-4 flex-wrap"
      >
        <div>
          <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
            squish + kohaku + kyro · composed
          </p>
          <ScrambleText
            as="h2"
            text="Memory. Context. Generation."
            className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
            delay={120}
          />
          <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
            Every response is enriched: kyro retrieves relevant papers; kohaku injects
            what it remembers about you. squish generates the answer.
          </p>
        </div>

        {phase === "done" && (
          <button
            type="button"
            onClick={replay}
            className="text-konjo-mono shrink-0 flex items-center gap-1.5 rounded-konjo border border-konjo-line/50 bg-konjo-surface/60 px-3 py-1.5 text-xs text-konjo-fg-faint transition-colors hover:border-konjo-brand/40 hover:text-konjo-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
          >
            <span aria-hidden>↺</span> replay
          </button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.08 }}
        className="glass-konjo rounded-konjo-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-konjo-line/40 bg-konjo-surface/50 px-4 py-3">
          <span className="text-konjo-mono text-[10px] uppercase tracking-widest"
            style={{ color: "var(--color-konjo-brand)" }}>
            <span
              className="konjo-pulse mr-1.5 inline-block size-1.5 rounded-full"
              style={{ background: "var(--color-konjo-brand)" }}
              aria-hidden
            />
            squish · mlx-4 · 42 tok/s
          </span>
          <span className="text-konjo-mono ml-auto text-[10px] text-konjo-fg-faint">
            Turn {Math.min(turnIdx + 1, SCRIPT.length)}&thinsp;/&thinsp;{SCRIPT.length}
          </span>
        </div>

        {/* Chat body */}
        <div
          className="flex max-h-[460px] flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6"
          aria-live="polite"
          aria-atomic="false"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} reduce={reduce} />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Legend */}
        <div className="border-t border-konjo-line/30 bg-konjo-surface/30 px-4 py-2 flex flex-wrap gap-3">
          {Object.entries(GLYPH_SOURCE).map(([src, { glyph, color, label }]) => (
            <span key={src} className="text-konjo-mono flex items-center gap-1 text-[9px] uppercase tracking-widest"
              style={{ color }}>
              <span aria-hidden>{glyph}</span> {label}
            </span>
          ))}
          <span className="text-konjo-mono ml-auto text-[9px] text-konjo-fg-faint">
            tags show which product contributed
          </span>
        </div>
      </motion.div>
    </section>
  );
}
