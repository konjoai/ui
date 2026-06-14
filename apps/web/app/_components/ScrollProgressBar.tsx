"use client";

import { useScroll, motion } from "motion/react";

/**
 * Thin brand-gradient line fixed to the top of the viewport that fills
 * left-to-right as the user scrolls down the page.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 right-0 z-50 h-[2px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background:
          "linear-gradient(90deg, var(--color-konjo-brand), var(--color-konjo-violet))",
      }}
      aria-hidden
    />
  );
}
