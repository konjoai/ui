"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { StatusBadge, severity as sevColor } from "@konjoai/ui";
import { ease } from "@konjoai/ui";
import { MiniSparkline } from "@/app/status/_components/MiniSparkline";
import { PRODUCTS } from "@/lib/products";

const BUILD_TIME = new Date().toISOString();

/**
 * Animated product endpoint list for the status page.
 * Rows stagger in on mount; each row lifts slightly on hover.
 */
export function ProductStatusList() {
  return (
    <ul role="list" className="grid grid-cols-1 gap-3">
      {PRODUCTS.map((p, i) => (
        <motion.li
          key={p.slug}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: ease.kanjo, delay: i * 0.05 }}
        >
          <article className="glass-konjo rounded-konjo-lg flex items-center justify-between gap-4 p-5 transition-colors hover:bg-konjo-surface/60">
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="text-konjo-mono text-2xl leading-none text-konjo-violet"
              >
                {p.glyph}
              </span>
              <div>
                <Link
                  href={`/products/${p.slug}`}
                  className="text-konjo-display text-lg font-semibold tracking-tight text-konjo-fg transition-colors hover:text-konjo-violet"
                >
                  {p.name}
                </Link>
                <p className="text-xs text-konjo-fg-muted">{p.tagline}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <MiniSparkline slug={p.slug} />

              <div
                className="text-konjo-mono hidden flex-col items-end sm:flex"
                aria-label={`${p.metric.label}: ${p.metric.value}${p.metric.unit}`}
              >
                <span
                  className="text-lg font-semibold tabular-nums leading-none"
                  style={{ color: sevColor[p.metric.severity] }}
                >
                  {p.metric.value}
                  <span className="ml-0.5 text-xs text-konjo-fg-muted">
                    {p.metric.unit}
                  </span>
                </span>
                <span className="mt-0.5 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                  {p.metric.label}
                </span>
              </div>

              <StatusBadge level={p.status} lastCheckedAt={BUILD_TIME} />

              <a
                href={`https://${p.slug}.konjo.ai`}
                target="_blank"
                rel="noreferrer"
                className="text-konjo-mono hidden rounded-konjo border border-konjo-line/60 px-2.5 py-1 text-[11px] text-konjo-fg-muted transition-colors hover:border-konjo-line hover:text-konjo-fg lg:inline-block"
              >
                {p.slug}.konjo.ai ↗
              </a>
            </div>
          </article>
        </motion.li>
      ))}
    </ul>
  );
}
