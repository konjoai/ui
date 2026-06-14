"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

type SectionDef = { id: string; label: string };

const SECTIONS: SectionDef[] = [
  { id: "hero",          label: "Introduction"   },
  { id: "constellation", label: "Constellation"  },
  { id: "activity",      label: "Live activity"  },
  { id: "philosophy",    label: "Philosophy"     },
  { id: "terminal",      label: "CLI"            },
  { id: "demo",          label: "Live demo"      },
  { id: "benchmarks",    label: "Benchmarks"     },
  { id: "heatmap",       label: "Inference grid" },
  { id: "signals",       label: "Signal monitor" },
  { id: "design",        label: "Design system"  },
  { id: "projects",      label: "Portfolio"      },
];

/**
 * Fixed right-side navigation dots — one per major page section.
 * Uses IntersectionObserver to track which section is currently in view.
 * Click a dot to smooth-scroll to that section.
 * Hidden on small screens; shown from lg up.
 */
export function SectionDots() {
  const [active, setActive] = useState<string>("hero");
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ratios = new Map<string, number>();

    function pickMostVisible() {
      let best = "hero";
      let bestRatio = -1;
      ratios.forEach((ratio, id) => {
        if (ratio > bestRatio) { bestRatio = ratio; best = id; }
      });
      setActive(best);
    }

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios.set(id, entry.intersectionRatio);
          pickMostVisible();
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
      aria-label="Page sections"
    >
      {SECTIONS.map(({ id, label }) => {
        const isActive = active === id;
        const isHovered = hovered === id;

        return (
          <div
            key={id}
            className="group/dot relative flex items-center justify-end"
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Tooltip to the left */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.15 }}
                  className="text-konjo-mono pointer-events-none absolute right-5 mr-1 whitespace-nowrap rounded-konjo border border-konjo-line/60 bg-konjo-surface px-2.5 py-1 text-[10px] tracking-wide text-konjo-fg shadow-lg backdrop-blur"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => scrollTo(id)}
              aria-label={`Scroll to ${label}`}
              aria-current={isActive ? "true" : undefined}
              className="relative flex size-5 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full"
            >
              {/* Outer ring — visible on active */}
              {isActive && (
                <motion.span
                  layoutId="dot-ring"
                  className="absolute size-4 rounded-full border border-konjo-brand/60"
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              )}
              {/* Dot */}
              <motion.span
                animate={{
                  scale: isActive ? 1 : isHovered ? 0.8 : 0.5,
                  background: isActive
                    ? "var(--color-konjo-brand)"
                    : isHovered
                    ? "var(--color-konjo-fg-muted)"
                    : "var(--color-konjo-fg-faint)",
                }}
                transition={{ duration: 0.2 }}
                className="block size-1.5 rounded-full"
              />
            </button>
          </div>
        );
      })}
    </nav>
  );
}
