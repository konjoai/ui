import Link from "next/link";
import { Footer } from "./_components/Footer";

/** Konjo-branded 404 page — minimal, beautiful, on-brand. */
export default function NotFound() {
  return (
    <main className="aurora-konjo relative flex min-h-screen flex-col items-center justify-center overflow-x-clip px-6 text-center">
      <div className="aurora-konjo-bg" aria-hidden />

      <div className="relative">
        <p className="text-konjo-mono mb-4 text-xs uppercase tracking-[0.3em] text-konjo-fg-faint">
          Error 404
        </p>

        <h1
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
        </h1>

        <p className="mt-4 text-balance text-lg text-konjo-fg-muted">
          This page wandered out of the constellation.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-konjo-lg px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--color-konjo-brand)" }}
          >
            Back to home
          </Link>
          <Link
            href="/#projects"
            className="rounded-konjo-lg border border-konjo-line bg-konjo-surface/60 px-6 py-3 text-sm font-medium text-konjo-fg backdrop-blur transition-colors hover:bg-konjo-surface"
          >
            Browse products
          </Link>
        </div>

        <div
          aria-hidden
          className="text-konjo-mono pointer-events-none absolute -right-16 -top-16 select-none text-[200px] font-semibold leading-none text-konjo-violet/5 sm:-right-24 sm:-top-20 sm:text-[280px]"
        >
          ◌
        </div>
      </div>

      <Footer />
    </main>
  );
}
