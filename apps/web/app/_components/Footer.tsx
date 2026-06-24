import Link from "next/link";
import { severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

const operational = PRODUCTS.filter((p) => p.status === "operational").length;

const STATUS_COLOR: Record<string, string> = {
  operational: "var(--color-konjo-good)",
  degraded:    "var(--color-konjo-warm)",
  outage:      "var(--color-konjo-hot)",
  research:    "var(--color-konjo-violet)",
};

/** Site footer with portfolio health dots, stat, and navigation links. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-konjo-line/60 bg-konjo-surface/30 backdrop-blur">
      {/* Subtle aurora behind the footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)",
          }}
        />
      </div>
      {/* Product health constellation strip */}
      <div className="border-b border-konjo-line/30 px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-3 flex-wrap">
          <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint shrink-0">
            Systems
          </span>
          <div className="flex flex-wrap items-center gap-2" aria-label="Product health overview">
            {PRODUCTS.map((p) => {
              const dotColor = STATUS_COLOR[p.status] ?? sevColor.info;
              return (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  aria-label={`${p.name} — ${p.status}`}
                  className="group text-konjo-mono relative flex items-center gap-1.5 rounded-konjo border border-konjo-line/40 bg-konjo-surface/40 px-2 py-0.5 text-[10px] text-konjo-fg-faint transition-colors hover:border-konjo-line hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-offset-1"
                >
                  <span
                    className="inline-block size-1.5 rounded-full"
                    style={{ background: dotColor }}
                    aria-hidden
                  />
                  {p.slug}

                  {/* CSS-only tooltip — no JS required, server-safe */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-36 -translate-x-1/2 rounded-konjo border border-konjo-line/60 bg-konjo-surface px-3 py-2 text-center text-[10px] opacity-0 shadow-lg backdrop-blur transition-opacity duration-150 group-hover:opacity-100"
                  >
                    <span className="block font-medium text-konjo-fg">{p.name}</span>
                    <span className="mt-0.5 block text-konjo-fg-faint tabular-nums">
                      {p.metric.value}{p.metric.unit} · {p.metric.label}
                    </span>
                    <span className="mt-0.5 block font-medium" style={{ color: dotColor }}>
                      {p.status}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div>
          <p className="text-konjo-display text-lg font-semibold tracking-tight">
            KonjoAI
          </p>
          <p className="text-konjo-mono mt-1 text-xs text-konjo-fg-faint">
            ቆንጆ · 根性 · 康宙 · 건조
          </p>
          <p className="text-konjo-mono mt-2 text-[11px] text-konjo-fg-faint">
            <span className="text-konjo-good">{operational}</span>
            <span className="text-konjo-fg-faint"> / {PRODUCTS.length} systems operational</span>
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <Link
            href="/#projects"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent rounded-sm"
          >
            Products
          </Link>
          <Link
            href="/status"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent rounded-sm"
          >
            Status
          </Link>
          <a
            href="https://github.com/konjoai"
            target="_blank"
            rel="noreferrer"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent rounded-sm"
          >
            GitHub
          </a>
          <a
            href="https://github.com/konjoai/ui"
            target="_blank"
            rel="noreferrer"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent rounded-sm"
          >
            Design system
          </a>
          <span className="text-konjo-mono text-xs text-konjo-fg-faint">
            © {year} KonjoAI
          </span>
        </nav>
      </div>
    </footer>
  );
}
