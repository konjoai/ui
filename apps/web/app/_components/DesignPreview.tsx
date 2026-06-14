"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import { ease, cn } from "@konjoai/ui";
import { StreamSection }     from "./showcase/StreamSection";
import { MetricsSection }    from "./showcase/MetricsSection";
import { ComplianceSection } from "./showcase/ComplianceSection";
import { RankingsSection }   from "./showcase/RankingsSection";
import { ShellSection }      from "./showcase/ShellSection";
import { ScrambleText }      from "./ScrambleText";

type Block = {
  id: string;
  title: string;
  description: string;
  tag: string;
  live: boolean;
  Section: React.ComponentType;
};

const BLOCKS: Block[] = [
  {
    id: "stream",
    title: "Intelligence Stream",
    description: "Live RAG pipeline and attention-weighted token generation.",
    tag: "miru · kyro · squish",
    live: true,
    Section: StreamSection,
  },
  {
    id: "metrics",
    title: "Live Metrics",
    description: "Headline KPIs with animated gauges and delta indicators.",
    tag: "kairu · squish · vectro · kyro",
    live: true,
    Section: MetricsSection,
  },
  {
    id: "compliance",
    title: "Compliance Monitor",
    description: "EU AI Act article grid, RiskRing re-assessments, score vs. threshold.",
    tag: "squash",
    live: true,
    Section: ComplianceSection,
  },
  {
    id: "rankings",
    title: "Rankings & Charts",
    description: "Live throughput sparklines and scored result rankings.",
    tag: "kyro · toki · miru",
    live: true,
    Section: RankingsSection,
  },
  {
    id: "shell",
    title: "Shell & Layout",
    description: "Status indicators, feature tiles, and product hero across all nine pages.",
    tag: "all products",
    live: false,
    Section: ShellSection,
  },
];

/** Interactive tabbed showcase of the @konjoai/ui design system. */
export function DesignPreview() {
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState("stream");
  const active = BLOCKS.find((b) => b.id === activeId) ?? BLOCKS[0];
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const smoothSpotX = useSpring(spotX, { stiffness: 80, damping: 20 });
  const smoothSpotY = useSpring(spotY, { stiffness: 80, damping: 20 });

  function handlePanelMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  }

  function handlePanelMouseLeave() {
    spotX.set(-999);
    spotY.set(-999);
  }

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % BLOCKS.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + BLOCKS.length) % BLOCKS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = BLOCKS.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      setActiveId(BLOCKS[nextIdx].id);
      tabRefs.current[nextIdx]?.focus();
    }
  }, []);

  return (
    <section
      id="design"
      aria-label="Design system showcase"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: ease.kanjo }}
        className="mb-8"
      >
        <div className="mb-3 flex items-center gap-3">
          <p className="text-konjo-mono text-xs uppercase tracking-[0.24em] text-konjo-accent">
            @konjoai/ui · 14 components · 5 sections · all live
          </p>
          <span
            className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-good/30 bg-konjo-good/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-konjo-good"
            aria-label="All sections streaming live data"
          >
            <span className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good" aria-hidden />
            Live
          </span>
        </div>
        <ScrambleText
          as="h2"
          text="Live design system"
          className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={100}
        />
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Every primitive, alive. Five sections streaming real-time data — the shared visual language powering all nine products.
        </p>
      </motion.div>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15, ease: ease.kanjo }}
        className="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Design system sections"
      >
        {BLOCKS.map((block, idx) => {
          const isActive = block.id === activeId;
          return (
            <button
              key={block.id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${block.id}`}
              id={`tab-${block.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(block.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={cn(
                "text-konjo-mono relative inline-flex items-center gap-2 rounded-konjo border px-3.5 py-2 text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-offset-1",
                isActive
                  ? "border-konjo-brand/50 bg-konjo-brand/10 text-konjo-fg"
                  : "border-konjo-line/40 bg-konjo-surface/20 text-konjo-fg-muted hover:border-konjo-line hover:text-konjo-fg",
              )}
            >
              {block.live && (
                <span
                  className={cn(
                    "inline-block size-1.5 rounded-full transition-colors",
                    isActive ? "bg-konjo-good" : "bg-konjo-fg-faint",
                  )}
                  aria-hidden
                />
              )}
              {block.title}
            </button>
          );
        })}
      </motion.div>

      {/* Active section description */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-konjo-fg-muted">{active.description}</p>
        <span className="text-konjo-mono shrink-0 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          {active.tag}
        </span>
      </div>

      {/* Tabpanel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          id={`panel-${activeId}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeId}`}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: ease.nehan }}
        >
          <motion.div
            ref={panelRef}
            className="glass-konjo rounded-konjo-xl relative overflow-hidden p-6 sm:p-8"
            whileHover={reduce ? undefined : {
              boxShadow: "0 0 0 1px rgba(124,58,237,0.22), 0 0 48px -10px rgba(124,58,237,0.15)",
              transition: { duration: 0.25 },
            }}
            onMouseMove={handlePanelMouseMove}
            onMouseLeave={handlePanelMouseLeave}
          >
            {/* Cursor spotlight overlay */}
            {!reduce && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  x: smoothSpotX,
                  y: smoothSpotY,
                  width: 320,
                  height: 320,
                  background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)",
                }}
              />
            )}
            <active.Section />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
