"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";
import { ScrambleText } from "./ScrambleText";

/**
 * Pre-footer call-to-action — aurora burst, large scramble headline,
 * two CTAs, and an animated product glyph roll.
 */
export function CTASection() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Get started with KonjoAI"
      className="mx-auto max-w-6xl px-6 pb-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.65, ease: ease.kanjo }}
        className="glass-konjo rounded-konjo-xl relative overflow-hidden px-8 py-16 text-center"
      >
        {/* Aurora orbs */}
        {!reduce && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/4 -top-16 size-[420px] -translate-x-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute right-1/4 bottom-0 size-72 translate-x-1/2 translate-y-1/3 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 65%)",
              }}
            />
          </>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12, ease: ease.kanjo }}
          className="text-konjo-mono relative z-10 mb-4 text-xs uppercase tracking-[0.24em] text-konjo-accent"
        >
          Nine products · one design system · zero compromises
        </motion.p>

        <ScrambleText
          as="h2"
          text="Ready to ship at 42 tok/s?"
          className="text-konjo-display relative z-10 text-3xl font-semibold tracking-tight sm:text-5xl"
          delay={220}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.28, ease: ease.kanjo }}
          className="relative z-10 mx-auto mt-4 max-w-xl text-sm text-konjo-fg-muted sm:text-base"
        >
          Inference, retrieval, compression, memory, agents — every product
          ships a CLI, a benchmark suite, and a CLAUDE.md.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.38, ease: ease.kanjo }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="shadow-konjo-brand rounded-konjo-lg px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
            style={{ background: "var(--color-konjo-brand)" }}
          >
            Explore the constellation
          </a>
          <a
            href="https://github.com/konjoai"
            target="_blank"
            rel="noreferrer"
            className="rounded-konjo-lg border border-konjo-line bg-konjo-surface/60 px-6 py-3 text-sm font-medium text-konjo-fg backdrop-blur transition-colors hover:bg-konjo-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
          >
            GitHub →
          </a>
        </motion.div>

        {/* Product glyph roll */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
        >
          {PRODUCTS.map((p, i) => (
            <motion.a
              key={p.slug}
              href={`/products/${p.slug}`}
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={reduce ? undefined : { scale: 1.12 }}
              transition={{ delay: 0.5 + i * 0.04, duration: 0.28, ease: ease.kanjo }}
              className="text-konjo-mono inline-flex items-center gap-1.5 text-[11px] text-konjo-fg-faint transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent rounded"
            >
              <span style={{ color: "var(--color-konjo-brand-soft)" }} aria-hidden>
                {p.glyph}
              </span>
              {p.slug}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
