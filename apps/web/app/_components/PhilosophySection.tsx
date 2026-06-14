"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "motion/react";
import { ease } from "@konjoai/ui";
import { ScrambleText } from "./ScrambleText";

const PILLARS = [
  {
    word: "ቆንጆ",
    roman: "Konjo",
    lang: "Amharic",
    meaning: "Beauty, elegance",
    detail: "Craft that earns its complexity. Every surface deliberate, every pixel intentional.",
    color: "var(--color-konjo-brand-soft)",
  },
  {
    word: "根性",
    roman: "Konjō",
    lang: "Japanese",
    meaning: "Fighting spirit, grit",
    detail: "Ship when it hurts. Refine past good enough. Never stop at the first answer.",
    color: "var(--color-konjo-accent)",
  },
  {
    word: "康宙",
    roman: "Kāngzhòu",
    lang: "Chinese",
    meaning: "System health",
    detail: "Observability is first-class. Every metric visible. Every failure recoverable.",
    color: "var(--color-konjo-good)",
  },
  {
    word: "건조",
    roman: "Geonjo",
    lang: "Korean",
    meaning: "Strip to essence",
    detail: "Remove until removal breaks it. Zero ceremony. No dead code. No wasted motion.",
    color: "var(--color-konjo-warm)",
  },
] as const;

type Pillar = (typeof PILLARS)[number];

/**
 * Single pillar card — the large CJK word shifts via inner parallax on mouse move,
 * creating a tactile depth effect without rotating the whole card.
 */
function PillarCard({
  pillar,
  index,
  onHoverEnter,
  onHoverLeave,
}: {
  pillar: Pillar;
  index: number;
  onHoverEnter?: () => void;
  onHoverLeave?: () => void;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const wordX = useSpring(rawX, { stiffness: 180, damping: 28 });
  const wordY = useSpring(rawY, { stiffness: 180, damping: 28 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 14);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 9);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    onHoverLeave?.();
  }

  return (
    <motion.div
      ref={cardRef}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: ease.kanjo, delay: index * 0.09 }}
      whileHover={reduce ? undefined : {
        boxShadow: `0 0 0 1px color-mix(in oklch, ${pillar.color} 30%, transparent), 0 0 40px -12px color-mix(in oklch, ${pillar.color} 20%, transparent)`,
        transition: { duration: 0.25 },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onHoverEnter}
      onMouseLeave={handleMouseLeave}
      className="glass-konjo rounded-konjo-xl overflow-hidden p-6"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Large CJK word with inner parallax — moves independently of the card */}
        <motion.span
          style={{ x: wordX, y: wordY, color: pillar.color }}
          className="text-konjo-display text-5xl font-semibold leading-none select-none"
          aria-label={`${pillar.word} (${pillar.lang})`}
        >
          {pillar.word}
        </motion.span>
        <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint shrink-0">
          {pillar.lang}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-konjo-mono text-base font-medium" style={{ color: pillar.color }}>
          {pillar.roman}
        </p>
        <p className="text-konjo-display mt-0.5 text-xl font-semibold tracking-tight">
          {pillar.meaning}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-konjo-fg-muted">
          {pillar.detail}
        </p>
      </div>
    </motion.div>
  );
}

/** Typographic section showcasing the four Konjo values with animated entrance. */
export function PhilosophySection() {
  const reduce = useReducedMotion();
  const [bgIdx, setBgIdx] = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Auto-cycle background glyph when no card is hovered
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      if (hoverIdx === null) setBgIdx((i) => (i + 1) % PILLARS.length);
    }, 3200);
    return () => clearInterval(id);
  }, [hoverIdx, reduce]);

  const activeBgIdx = hoverIdx ?? bgIdx;

  return (
    <section
      id="philosophy"
      className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-24"
      aria-label="The Konjo philosophy"
    >
      {/* Large faint CJK watermark cycling through pillars */}
      {!reduce && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={activeBgIdx}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.8, ease: ease.kanjo }}
              className="text-konjo-display select-none leading-none"
              style={{
                fontSize: "clamp(14rem, 40vw, 28rem)",
                color: PILLARS[activeBgIdx].color,
                opacity: 0.035,
                filter: "blur(1px)",
              }}
            >
              {PILLARS[activeBgIdx].word}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-10"
      >
        <p className="text-konjo-mono text-xs uppercase tracking-[0.24em] text-konjo-accent">
          Four words · one way
        </p>
        <ScrambleText
          as="h2"
          text="The Konjo philosophy"
          className="text-konjo-display mt-1 text-3xl font-semibold tracking-tight sm:text-4xl"
          delay={100}
        />
        <p className="mt-2 max-w-xl text-sm text-konjo-fg-muted">
          Each product, each component, each commit — measured against all four.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar, i) => (
          <PillarCard
            key={pillar.roman}
            pillar={pillar}
            index={i}
            onHoverEnter={() => { setHoverIdx(i); setBgIdx(i); }}
            onHoverLeave={() => setHoverIdx(null)}
          />
        ))}
      </div>
    </section>
  );
}
