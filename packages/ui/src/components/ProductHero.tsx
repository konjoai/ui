import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ProductHeroProps {
  name: string;
  /** Short single-sentence description. */
  tagline: string;
  /** Brand glyph, e.g. "◐". Rendered very large behind/beside the title. */
  glyph?: string;
  /** Optional small caption — e.g. "Sprint 4 · Inference Cockpit". */
  eyebrow?: string;
  /** Optional version pill — e.g. "v9.14.0". */
  version?: string;
  /** Optional status pill rendered to the right of the version. */
  status?: ReactNode;
  /** Right-side CTAs (links, buttons). Rendered as a flex row, wrap on mobile. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Konjo ProductHero — the top-of-page header used on every product page.
 *
 * Server-renderable (no hooks). Brand-accent oversized glyph, gradient title,
 * tagline, optional version + status pills, and a CTA row. Designed to sit
 * inside the `aurora-konjo` shell so the background lights through.
 */
export function ProductHero({
  name,
  tagline,
  glyph,
  eyebrow,
  version,
  status,
  actions,
  className,
}: ProductHeroProps) {
  return (
    <section
      className={cn(
        "relative mx-auto max-w-6xl px-6 pt-24 pb-12 sm:pt-32",
        className,
      )}
    >
      {glyph ? (
        <div
          aria-hidden
          className="text-konjo-mono pointer-events-none absolute right-6 top-16 select-none text-[180px] leading-none text-konjo-violet/15 sm:right-12 sm:top-20 sm:text-[240px]"
        >
          {glyph}
        </div>
      ) : null}

      <div className="relative">
        {eyebrow ? (
          <p className="text-konjo-mono mb-3 text-xs uppercase tracking-widest text-konjo-fg-faint">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="text-konjo-display text-konjo-gradient text-6xl font-semibold tracking-tight sm:text-7xl">
          {name}
        </h1>

        <p className="mt-4 max-w-2xl text-balance text-lg text-konjo-fg-muted sm:text-xl">
          {tagline}
        </p>

        {(version || status) && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {version ? (
              <span className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-line bg-konjo-surface/60 px-2.5 py-1 text-[11px] text-konjo-fg-muted backdrop-blur">
                {version}
              </span>
            ) : null}
            {status}
          </div>
        )}

        {actions ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}
