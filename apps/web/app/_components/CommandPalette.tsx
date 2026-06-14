"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn, ease, StatusBadge } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

/**
 * Keyboard-driven command palette — Cmd+K / Ctrl+K opens, Esc closes.
 * Also responds to the "konjo:open-palette" custom DOM event so SiteNav
 * can trigger it without shared state.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const router = useRouter();

  const filtered = PRODUCTS.filter(
    (p) =>
      query === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tagline.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => { setCursor(0); }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => { if (!v) setQuery(""); return !v; });
      }
      if (e.key === "Escape") setOpen(false);
    }
    function onEvent() { setOpen(true); setQuery(""); }
    document.addEventListener("keydown", onKey);
    document.addEventListener("konjo:open-palette", onEvent);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("konjo:open-palette", onEvent);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  function navigate(slug: string) {
    setOpen(false);
    router.push(`/products/${slug}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[cursor]) {
      navigate(filtered[cursor].slug);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-konjo-bg/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <motion.div
            key="palette"
            role="dialog"
            aria-label="Command palette — navigate products"
            aria-modal
            className="glass-konjo rounded-konjo-xl fixed left-1/2 top-[18%] z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 1px rgba(124,58,237,0.4), 0 0 80px -12px rgba(124,58,237,0.28), 0 24px 64px -16px rgba(0,0,0,0.7)",
            }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.18, ease: ease.nehan }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-konjo-line px-4 py-3.5">
              <span className="text-sm text-konjo-fg-faint" aria-hidden>⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products…"
                className="text-konjo-mono min-w-0 flex-1 bg-transparent text-sm text-konjo-fg placeholder:text-konjo-fg-faint focus:outline-none"
                aria-label="Search products"
                aria-autocomplete="list"
                aria-controls="palette-list"
              />
              <kbd className="text-konjo-mono hidden rounded border border-konjo-line px-1.5 py-0.5 text-[10px] text-konjo-fg-faint sm:inline">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <ul
              id="palette-list"
              role="listbox"
              aria-label="Products"
              className="max-h-80 overflow-y-auto py-1.5"
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-konjo-fg-faint">
                  No products match "{query}"
                </li>
              ) : (
                filtered.map((p, i) => (
                  <li key={p.slug} role="option" aria-selected={i === cursor}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                        i === cursor
                          ? "bg-konjo-surface-2 text-konjo-fg"
                          : "text-konjo-fg-muted hover:bg-konjo-surface/60 hover:text-konjo-fg",
                      )}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => navigate(p.slug)}
                    >
                      <span
                        className="text-konjo-mono w-7 shrink-0 text-center text-xl leading-none"
                        style={{ color: "var(--color-konjo-brand-soft)" }}
                        aria-hidden
                      >
                        {p.glyph}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-konjo-mono text-sm font-medium">{p.name}</p>
                        <p className="truncate text-xs text-konjo-fg-faint">{p.tagline}</p>
                      </div>
                      <StatusBadge level={p.status} />
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Keyboard hints */}
            <div className="border-t border-konjo-line px-4 py-2">
              <div className="text-konjo-mono flex items-center gap-4 text-[10px] text-konjo-fg-faint">
                <span>
                  <kbd className="rounded border border-konjo-line px-1 py-0.5">↑↓</kbd>{" "}
                  navigate
                </span>
                <span>
                  <kbd className="rounded border border-konjo-line px-1 py-0.5">↵</kbd>{" "}
                  open
                </span>
                <span>
                  <kbd className="rounded border border-konjo-line px-1 py-0.5">Esc</kbd>{" "}
                  close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
