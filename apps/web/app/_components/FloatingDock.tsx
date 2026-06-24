"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

const DOCK_ITEMS = [
  { id: "palette", label: "⌘", tooltip: "Command palette  ⌘K" },
  { id: "random",  label: "⚄", tooltip: "Surprise me"          },
  { id: "top",     label: "↑", tooltip: "Back to top"           },
] as const;

type DockId = typeof DOCK_ITEMS[number]["id"];

interface DockButtonProps {
  label: string;
  tooltip: string;
  onClick: () => void;
  onMouseEnter: () => void;
  magnified: boolean;
  adjacent: boolean;
}

/** Single dock button with tooltip, hover magnification, and ambient glow. */
function DockButton({ label, tooltip, onClick, onMouseEnter, magnified, adjacent }: DockButtonProps) {
  const scale = magnified ? 1.45 : adjacent ? 1.22 : 1;
  return (
    <div className="group/tip relative flex items-center">
      <span
        role="tooltip"
        className="pointer-events-none absolute right-14 whitespace-nowrap rounded border border-konjo-line/50 bg-konjo-surface px-2 py-1 text-[10px] text-konjo-fg-muted opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 text-konjo-mono"
      >
        {tooltip}
      </span>
      <motion.button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        aria-label={tooltip}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-konjo-mono flex size-10 items-center justify-center rounded-full border border-konjo-line/60 bg-konjo-surface/80 text-xs text-konjo-fg-muted shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
        style={{
          boxShadow: magnified
            ? "0 0 0 1px rgba(124,58,237,0.35), 0 0 20px -4px rgba(124,58,237,0.4)"
            : undefined,
        }}
      >
        {label}
      </motion.button>
    </div>
  );
}

/**
 * Floating action dock — appears after 400 px of scroll.
 * Provides quick access to the command palette, a random product, and scroll-to-top.
 * Buttons magnify on hover in a macOS-dock-style cascade.
 */
export function FloatingDock() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<DockId | null>(null);
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

  const handlers: Record<DockId, () => void> = {
    palette: openPalette,
    random:  randomProduct,
    top:     scrollToTop,
  };

  const ids = DOCK_ITEMS.map((d) => d.id);

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
          onMouseLeave={() => setHovered(null)}
        >
          {DOCK_ITEMS.map((item) => {
            const idx = ids.indexOf(item.id);
            const hIdx = hovered ? ids.indexOf(hovered) : -1;
            const dist = hIdx >= 0 ? Math.abs(idx - hIdx) : 999;
            return (
              <DockButton
                key={item.id}
                label={item.label}
                tooltip={item.tooltip}
                onClick={handlers[item.id]}
                magnified={!reduce && item.id === hovered}
                adjacent={!reduce && dist === 1}
                onMouseEnter={() => setHovered(item.id)}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
