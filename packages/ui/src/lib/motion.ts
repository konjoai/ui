/**
 * Konjo motion presets — three named curves that govern how the portfolio moves.
 *
 *   kanjo   — 感情 — emotion / settle. Smooth, unhurried land. For state transitions.
 *   nehan   — 涅槃 — quick decisive arrival. For affordance feedback (hover, press).
 *   seishin — 精神 — steady spirit. For looping pulses, breathing UI, live signals.
 *
 * Pair `ease` curves with the `transition` presets for `motion`/`framer-motion`.
 */
import type { Transition } from "motion/react";

export const ease = {
  kanjo:   [0.16, 1, 0.3, 1] as const,
  nehan:   [0.4, 0, 0.2, 1] as const,
  seishin: [0.65, 0, 0.35, 1] as const,
};

export const transition = {
  kanjo:   { duration: 0.6, ease: ease.kanjo } satisfies Transition,
  nehan:   { duration: 0.18, ease: ease.nehan } satisfies Transition,
  seishin: { duration: 1.6, ease: ease.seishin, repeat: Infinity } satisfies Transition,
} as const;

export const variants = {
  fadeRise: {
    hidden:  { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: transition.kanjo },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: transition.kanjo },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1, transition: transition.kanjo },
  },
} as const;
