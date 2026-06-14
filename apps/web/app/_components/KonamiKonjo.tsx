"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

const SEQUENCE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
];

/** Eight-glyph burst that radiates outward from center and fades. */
function GlyphBurst({ reduce }: { reduce: boolean | null }) {
  const glyphs = PRODUCTS.slice(0, 8).map((p) => p.glyph);
  const angles = glyphs.map((_, i) => (i / glyphs.length) * 360);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {glyphs.map((glyph, i) => {
        const angle = (angles[i] * Math.PI) / 180;
        const dx = Math.cos(angle) * 140;
        const dy = Math.sin(angle) * 100;
        return (
          <motion.span
            key={i}
            className="absolute select-none text-3xl"
            style={{ color: "var(--color-konjo-brand)" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
            animate={
              reduce
                ? { opacity: 0 }
                : { x: dx, y: dy, opacity: [1, 1, 0], scale: [0.5, 1.2, 0.8] }
            }
            transition={{
              duration: 1.1,
              delay: i * 0.04,
              ease: ease.kanjo,
            }}
          >
            {glyph}
          </motion.span>
        );
      })}
    </div>
  );
}

/**
 * Konami code Easter egg — ↑↑↓↓←→←→ba triggers a glyph burst and
 * displays the "根性 unlocked" message. Very Konjo.
 */
export function KonamiKonjo() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when focus is in a text field
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      setProgress((prev) => {
        if (e.key === SEQUENCE[prev]) {
          const next = prev + 1;
          if (next === SEQUENCE.length) {
            setTriggered(true);
            setTimeout(() => setTriggered(false), 3200);
            return 0;
          }
          return next;
        }
        return e.key === SEQUENCE[0] ? 1 : 0;
      });
    },
    [],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {triggered && (
        <motion.div
          key="konami"
          role="alert"
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop pulse */}
          {!reduce && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.12, 0] }}
              transition={{ duration: 0.6, times: [0, 0.15, 1] }}
              style={{
                background:
                  "radial-gradient(circle at center, rgba(124,58,237,1) 0%, transparent 70%)",
              }}
              aria-hidden
            />
          )}

          <GlyphBurst reduce={reduce} />

          <motion.div
            className="glass-konjo rounded-konjo-xl relative z-10 px-10 py-8 text-center shadow-2xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.35, ease: ease.kanjo, delay: reduce ? 0 : 0.1 }}
          >
            <p className="text-konjo-mono text-[11px] uppercase tracking-[0.3em] text-konjo-accent">
              Easter egg unlocked
            </p>
            <p
              className="text-konjo-display mt-2 text-4xl font-semibold tracking-tight"
              style={{ color: "var(--color-konjo-brand)" }}
            >
              根性
            </p>
            <p className="text-konjo-mono mt-2 text-sm text-konjo-fg-muted">
              Fighting spirit — you found the Konjo code.
            </p>
            <p className="text-konjo-mono mt-1 text-[11px] text-konjo-fg-faint">
              ↑↑↓↓←→←→ba
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
