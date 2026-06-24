import { severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

const ITEMS_LTR = [...PRODUCTS, ...PRODUCTS];
const ITEMS_RTL = [...PRODUCTS].reverse().concat([...PRODUCTS].reverse());

/**
 * Two-row decorative marquee strip — one row scrolls left, one right.
 * Uses pure CSS animation; no JS at runtime. Placed as a visual divider between sections.
 */
export function ProductMarquee() {
  return (
    <div
      aria-hidden
      className="overflow-hidden border-y border-konjo-line/20 py-2.5 select-none"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      {/* Row 1 — scrolls left (LTR) */}
      <div className="konjo-marquee-ltr flex shrink-0 gap-x-10 pr-10 mb-1.5">
        {ITEMS_LTR.map((p, i) => {
          const col = sevColor[p.metric.severity];
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-mono text-konjo-fg-faint"
            >
              <span style={{ color: col }}>{p.glyph}</span>
              <span>{p.slug}</span>
              <span className="text-konjo-line mx-0.5">·</span>
              <span className="tabular-nums" style={{ color: col }}>
                {p.metric.value}{p.metric.unit}
              </span>
            </span>
          );
        })}
      </div>

      {/* Row 2 — scrolls right (RTL) */}
      <div className="konjo-marquee-rtl flex shrink-0 gap-x-10 pr-10">
        {ITEMS_RTL.map((p, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-mono text-konjo-fg-faint"
          >
            <span style={{ color: "var(--color-konjo-brand-soft)" }}>{p.glyph}</span>
            <span>{p.slug}</span>
            <span className="text-konjo-line mx-0.5">·</span>
            <span className="uppercase tracking-widest text-[9px] text-konjo-fg-faint/60">
              {p.metric.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
