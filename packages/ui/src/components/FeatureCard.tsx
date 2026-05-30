import { cn } from "../lib/cn";

export interface FeatureCardProps {
  /** Single character or short glyph. Rendered large in the brand accent. */
  glyph?: string;
  /** Short imperative or noun-phrase title. */
  title: string;
  /** 1-2 sentence description. */
  description: string;
  /** Optional small caption above the title — e.g. a category. */
  eyebrow?: string;
  className?: string;
}

/**
 * Konjo FeatureCard — one tile in a 2-3 column feature grid.
 *
 * Server-renderable (no hooks). Brand-accent glyph + title + description.
 * Subtle hover lift mirrors the homepage ProjectCard treatment for visual
 * coherence across the portfolio.
 */
export function FeatureCard({
  glyph,
  title,
  description,
  eyebrow,
  className,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        "glass-konjo rounded-konjo-lg group relative overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-0.5",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-konjo-violet), transparent)",
        }}
      />
      {glyph ? (
        <div
          aria-hidden
          className="text-konjo-mono mb-4 text-2xl leading-none text-konjo-violet"
        >
          {glyph}
        </div>
      ) : null}
      {eyebrow ? (
        <p className="text-konjo-mono mb-1 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="text-konjo-display text-lg font-semibold tracking-tight text-konjo-fg">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-konjo-fg-muted">
        {description}
      </p>
    </article>
  );
}
