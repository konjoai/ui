"use client";

import { useState, useEffect } from "react";
import { Nav, cn } from "@konjoai/ui";
import { PRODUCT_NAV_GROUP } from "@/lib/products";

/** Sticky nav — gains a brand glow on scroll; the ⌘K button opens the CommandPalette. */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function openPalette() {
    document.dispatchEvent(new CustomEvent("konjo:open-palette"));
  }

  return (
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
        <button
          type="button"
          onClick={openPalette}
          aria-label="Open command palette (⌘K)"
          className="text-konjo-mono hidden items-center gap-1.5 rounded-konjo border border-konjo-line bg-konjo-surface/60 px-2.5 py-1.5 text-[11px] text-konjo-fg-faint transition-colors hover:border-konjo-line/80 hover:bg-konjo-surface hover:text-konjo-fg sm:inline-flex"
        >
          ⌘K
        </button>
      }
    />
  );
}
