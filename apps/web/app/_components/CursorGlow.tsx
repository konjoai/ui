"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, motion, useReducedMotion } from "motion/react";

/**
 * Full-page ambient cursor glow — a soft radial gradient that follows the
 * pointer, giving the background a sense of depth and presence. Implemented
 * as a fixed overlay so it works across all pages without per-component setup.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(-800);
  const rawY = useMotionValue(-800);
  const x = useSpring(rawX, { stiffness: 55, damping: 22 });
  const y = useSpring(rawY, { stiffness: 55, damping: 22 });

  useEffect(() => {
    if (reduce) return;
    function onMove(e: MouseEvent) {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    }
    function onLeave() {
      rawX.set(-800);
      rawY.set(-800);
    }
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, rawX, rawY]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: "transparent",
        // We use x/y offset on the gradient via the style prop
      }}
    >
      <motion.div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x,
          y,
          width: 640,
          height: 640,
          background:
            "radial-gradient(circle, rgba(124,58,237,0.07) 0%, rgba(167,139,250,0.03) 40%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
