import Link from "next/link";
import { severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

const STATUS_COLOR: Record<string, string> = {
  operational: "var(--color-konjo-good)",
  degraded:    "var(--color-konjo-warm)",
  outage:      "var(--color-konjo-hot)",
  research:    "var(--color-konjo-violet)",
};

/** Duplicated for seamless CSS marquee — scroll by 50% to loop invisibly. */
const TICKER_ITEMS = [...PRODUCTS, ...PRODUCTS];

/**
 * Full-width scrolling strip showing live headline metrics for all nine products.
 * Animation is CSS-driven so this component is fully server-renderable.
 * Hover pauses; prefers-reduced-motion freezes it.
 */
export function LiveTicker() {
  return (
    <div
      className="overflow-hidden border-y border-konjo-line/40 bg-konjo-surface/20 py-2.5"
      aria-label="Live product metrics"
    >
      <div className="konjo-ticker flex w-max">
        {TICKER_ITEMS.map((p, i) => {
          const val = Number.isInteger(p.metric.value)
            ? String(p.metric.value)
            : p.metric.value.toFixed(1);
          return (
            <Link
              key={`${p.slug}-${i}`}
              href={`/products/${p.slug}`}
              tabIndex={i >= PRODUCTS.length ? -1 : 0}
              aria-label={`${p.name}: ${p.metric.label} ${val}${p.metric.unit} — ${p.status}`}
              className="text-konjo-mono flex shrink-0 items-center gap-2.5 px-6 text-xs text-konjo-fg-muted transition-colors hover:text-konjo-fg"
            >
              <span
                className="inline-block size-1.5 shrink-0 rounded-full"
                style={{ background: STATUS_COLOR[p.status] ?? sevColor.info }}
                aria-hidden
              />
              <span
                className="text-base leading-none"
                style={{ color: "var(--color-konjo-brand-soft)" }}
                aria-hidden
              >
                {p.glyph}
              </span>
              <span className="font-medium text-konjo-fg">{p.name}</span>
              <span className="text-konjo-fg-faint" aria-hidden>·</span>
              <span
                className="tabular-nums"
                style={{ color: sevColor[p.metric.severity] }}
              >
                {val}
                {p.metric.unit}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-konjo-fg-faint">
                {p.metric.label}
              </span>
              <span className="ml-4 text-konjo-line/50" aria-hidden>│</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
