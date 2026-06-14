"use client";

import { motion } from "motion/react";
import { ease, severity as sevColor } from "@konjoai/ui";
import type { Severity } from "@konjoai/ui";

type EventKind = "deploy" | "ok" | "incident";

type StatusEvent = {
  kind: EventKind;
  product: string;
  message: string;
  ago: string;
  severity: Severity;
};

const EVENTS: StatusEvent[] = [
  { kind: "deploy",   product: "squish",  message: "v9.14.0 deployed — MLX path promoted to stable",          ago: "2h",  severity: "ok"   },
  { kind: "ok",       product: "kairu",   message: "p99 latency within SLO after speculative-decode tuning",  ago: "4h",  severity: "ok"   },
  { kind: "ok",       product: "toki",    message: "partially recovered — variance back within threshold",     ago: "17h", severity: "warn" },
  { kind: "incident", product: "toki",    message: "degraded — adversarial variance spike on boundary tests", ago: "19h", severity: "high" },
  { kind: "deploy",   product: "kyro",    message: "v1.2.0 deployed — GraphRAG path + OTel tracing",          ago: "3d",  severity: "ok"   },
  { kind: "deploy",   product: "vectro",  message: "v8.0.0 released — VQZ codec + Mojo SIMD backend",        ago: "5d",  severity: "ok"   },
];

const ICON: Record<EventKind, string> = {
  deploy:   "↑",
  ok:       "✓",
  incident: "⚠",
};

/** Recent portfolio events — incidents, deployments, recoveries — with staggered entrance. */
export function RecentEvents() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <p className="text-konjo-mono mb-4 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
        Recent events
      </p>
      <ol
        className="glass-konjo rounded-konjo-xl divide-y divide-konjo-line/50 overflow-hidden"
        aria-label="Portfolio event log"
      >
        {EVENTS.map((ev, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.35, ease: ease.kanjo, delay: i * 0.06 }}
            className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-konjo-surface/40"
          >
            {/* Status dot + icon */}
            <div
              className="text-konjo-mono mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
              style={{
                background: `color-mix(in oklch, ${sevColor[ev.severity]} 15%, transparent)`,
                color: sevColor[ev.severity],
              }}
              aria-hidden
            >
              {ICON[ev.kind]}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-konjo-mono text-xs font-semibold text-konjo-fg">
                  {ev.product}
                </span>
                <span className="text-xs text-konjo-fg-muted">{ev.message}</span>
              </div>
            </div>

            {/* Time */}
            <span className="text-konjo-mono shrink-0 text-[11px] text-konjo-fg-faint">
              {ev.ago} ago
            </span>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
