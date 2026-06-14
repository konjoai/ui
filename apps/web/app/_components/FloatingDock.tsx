"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

interface DockButtonProps {
  label: string;
  tooltip: string;
  onClick: () => void;
}

/** Single dock button with a right-anchored tooltip on hover. */
function DockButton({ label, tooltip, onClick }: DockButtonProps) {
  return (
    <div className="group/tip relative flex items-center">
      {/* Tooltip — slides in from the right edge */}
      <span
        role="tooltip"
        className="pointer-events-none absolute right-12 whitespace-nowrap rounded border border-konjo-line/50 bg-konjo-surface px-2 py-1 text-[10px] text-konjo-fg-muted opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 text-konjo-mono"
      >
        {tooltip}
      </span>
      <button
        type="button"
        onClick={onClick}
        aria-label={tooltip}
        className="text-konjo-mono flex size-10 items-center justify-center rounded-full border border-konjo-line/60 bg-konjo-surface/80 text-xs text-konjo-fg-muted shadow-lg backdrop-blur transition-all hover:border-konjo-brand/40 hover:bg-konjo-surface hover:text-konjo-fg hover:shadow-[0_0_20px_-4px_rgba(124,58,237,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
      >
        {label}
      </button>
    </div>
  );
}

/**
 * Floating action dock — appears after 400 px of scroll.
 * Provides quick access to the command palette, a random product, and scroll-to-top.
 */
export function FloatingDock() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  }

  function openPalette() {
    document.dispatchEvent(new CustomEvent("konjo:open-palette"));
  }

  function randomProduct() {
    const idx = Math.floor(Math.random() * PRODUCTS.length);
    router.push(`/products/${PRODUCTS[idx].slug}`);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="dock"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: ease.nehan }}
          className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2"
          aria-label="Floating navigation dock"
        >
          <DockButton label="⌘" tooltip="Command palette  ⌘K" onClick={openPalette} />
          <DockButton label="⚄" tooltip="Surprise me" onClick={randomProduct} />
          <DockButton label="↑" tooltip="Back to top" onClick={scrollToTop} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
