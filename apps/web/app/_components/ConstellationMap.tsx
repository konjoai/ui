"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease, severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";
import { ScrambleText } from "./ScrambleText";

// ─── layout constants ─────────────────────────────────────────────────────────

const VW = 600;
const VH = 400;
const CX = VW / 2;
const CY = VH / 2 - 10;
const R = 145;

/** Fixed slug order around the ring (clockwise from top). */
const SLUG_ORDER = [
  "squish", "vectro", "kyro", "kairu", "miru",
  "toki", "kohaku", "lopi", "drex",
] as const;

type SlugKey = typeof SLUG_ORDER[number];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p])) as Record<
  SlugKey,
  (typeof PRODUCTS)[number]
>;

/** Pre-computed node positions — start at 12 o'clock, clockwise. */
const NODES = SLUG_ORDER.map((slug, i) => {
  const angle = (i / SLUG_ORDER.length) * 2 * Math.PI - Math.PI / 2;
  return {
    slug,
    x: CX + R * Math.cos(angle),
    y: CY + R * Math.sin(angle),
    product: PRODUCT_MAP[slug],
  };
});

/** Pairs to connect with lines — ring + a few diagonals for depth. */
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0],
  [0, 3], [2, 7], [4, 8],
];

// ─── component ───────────────────────────────────────────────────────────────

/** Network graph of the nine KonjoAI products — hover to highlight connections. */
export function ConstellationMap() {
  const [active, setActive] = useState<SlugKey | null>(null);
  const [autoSlug, setAutoSlug] = useState<SlugKey | null>(null);
  const reduce = useReducedMotion();

  // Auto-cycle through products when no node is being hovered
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      if (!active) {
        setAutoSlug(SLUG_ORDER[i % SLUG_ORDER.length]);
        i++;
      }
    }, 2600);
    return () => clearInterval(id);
  }, [active, reduce]);

  // The "display" active node — user hover takes priority over auto-cycle
  const displaySlug = active ?? autoSlug;

  const activeIdx = displaySlug ? SLUG_ORDER.indexOf(displaySlug) : -1;
  const connectedIdx = new Set<number>(
    activeIdx >= 0
      ? EDGES.filter(([a, b]) => a === activeIdx || b === activeIdx).flatMap(([a, b]) => [a, b])
      : [],
  );

  return (
    <section
      id="constellation"
      className="mx-auto max-w-6xl px-6 pb-16"
      aria-label="Product constellation map"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-6"
      >
        <p className="text-konjo-mono text-xs uppercase tracking-[0.24em] text-konjo-accent">
          Nine products · one design system
        </p>
        <ScrambleText
          as="h2"
          text="The constellation"
          className="text-konjo-display mt-1 text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={200}
        />
        <p className="mt-2 text-sm text-konjo-fg-muted">
          Hover any node to trace its connections. Click to dive in.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: ease.kanjo, delay: 0.1 }}
        className="glass-konjo rounded-konjo-xl overflow-hidden"
      >
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          className="w-full"
          role="img"
          aria-label="Interactive map of KonjoAI products"
        >
          {/* Grid of subtle dots */}
          <defs>
            <pattern id="konjo-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="0.8" fill="rgba(124,58,237,0.12)" />
            </pattern>
          </defs>
          <rect width={VW} height={VH} fill="url(#konjo-dot-grid)" />

          {/* Edges */}
          {EDGES.map(([a, b], i) => {
            const na = NODES[a];
            const nb = NODES[b];
            const lit =
              activeIdx >= 0 && (a === activeIdx || b === activeIdx);
            return (
              <line
                key={i}
                x1={na.x} y1={na.y}
                x2={nb.x} y2={nb.y}
                stroke={lit ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.12)"}
                strokeWidth={lit ? 1.5 : 1}
                className={lit && !reduce ? "konjo-edge-flow" : undefined}
                style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
              />
            );
          })}

          {/* Center hub — shows portfolio stats at rest, product info on hover */}
          <motion.g
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {/* Slow rotating outer ring */}
            {!reduce && (
              <motion.circle
                cx={CX} cy={CY} r={44}
                fill="none"
                stroke="rgba(124,58,237,0.18)"
                strokeWidth="1"
                strokeDasharray="6 10"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
              />
            )}
            <circle cx={CX} cy={CY} r={38} fill="rgba(10,8,18,0.92)" stroke="rgba(124,58,237,0.4)" strokeWidth="1" />
            <circle cx={CX} cy={CY} r={34} fill="none" stroke="rgba(124,58,237,0.12)" strokeWidth="0.5" />
            {/* Hub label — foreignObject for smooth AnimatePresence crossfade */}
            <foreignObject x={CX - 34} y={CY - 26} width="68" height="52" style={{ overflow: "visible" }}>
              <AnimatePresence mode="wait">
                {displaySlug ? (
                  <motion.div
                    key={displaySlug}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22 }}
                    className="flex flex-col items-center justify-center"
                    style={{ fontFamily: "monospace", userSelect: "none" }}
                  >
                    <span style={{ fontSize: 15, color: "rgba(167,139,250,0.95)", lineHeight: 1 }}>
                      {PRODUCT_MAP[displaySlug].glyph}
                    </span>
                    <span style={{ fontSize: 9.5, fontWeight: 600, color: sevColor[PRODUCT_MAP[displaySlug].metric.severity], letterSpacing: "0.03em", marginTop: 4 }}>
                      {PRODUCT_MAP[displaySlug].metric.value}{PRODUCT_MAP[displaySlug].metric.unit}
                    </span>
                    <span style={{ fontSize: 7, color: "rgba(110,100,150,0.75)", letterSpacing: "0.06em", marginTop: 2 }}>
                      {PRODUCT_MAP[displaySlug].metric.label.toUpperCase()}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center"
                    style={{ fontFamily: "monospace", userSelect: "none" }}
                  >
                    <span style={{ fontSize: 9.5, color: "rgba(167,139,250,0.85)", letterSpacing: "0.1em" }}>KonjoAI</span>
                    <span style={{ fontSize: 7.5, color: "rgba(100,90,140,0.55)", letterSpacing: "0.06em", marginTop: 3 }}>9 products</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </foreignObject>
          </motion.g>

          {/* Nodes */}
          {NODES.map(({ slug, x, y, product }, i) => {
            const col = sevColor[product.metric.severity];
            const isActive = slug === displaySlug;
            const isConnected = connectedIdx.has(i);
            // Only dim when the user is actively hovering (not during auto-cycle)
            const dim = !!active && !isActive && !isConnected;

            return (
              <motion.g
                key={slug}
                style={{ transformOrigin: `${x}px ${y}px`, cursor: "pointer" }}
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0 }}
                animate={{ opacity: dim ? 0.3 : 1, scale: 1 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { delay: i * 0.06, duration: 0.35, ease: "easeOut" }
                }
                onMouseEnter={() => setActive(slug as SlugKey)}
                onMouseLeave={() => setActive(null)}
              >
                <a href={`/products/${slug}`} aria-label={`${product.name} — ${product.status}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-konjo-accent rounded-full">
                  {/* Gentle breathing ring when idle */}
                  {!isActive && !reduce && (
                    <motion.circle
                      cx={x} cy={y}
                      fill="none"
                      stroke="rgba(124,58,237,0.18)"
                      strokeWidth="1"
                      initial={{ r: 22, opacity: 0 }}
                      animate={{ r: [22, 27, 22], opacity: [0.5, 0.1, 0.5] }}
                      transition={{
                        duration: 3 + (i % 3) * 0.8,
                        delay: i * 0.25,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  {/* Outer glow ring when active */}
                  {isActive && (
                    <motion.circle
                      cx={x} cy={y} r={30}
                      fill="none"
                      stroke={col}
                      strokeWidth="1"
                      initial={{ opacity: 0, r: 20 }}
                      animate={{ opacity: 0.45, r: 30 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}

                  {/* Node body */}
                  <circle
                    cx={x} cy={y} r={20}
                    fill="rgba(10,8,18,0.85)"
                    stroke={isActive ? col : "rgba(124,58,237,0.28)"}
                    strokeWidth={isActive ? 2 : 1}
                    style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                  />

                  {/* Glyph */}
                  <text
                    x={x} y={y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="13"
                    fill={isActive ? col : "rgba(167,139,250,0.85)"}
                    style={{ transition: "fill 0.2s", fontFamily: "monospace" }}
                  >
                    {product.glyph}
                  </text>

                  {/* Slug label */}
                  <text
                    x={x}
                    y={y + 36}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="8.5"
                    letterSpacing="0.06em"
                    fill={isActive ? "rgba(220,210,255,0.9)" : "rgba(140,130,170,0.6)"}
                    style={{ transition: "fill 0.2s", fontFamily: "monospace" }}
                  >
                    {slug}
                  </text>
                </a>
              </motion.g>
            );
          })}
        </svg>
      </motion.div>
    </section>
  );
}
