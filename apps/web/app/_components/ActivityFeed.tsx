"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";

type FeedEvent = {
  id: number;
  slug: string;
  glyph: string;
  message: string;
  label: string;
  toneClass: string;
  dotColor: string;
  age: number; // seconds since fired
};

const EVENT_POOL: Omit<FeedEvent, "id" | "age">[] = [
  { slug: "squish",  glyph: "◐", message: "Decoded 512 tokens in 12.2 ms (42 tok/s)",           label: "throughput", toneClass: "text-konjo-accent",  dotColor: "var(--color-konjo-accent)"  },
  { slug: "kyro",    glyph: "✸", message: "Hybrid retrieval completed — NDCG@10 = 0.911",        label: "retrieval",  toneClass: "text-konjo-good",    dotColor: "var(--color-konjo-good)"    },
  { slug: "vectro",  glyph: "◇", message: "Compressed 2 048 vectors at 32× ratio (87% recall)", label: "codec",      toneClass: "text-konjo-good",    dotColor: "var(--color-konjo-good)"    },
  { slug: "kairu",   glyph: "▲", message: "p99 latency = 8.2 ms — within SLO budget",            label: "latency",    toneClass: "text-konjo-warm",    dotColor: "var(--color-konjo-warm)"    },
  { slug: "miru",    glyph: "◉", message: "Vision trace complete — 76% attention coverage",       label: "attention",  toneClass: "text-konjo-accent",  dotColor: "var(--color-konjo-accent)"  },
  { slug: "toki",    glyph: "✕", message: "Blocked 1 jailbreak probe (DAN v4.3)",                label: "safety",     toneClass: "text-konjo-hot",     dotColor: "var(--color-konjo-hot)"     },
  { slug: "kohaku",  glyph: "❖", message: "Recalled 3 episodic memories (half-life: 4.2 h)",     label: "recall",     toneClass: "text-konjo-violet",  dotColor: "var(--color-konjo-violet)"  },
  { slug: "lopi",    glyph: "⌬", message: "Agent task completed in 2 branches — merged",         label: "agent",      toneClass: "text-konjo-good",    dotColor: "var(--color-konjo-good)"    },
  { slug: "drex",    glyph: "✦", message: "Training loss = 0.072 — epoch 14/40 done",            label: "training",   toneClass: "text-konjo-accent",  dotColor: "var(--color-konjo-accent)"  },
  { slug: "squish",  glyph: "◐", message: "Prefill 1 024 tokens: 18 ms (Metal path)",            label: "prefill",    toneClass: "text-konjo-accent",  dotColor: "var(--color-konjo-accent)"  },
  { slug: "kyro",    glyph: "✸", message: "Semantic cache hit — latency 2.1 ms vs 68 ms",        label: "cache",      toneClass: "text-konjo-cool",    dotColor: "var(--color-konjo-cool)"    },
  { slug: "vectro",  glyph: "◇", message: "INT8 codec: 87 recall / 91 baseline — shipped",       label: "quality",    toneClass: "text-konjo-good",    dotColor: "var(--color-konjo-good)"    },
];

const MAX_EVENTS = 7;
let nextId = 0;

/**
 * Simulated real-time product activity feed.
 * New events trickle in every 2-4 s; old ones slide out once MAX_EVENTS is reached.
 */
export function ActivityFeed() {
  const reduce = useReducedMotion();
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [poolIdx, setPoolIdx] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const pushEvent = useCallback(() => {
    setEvents((prev) => {
      const template = EVENT_POOL[poolIdx % EVENT_POOL.length];
      const next: FeedEvent = { ...template, id: nextId++, age: 0 };
      return [next, ...prev].slice(0, MAX_EVENTS);
    });
    setPoolIdx((i) => i + 1);
    setTotalCount((n) => n + 1);
  }, [poolIdx]);

  // Initial batch + recurring trickle — pauses when hovering
  useEffect(() => {
    pushEvent();
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setEvents((prev) => prev.map((e) => ({ ...e, age: e.age + 1 })));
      if (Math.random() > 0.3) pushEvent();
    }, 2600);
    return () => clearInterval(id);
  }, [pushEvent]);

  return (
    <section
      id="activity"
      className="mx-auto max-w-6xl px-6 pb-16"
      aria-label="Live product activity feed"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-6 flex items-center gap-3"
      >
        <p className="text-konjo-mono text-xs uppercase tracking-[0.24em] text-konjo-fg-faint">
          Live activity
        </p>
        <span
          className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-good/30 bg-konjo-good/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-konjo-good"
          aria-label="Live stream"
        >
          <span className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good" aria-hidden />
          Stream
        </span>
        {paused && (
          <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            paused
          </span>
        )}
        {totalCount > 0 && (
          <span
            className="text-konjo-mono ml-auto text-[10px] tabular-nums text-konjo-fg-faint"
            aria-live="polite"
            aria-label={`${totalCount} events this session`}
          >
            {totalCount} event{totalCount !== 1 ? "s" : ""}
          </span>
        )}
      </motion.div>

      <ul
        role="list"
        className="flex flex-col gap-2"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence initial={false}>
          {events.map((ev) => (
            <motion.li
              key={ev.id}
              layout={!reduce}
              initial={reduce ? { opacity: 1 } : { opacity: 0, x: -16, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 16, height: 0 }}
              transition={{ duration: 0.35, ease: ease.nehan }}
              className="glass-konjo rounded-konjo group relative overflow-hidden"
            >
              <Link
                href={`/products/${ev.slug}`}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-konjo-surface/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-inset"
                aria-label={`${ev.slug}: ${ev.message}`}
              >
                <span
                  className="text-konjo-mono shrink-0 text-xl leading-none"
                  style={{ color: ev.dotColor }}
                  aria-hidden
                >
                  {ev.glyph}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-konjo-mono text-[11px] font-medium text-konjo-fg">
                      {ev.slug}
                    </span>
                    <span className={`text-konjo-mono text-xs tabular-nums ${ev.toneClass}`}>
                      {ev.message}
                    </span>
                  </div>
                </div>

                <div className="text-konjo-mono shrink-0 text-right">
                  <span className="block text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                    {ev.label}
                  </span>
                  <span className="block text-[10px] text-konjo-fg-faint tabular-nums">
                    {ev.age === 0 ? "now" : `${ev.age}s ago`}
                  </span>
                </div>

                <span
                  className="text-konjo-mono shrink-0 text-[11px] text-konjo-fg-faint opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                >
                  →
                </span>
              </Link>
              {/* Freshness decay bar — shrinks from full to empty over 10 s */}
              {!reduce && (
                <motion.div
                  className="absolute bottom-0 left-0 h-[1.5px] rounded-full"
                  style={{ background: ev.dotColor }}
                  initial={{ width: "100%", opacity: 0.5 }}
                  animate={{ width: `${Math.max(0, 100 - ev.age * 10)}%`, opacity: ev.age >= 10 ? 0 : 0.4 }}
                  transition={{ duration: 0.6, ease: "linear" }}
                  aria-hidden
                />
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
