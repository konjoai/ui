"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type Tone = "good" | "warm" | "violet";

const TONE_CLS: Record<Tone, string> = {
  good:   "text-konjo-good",
  warm:   "text-konjo-warm",
  violet: "text-konjo-violet",
};

interface AnimatedStatusStatProps {
  label: string;
  value: number;
  tone: Tone;
}

/** Count-up stat card for the status page hero — animates once on viewport entry. */
export function AnimatedStatusStat({ label, value, tone }: AnimatedStatusStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(value); return; }
    const ctrl = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => ctrl.stop();
  }, [inView, value, reduce]);

  return (
    <div ref={ref} className="glass-konjo rounded-konjo p-3">
      <p className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${TONE_CLS[tone]}`}>
        {display}
      </p>
    </div>
  );
}
