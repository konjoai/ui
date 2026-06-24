"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

type Shortcut = {
  keys: string[];
  label: string;
  group: string;
};

const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"],  label: "Command palette",     group: "Global"    },
  { keys: ["?"],        label: "Keyboard shortcuts",  group: "Global"    },
  { keys: ["/"],        label: "Focus search",        group: "Global"    },
  { keys: ["Esc"],      label: "Dismiss / close",     group: "Global"    },
  { keys: ["g", "h"],   label: "Go to Home",          group: "Navigate"  },
  { keys: ["g", "s"],   label: "Go to Status",        group: "Navigate"  },
  { keys: ["1–9"],      label: "Go to product by #",  group: "Navigate"  },
  { keys: ["["],        label: "Previous product",    group: "Navigate"  },
  { keys: ["]"],        label: "Next product",        group: "Navigate"  },
  { keys: ["↑", "↓"],  label: "Move selection",      group: "Palette"   },
  { keys: ["↵"],        label: "Open result",         group: "Palette"   },
  { keys: ["↑↑↓↓←→←→ba"], label: "Konjo spirit 根性", group: "Easter egg" },
];

const GROUPS = ["Global", "Navigate", "Palette", "Easter egg"] as const;

/**
 * Global keyboard help overlay — press ? to open.
 * Also registers g-key sequences: g h → Home, g s → Status.
 */
export function KeyboardHelp() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const [gMode, setGMode] = useState(false);

  const isInputFocused = useCallback(() => {
    const el = document.activeElement;
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
  }, []);

  const currentProductIdx = useCallback(() => {
    if (!pathname.startsWith("/products/")) return -1;
    const slug = pathname.replace("/products/", "").split("/")[0];
    return PRODUCTS.findIndex((p) => p.slug === slug);
  }, [pathname]);

  useEffect(() => {
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    function onKey(e: KeyboardEvent) {
      if (isInputFocused()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (gMode) {
        if (gTimer) clearTimeout(gTimer);
        setGMode(false);
        if (e.key === "h") { e.preventDefault(); router.push("/"); return; }
        if (e.key === "s") { e.preventDefault(); router.push("/status"); return; }
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "g") {
        e.preventDefault();
        setGMode(true);
        gTimer = setTimeout(() => setGMode(false), 1000);
        return;
      }

      // [ / ] — defer to ProductKeyboardNav on product pages (it adds a toast)
      if (currentProductIdx() === -1) {
        if (e.key === "]") {
          e.preventDefault();
          router.push(`/products/${PRODUCTS[0].slug}`);
          return;
        }
        if (e.key === "[") {
          e.preventDefault();
          router.push(`/products/${PRODUCTS[PRODUCTS.length - 1].slug}`);
          return;
        }
      }

      if (/^[1-9]$/.test(e.key)) {
        const num = parseInt(e.key, 10);
        if (num <= PRODUCTS.length) {
          e.preventDefault();
          router.push(`/products/${PRODUCTS[num - 1].slug}`);
        }
        return;
      }
    }

    function onOpenEvent() { setOpen(true); }
    document.addEventListener("keydown", onKey);
    document.addEventListener("konjo:open-keyboard", onOpenEvent);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("konjo:open-keyboard", onOpenEvent);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [gMode, isInputFocused, router, currentProductIdx]);

  return (
    <>
      {/* g-mode indicator */}
      <AnimatePresence>
        {gMode && (
          <motion.div
            key="g-hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="text-konjo-mono fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-konjo-brand/40 bg-konjo-surface/90 px-4 py-2 text-xs text-konjo-fg backdrop-blur"
            aria-live="assertive"
            aria-label="Go mode active — press h for Home, s for Status"
          >
            <span style={{ color: "var(--color-konjo-brand)" }}>g</span>
            {" "}— press{" "}
            <kbd className="font-semibold text-konjo-fg">h</kbd> home ·{" "}
            <kbd className="font-semibold text-konjo-fg">s</kbd> status
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="kb-backdrop"
              className="fixed inset-0 z-50 bg-konjo-bg/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />

            <motion.div
              key="kb-panel"
              role="dialog"
              aria-label="Keyboard shortcuts"
              aria-modal
              className="glass-konjo rounded-konjo-xl fixed left-1/2 top-[20%] z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(124,58,237,0.35), 0 0 60px -10px rgba(124,58,237,0.22), 0 24px 64px -16px rgba(0,0,0,0.7)",
              }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.18, ease: ease.nehan }}
            >
              <div className="border-b border-konjo-line px-4 py-3">
                <p className="text-konjo-mono text-xs font-semibold uppercase tracking-widest text-konjo-fg-faint">
                  Keyboard shortcuts
                </p>
              </div>

              <div className="px-3 py-3">
                {GROUPS.map((group) => (
                  <div key={group} className="mb-3 last:mb-0">
                    <p className="text-konjo-mono mb-1.5 px-1 text-[9px] uppercase tracking-widest text-konjo-fg-faint">
                      {group}
                    </p>
                    {SHORTCUTS.filter((s) => s.group === group).map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center justify-between rounded-konjo px-2 py-1.5 hover:bg-konjo-surface/40"
                      >
                        <span className="text-xs text-konjo-fg-muted">{s.label}</span>
                        <div className="flex items-center gap-1">
                          {s.keys.map((k, i) => (
                            <kbd
                              key={i}
                              className="text-konjo-mono min-w-[22px] rounded border border-konjo-line bg-konjo-surface-2/60 px-1.5 py-0.5 text-center text-[10px] text-konjo-fg-muted"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="border-t border-konjo-line px-4 py-2">
                <p className="text-konjo-mono text-[10px] text-konjo-fg-faint">
                  Press <kbd className="rounded border border-konjo-line px-1 py-0.5">?</kbd> or{" "}
                  <kbd className="rounded border border-konjo-line px-1 py-0.5">Esc</kbd> to close
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
