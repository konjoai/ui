"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Nav, cn } from "@konjoai/ui";
import { PRODUCT_NAV_GROUP, PRODUCTS } from "@/lib/products";

const ISSUE_COUNT = PRODUCTS.filter(
  (p) => p.status === "degraded" || p.status === "outage",
).length;

/** Sticky nav — scroll-aware glow, ⌘K trigger, active-link underline from pathname. */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function openPalette() {
    document.dispatchEvent(new CustomEvent("konjo:open-palette"));
  }

  const onStatus = pathname === "/status";
  const onProduct = pathname.startsWith("/products");

  return (
    <>
      {/* Inject active-link styles scoped to nav — avoids touching the design system */}
      {(onStatus || onProduct) && (
        <style>{`
          ${onStatus ? `header nav a[href="/status"]` : ""}
          ${onProduct ? `header nav a[href="/#projects"]` : ""} {
            color: var(--color-konjo-fg) !important;
            text-decoration: underline;
            text-decoration-color: var(--color-konjo-brand);
            text-underline-offset: 3px;
          }
        `}</style>
      )}
      <Nav
        brand="KonjoAI"
        brandHref="/"
        products={PRODUCT_NAV_GROUP}
        links={[
          { label: "Status", href: "/status" },
          { label: "GitHub", href: "https://github.com/konjoai", external: true },
        ]}
        className={cn(
          "transition-shadow duration-300",
          scrolled && "shadow-[0_4px_24px_-8px_rgba(124,58,237,0.28)]",
        )}
        actions={
          <div className="flex items-center gap-2">
            {ISSUE_COUNT > 0 && (
              <a
                href="/status"
                aria-label={`${ISSUE_COUNT} system${ISSUE_COUNT > 1 ? "s" : ""} degraded — view status`}
                className="text-konjo-mono inline-flex items-center gap-1.5 rounded-full border border-konjo-warm/40 bg-konjo-warm/10 px-2 py-1 text-[10px] text-konjo-warm transition-colors hover:bg-konjo-warm/20"
              >
                <span className="inline-block size-1.5 rounded-full bg-konjo-warm animate-pulse" aria-hidden />
                {ISSUE_COUNT} degraded
              </a>
            )}
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette (⌘K)"
              className="text-konjo-mono hidden items-center gap-1.5 rounded-konjo border border-konjo-line bg-konjo-surface/60 px-2.5 py-1.5 text-[11px] text-konjo-fg-faint transition-colors hover:border-konjo-line/80 hover:bg-konjo-surface hover:text-konjo-fg sm:inline-flex"
            >
              ⌘K
            </button>
          </div>
        }
      />
    </>
  );
}
