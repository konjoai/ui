"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";

type Crumb = { label: string; href?: string };

/** Staggered breadcrumb trail with accessible nav landmark. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const reduce = useReducedMotion();

  return (
    <nav aria-label="Breadcrumb" className="text-konjo-mono text-xs">
      <ol className="flex flex-wrap items-center gap-1.5 text-konjo-fg-faint">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <motion.li
              key={`${c.label}-${i}`}
              className="flex items-center gap-1.5"
              initial={reduce ? { opacity: 1 } : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: ease.kanjo, delay: i * 0.07 }}
            >
              {c.href && !last ? (
                <a
                  href={c.href}
                  className="text-konjo-fg-muted transition-colors hover:text-konjo-fg"
                >
                  {c.label}
                </a>
              ) : (
                <span className={last ? "text-konjo-fg" : undefined}>{c.label}</span>
              )}
              {!last ? <span aria-hidden>›</span> : null}
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}
