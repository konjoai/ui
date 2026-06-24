"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { StatusBadge, severity as sevColor, ease } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";
import { ScrambleText } from "@/app/_components/ScrambleText";
import { MiniSparkline } from "@/app/_components/MiniSparkline";

interface RelatedProductsProps {
  currentSlug: string;
}

/**
 * Shows the next three products after the current one (wrapping),
 * giving visitors a natural path through the portfolio.
 * Cards animate in on scroll with staggered entrance.
 */
export function RelatedProducts({ currentSlug }: RelatedProductsProps) {
  const reduce = useReducedMotion();
  const idx = PRODUCTS.findIndex((p) => p.slug === currentSlug);
  const related = [1, 2, 3].map((offset) => PRODUCTS[(idx + offset) % PRODUCTS.length]);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <ScrambleText
        as="h2"
        text="More from KonjoAI"
        className="text-konjo-display mb-6 text-2xl font-semibold tracking-tight sm:text-3xl"
        delay={80}
      />

      <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {related.map((p, i) => {
          const metricColor = sevColor[p.metric.severity];
          const metricDisplay = Number.isInteger(p.metric.value)
            ? String(p.metric.value)
            : p.metric.value.toFixed(1);

          return (
            <motion.li
              key={p.slug}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.45, ease: ease.kanjo, delay: i * 0.1 }}
              whileHover={reduce ? undefined : {
                y: -4,
                boxShadow: "0 0 0 1px rgba(124,58,237,0.3), 0 0 32px -8px rgba(124,58,237,0.15)",
                transition: { duration: 0.2, ease: ease.nehan },
              }}
            >
              <Link
                href={`/products/${p.slug}`}
                className="glass-konjo rounded-konjo-lg group flex h-full flex-col gap-3 p-5 transition-colors hover:bg-konjo-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="text-konjo-mono text-2xl leading-none transition-transform duration-300 group-hover:scale-110"
                    style={{ color: "var(--color-konjo-brand-soft)" }}
                    aria-hidden
                  >
                    {p.glyph}
                  </span>
                  <StatusBadge level={p.status} />
                </div>
                <div className="flex-1">
                  <p className="text-konjo-display font-semibold tracking-tight transition-colors group-hover:text-konjo-violet">
                    {p.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-konjo-fg-muted">
                    {p.tagline}
                  </p>
                </div>
                <div
                  className="flex items-center gap-2"
                  aria-label={`${p.metric.label}: ${metricDisplay}${p.metric.unit}`}
                >
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-konjo-mono text-xl font-semibold tabular-nums"
                      style={{ color: metricColor }}
                    >
                      {metricDisplay}
                      <span className="ml-0.5 text-xs text-konjo-fg-muted">{p.metric.unit}</span>
                    </span>
                    <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                      {p.metric.label}
                    </span>
                  </div>
                  <MiniSparkline slug={p.slug} width={48} height={18} />
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
