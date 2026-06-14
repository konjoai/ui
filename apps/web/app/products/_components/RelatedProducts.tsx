import { StatusBadge, severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

interface RelatedProductsProps {
  currentSlug: string;
}

/**
 * Shows the next three products after the current one (wrapping),
 * giving visitors a natural path through the portfolio.
 */
export function RelatedProducts({ currentSlug }: RelatedProductsProps) {
  const idx = PRODUCTS.findIndex((p) => p.slug === currentSlug);
  const related = [1, 2, 3].map((offset) => PRODUCTS[(idx + offset) % PRODUCTS.length]);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <h2 className="text-konjo-display mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        More from KonjoAI
      </h2>
      <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {related.map((p) => {
          const metricColor = sevColor[p.metric.severity];
          const metricDisplay = Number.isInteger(p.metric.value)
            ? String(p.metric.value)
            : p.metric.value.toFixed(1);

          return (
            <li key={p.slug}>
              <a
                href={`/products/${p.slug}`}
                className="glass-konjo rounded-konjo-lg group flex flex-col gap-3 p-5 transition-colors hover:bg-konjo-surface/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="text-konjo-mono text-2xl leading-none"
                    style={{ color: "var(--color-konjo-brand-soft)" }}
                    aria-hidden
                  >
                    {p.glyph}
                  </span>
                  <StatusBadge level={p.status} />
                </div>
                <div>
                  <p className="text-konjo-display font-semibold tracking-tight transition-colors group-hover:text-konjo-violet">
                    {p.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-konjo-fg-muted line-clamp-2">
                    {p.tagline}
                  </p>
                </div>
                <div
                  className="flex items-baseline gap-1"
                  aria-label={`${p.metric.label}: ${metricDisplay}${p.metric.unit}`}
                >
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
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
