"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@konjoai/ui";

type Section = { id: string; label: string };

const SECTIONS: Section[] = [
  { id: "product-overview",  label: "Overview"  },
  { id: "product-features",  label: "Features"  },
  { id: "product-code",      label: "Code"      },
  { id: "product-dashboard", label: "Dashboard" },
  { id: "product-related",   label: "Related"   },
];

/**
 * Floating left-rail chapter indicator for product pages.
 * Uses IntersectionObserver to highlight the currently visible section.
 * Hidden on mobile — only visible at lg+ breakpoints.
 */
export function ProductSectionNav() {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Show after scrolling past the hero
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35 }}
          aria-label="Product page sections"
          className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
        >
          <ol className="flex flex-col gap-3">
            {SECTIONS.map(({ id, label }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    aria-current={isActive ? "location" : undefined}
                    className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-offset-1 rounded-sm"
                  >
                    <span
                      className={cn(
                        "block h-0.5 transition-all duration-300",
                        isActive
                          ? "w-5 bg-konjo-brand"
                          : "w-2.5 bg-konjo-line group-hover:w-4 group-hover:bg-konjo-fg-muted",
                      )}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        "text-konjo-mono text-[10px] uppercase tracking-widest transition-colors duration-200",
                        isActive ? "text-konjo-fg" : "text-konjo-fg-faint group-hover:text-konjo-fg-muted",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
