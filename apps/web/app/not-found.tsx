"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ease } from "@konjoai/ui";
import { Footer } from "./_components/Footer";

/** Konjo-branded 404 page — animated, on-brand, with constellation glyph backdrop. */
export default function NotFound() {
  return (
    <main className="aurora-konjo relative flex min-h-screen flex-col items-center justify-center overflow-x-clip px-6 text-center">
      <div className="aurora-konjo-bg" aria-hidden />

      <div className="relative z-10 max-w-lg">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: ease.kanjo }}
          className="text-konjo-mono mb-4 text-xs uppercase tracking-[0.3em] text-konjo-fg-faint"
        >
          Error 404
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: ease.kanjo, delay: 0.05 }}
          className="text-konjo-display text-[7rem] font-semibold leading-none tracking-tight sm:text-[10rem]"
          style={{
            background:
              "linear-gradient(120deg, var(--color-konjo-brand-soft) 0%, var(--color-konjo-brand) 40%, var(--color-konjo-accent) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.kanjo, delay: 0.15 }}
          className="mt-4 text-balance text-lg text-konjo-fg-muted"
        >
          This page wandered out of the constellation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: ease.kanjo, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="shadow-konjo-brand rounded-konjo-lg px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
            style={{ background: "var(--color-konjo-brand)" }}
          >
            Back to home
          </Link>
          <Link
            href="/#projects"
            className="rounded-konjo-lg border border-konjo-line bg-konjo-surface/60 px-6 py-3 text-sm font-medium text-konjo-fg backdrop-blur transition-colors hover:bg-konjo-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
          >
            Browse products
          </Link>
        </motion.div>
      </div>

      {/* Background glyph watermark */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="text-konjo-mono pointer-events-none absolute right-4 top-8 select-none text-[200px] font-semibold leading-none text-konjo-violet/[0.04] sm:right-8 sm:text-[280px]"
      >
        ◌
      </motion.div>

      <Footer />
    </main>
  );
}
