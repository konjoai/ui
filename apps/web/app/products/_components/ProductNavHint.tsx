"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

interface ProductNavHintProps {
  currentSlug: string;
}

/**
 * Floating prev/next product navigator — appears after 480px of scroll.
 * Provides a visible UI complement to the [ / ] keyboard shortcuts.
 */
export function ProductNavHint({ currentSlug }: ProductNavHintProps) {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const reduce = useReducedMotion();

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const idx = PRODUCTS.findIndex((p) => p.slug === currentSlug);
  if (idx === -1) return null;

  const prev = PRODUCTS[(idx - 1 + PRODUCTS.length) % PRODUCTS.length];
  const next = PRODUCTS[(idx + 1) % PRODUCTS.length];

  function goTo(slug: string) {
    router.push(`/products/${slug}`);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="product-nav-hint"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3, ease: ease.nehan }}
          className="fixed bottom-6 left-1/2 z-30 hidden -translate-x-1/2 lg:flex"
          aria-label="Navigate between products"
        >
          <div className="text-konjo-mono flex items-center gap-1 rounded-full border border-konjo-line/50 bg-konjo-surface/80 px-2 py-1.5 text-[11px] backdrop-blur shadow-lg">
            <button
              type="button"
              onClick={() => goTo(prev.slug)}
              aria-label={`Previous product: ${prev.name}`}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-konjo-fg-muted transition-colors hover:bg-konjo-surface hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
            >
              <span aria-hidden className="text-konjo-fg-faint">←</span>
              <span aria-hidden className="text-sm leading-none">{prev.glyph}</span>
              <span>{prev.name}</span>
              <span className="ml-0.5 rounded border border-konjo-line/50 px-1 py-0.5 text-[9px] uppercase text-konjo-fg-faint">[</span>
            </button>

            <span className="text-konjo-line/50 mx-0.5" aria-hidden>│</span>

            <button
              type="button"
              onClick={() => goTo(next.slug)}
              aria-label={`Next product: ${next.name}`}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-konjo-fg-muted transition-colors hover:bg-konjo-surface hover:text-konjo-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent"
            >
              <span className="mr-0.5 rounded border border-konjo-line/50 px-1 py-0.5 text-[9px] uppercase text-konjo-fg-faint">]</span>
              <span>{next.name}</span>
              <span aria-hidden className="text-sm leading-none">{next.glyph}</span>
              <span aria-hidden className="text-konjo-fg-faint">→</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
