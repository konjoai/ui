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
    <footer className="border-t border-konjo-line/60 bg-konjo-surface/30 backdrop-blur">
      {/* Product health constellation strip */}
      <div className="border-b border-konjo-line/30 px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-3 flex-wrap">
          <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint shrink-0">
            Systems
          </span>
          <div className="flex flex-wrap items-center gap-2" aria-label="Product health overview">
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                title={`${p.name} — ${p.status}`}
                className="text-konjo-mono flex items-center gap-1.5 rounded-konjo border border-konjo-line/40 bg-konjo-surface/40 px-2 py-0.5 text-[10px] text-konjo-fg-faint transition-colors hover:border-konjo-line hover:text-konjo-fg"
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: STATUS_COLOR[p.status] ?? sevColor.info }}
                  aria-hidden
                />
                {p.slug}
              </Link>
            ))}
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
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg"
          >
            Products
          </Link>
          <Link
            href="/status"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg"
          >
            Status
          </Link>
          <a
            href="https://github.com/konjoai"
            target="_blank"
            rel="noreferrer"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg"
          >
            GitHub
          </a>
          <a
            href="https://github.com/konjoai/ui"
            target="_blank"
            rel="noreferrer"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg"
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
