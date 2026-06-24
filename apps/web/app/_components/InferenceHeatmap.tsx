"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ease, severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";
import { ScrambleText } from "./ScrambleText";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

/** Deterministic seeded load — avoids SSR/client hydration mismatch. */
function seedLoad(): number[][] {
  return PRODUCTS.map((_, pi) =>
    HOURS.map((h) => {
      const bell = Math.max(0, Math.sin(((h - 6) / 18) * Math.PI));
      const noise = (Math.sin(pi * 17.3 + h * 7.1) * 0.5 + 0.5) * 0.28;
      return Math.min(0.97, bell * 0.68 + noise + 0.06);
    }),
  );
}

function loadBg(v: number, col: string): string {
  const pct = Math.round(v * 80 + 6);
  return `color-mix(in oklch, ${col} ${pct}%, transparent)`;
}

type Hover = { row: number; col: number } | null;

/**
 * 9×24 inference load heatmap — each cell encodes request density for
 * one product over one hour in a rolling 24-hour window.
 * Cells subtly fluctuate every 2 s to convey live data.
 */
export function InferenceHeatmap() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [load, setLoad] = useState<number[][]>(seedLoad);
  const [hover, setHover] = useState<Hover>(null);

  // Jitter 3 random cells every 2 s to convey live fluctuation
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setLoad((prev) => {
        const next = prev.map((row) => [...row]);
        for (let k = 0; k < 3; k++) {
          const ri = Math.floor(Math.random() * PRODUCTS.length);
          const ci = Math.floor(Math.random() * 24);
          next[ri][ci] = Math.max(
            0.04,
            Math.min(0.97, next[ri][ci] + (Math.random() - 0.5) * 0.14),
          );
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [reduce]);

  const hoveredProduct = hover !== null ? PRODUCTS[hover.row] : null;
  const hoveredLoad = hover !== null ? load[hover.row][hover.col] : null;

  return (
    <section
      id="heatmap"
      ref={ref}
      aria-label="Inference load heatmap"
      className="mx-auto max-w-6xl px-6 pb-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8"
      >
        <p className="text-konjo-mono mb-3 text-xs uppercase tracking-[0.24em] text-konjo-accent">
          inference load · 9 channels · 24 h rolling
        </p>
        <ScrambleText
          as="h2"
          text="Live inference grid"
          className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={150}
        />
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Request density across all nine channels over a rolling 24-hour window.
          Brighter cells = heavier load. Hover for a precise reading.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: ease.kanjo, delay: 0.1 }}
        className="glass-konjo rounded-konjo-xl overflow-hidden"
      >
        {/* Monitor header */}
        <div className="flex min-h-[36px] items-center justify-between border-b border-konjo-line/30 bg-konjo-surface/40 px-5 py-2">
          <div className="flex items-center gap-2">
            {!reduce && (
              <span
                className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good"
                aria-hidden
              />
            )}
            <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-good">
              Live
            </span>
          </div>
          {hover && hoveredProduct ? (
            <motion.span
              key={`${hover.row}-${hover.col}`}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="text-konjo-mono text-[10px] text-konjo-fg-muted"
            >
              <span
                style={{ color: sevColor[hoveredProduct.metric.severity] }}
                aria-hidden
              >
                {hoveredProduct.glyph}
              </span>{" "}
              {hoveredProduct.slug} ·{" "}
              {String(hover.col).padStart(2, "0")}:00 UTC ·{" "}
              <span
                style={{ color: sevColor[hoveredProduct.metric.severity] }}
              >
                {Math.round((hoveredLoad ?? 0) * 100)}%
              </span>{" "}
              load
            </motion.span>
          ) : (
            <span className="text-konjo-mono text-[10px] text-konjo-fg-faint">
              00:00 → 23:00 UTC
            </span>
          )}
        </div>

        {/* Heatmap rows */}
        <div className="space-y-1 px-4 py-4" role="grid" aria-label="Inference load grid">
          {PRODUCTS.map((product, ri) => {
            const col = sevColor[product.metric.severity];
            return (
              <motion.div
                key={product.slug}
                role="row"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.38,
                  ease: ease.kanjo,
                  delay: inView ? ri * 0.04 : 0,
                }}
                className="flex items-center gap-2"
              >
                {/* Row label */}
                <div
                  className="flex w-[72px] shrink-0 items-center gap-1.5"
                  role="rowheader"
                >
                  <span
                    className="text-base leading-none"
                    style={{ color: col }}
                    aria-hidden
                  >
                    {product.glyph}
                  </span>
                  <span className="text-konjo-mono text-[9px] text-konjo-fg-faint">
                    {product.slug}
                  </span>
                </div>

                {/* Heat cells */}
                <div
                  className="flex flex-1 items-stretch gap-px"
                  role="gridcell"
                >
                  {HOURS.map((h) => {
                    const v = load[ri][h];
                    const isHovered = hover?.row === ri && hover?.col === h;
                    return (
                      <div
                        key={h}
                        role="presentation"
                        aria-label={`${product.slug} at ${h}:00 — ${Math.round(v * 100)}% load`}
                        className="h-4 min-w-0 flex-1 cursor-crosshair rounded-[2px]"
                        style={{
                          background: loadBg(v, col),
                          transition: reduce
                            ? undefined
                            : "background 0.9s ease, box-shadow 0.1s",
                          boxShadow: isHovered
                            ? `0 0 0 1px ${col}`
                            : undefined,
                        }}
                        onMouseEnter={() => setHover({ row: ri, col: h })}
                        onMouseLeave={() => setHover(null)}
                      />
                    );
                  })}
                </div>

                {/* Right label: current hour load */}
                <div className="w-8 shrink-0 text-right">
                  <span
                    className="text-konjo-mono text-[9px] tabular-nums"
                    style={{ color: col }}
                    aria-hidden
                  >
                    {Math.round(load[ri][new Date().getHours()] * 100)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hour axis */}
        <div className="flex items-center border-t border-konjo-line/20 px-4 pb-3 pt-1">
          {/* Offset for row label */}
          <div className="w-[72px] shrink-0 pr-2" />
          <div className="flex flex-1 gap-px">
            {HOURS.map((h) => (
              <div key={h} className="flex-1">
                {h % 6 === 0 && (
                  <span className="text-konjo-mono block text-[8px] text-konjo-fg-faint">
                    {String(h).padStart(2, "0")}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="w-8 shrink-0" />
        </div>
      </motion.div>
    </section>
  );
}
