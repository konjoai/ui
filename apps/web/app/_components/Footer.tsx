import { PRODUCTS } from "@/lib/products";

const operational = PRODUCTS.filter((p) => p.status === "operational").length;

/** Site footer with portfolio stat and navigation links. */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-konjo-line/60 bg-konjo-surface/30 backdrop-blur">
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
          <a
            href="/#projects"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg"
          >
            Products
          </a>
          <a
            href="/status"
            className="text-konjo-fg-muted transition-colors hover:text-konjo-fg"
          >
            Status
          </a>
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
