"use client";

import { useScroll, useSpring, motion, useReducedMotion } from "motion/react";

/**
 * Thin brand-gradient bar fixed to the viewport top that fills left-to-right
 * as the user scrolls. Spring-smoothed for a silky feel; glow via box-shadow.
 * Reduced-motion: raw scrollYProgress (no spring, no glow).
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const reduce = useReducedMotion();
  const smoothed = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] origin-left"
      style={{
        scaleX: reduce ? scrollYProgress : smoothed,
        background:
          "linear-gradient(90deg, var(--color-konjo-brand), var(--color-konjo-violet), var(--color-konjo-accent))",
        boxShadow: reduce
          ? undefined
          : "0 0 8px 1px var(--color-konjo-brand-glow)",
      }}
      aria-hidden
    />
  );
}
