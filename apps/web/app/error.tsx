"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ease } from "@konjoai/ui";

/**
 * Next.js route-level error boundary with Konjo branding.
 * Rendered whenever an unhandled exception propagates to the route segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Forward to any configured error tracker (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <main
      className="aurora-konjo relative flex min-h-screen flex-col items-center justify-center overflow-x-clip px-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="aurora-konjo-bg" aria-hidden />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: ease.kanjo }}
        className="relative z-10 max-w-lg"
      >
        <p className="text-konjo-mono mb-4 text-xs uppercase tracking-[0.24em] text-konjo-fg-faint">
          System error
        </p>

        <h1 className="text-konjo-display text-[6rem] font-semibold leading-none tracking-tight sm:text-[8rem]"
          style={{
            background:
              "linear-gradient(120deg, var(--color-konjo-warm) 0%, var(--color-konjo-hot) 50%, var(--color-konjo-brand) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Oops
        </h1>

        <p className="mt-6 text-balance text-lg text-konjo-fg-muted">
          Something unexpected happened. The constellation is still intact —
          this is just turbulence.
        </p>

        {error.digest && (
          <p className="text-konjo-mono mt-3 rounded-konjo border border-konjo-line/40 bg-konjo-surface/40 px-3 py-1.5 text-[11px] text-konjo-fg-faint">
            digest · <span className="text-konjo-fg-muted">{error.digest}</span>
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="shadow-konjo-brand rounded-konjo-lg px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
            style={{ background: "var(--color-konjo-brand)" }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-konjo-lg border border-konjo-line bg-konjo-surface/60 px-6 py-3 text-sm font-medium text-konjo-fg backdrop-blur transition-colors hover:bg-konjo-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
          >
            Return home
          </Link>
        </div>

        <div
          aria-hidden
          className="text-konjo-mono pointer-events-none absolute -right-12 -top-12 select-none text-[180px] font-semibold leading-none text-konjo-hot/4 sm:text-[240px]"
        >
          ✕
        </div>
      </motion.div>
    </main>
  );
}
