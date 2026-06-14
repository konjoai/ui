"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn, ease, StatusBadge, severity as sevColor } from "@konjoai/ui";
import { PRODUCTS } from "@/lib/products";

type RouterCtx = ReturnType<typeof useRouter>;

/** A global action item (non-product) in the palette. */
type PaletteAction = {
  id: string;
  icon: string;
  label: string;
  description: string;
  onRun: (ctx: { router: RouterCtx; close: () => void }) => void;
};

const GLOBAL_ACTIONS: PaletteAction[] = [
  {
    id: "status",
    icon: "◉",
    label: "System status",
    description: "Live health of all nine products",
    onRun: ({ router, close }) => { close(); router.push("/status"); },
  },
  {
    id: "keyboard",
    icon: "⌨",
    label: "Keyboard shortcuts",
    description: "Open the shortcuts reference panel",
    onRun: ({ close }) => {
      close();
      document.dispatchEvent(new CustomEvent("konjo:open-keyboard"));
    },
  },
  {
    id: "portfolio",
    icon: "↓",
    label: "Scroll to portfolio",
    description: "Jump to the nine-product grid",
    onRun: ({ close }) => {
      close();
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  {
    id: "heatmap",
    icon: "▦",
    label: "Inference heatmap",
    description: "9×24 live request-density grid",
    onRun: ({ close }) => {
      close();
      document.getElementById("heatmap")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  {
    id: "velocity",
    icon: "⚡",
    label: "Token velocity",
    description: "Live tok/s per product with flip digits",
    onRun: ({ close }) => {
      close();
      document.getElementById("velocity")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  {
    id: "leaderboard",
    icon: "◈",
    label: "Live leaderboard",
    description: "Product rankings that shift in real time",
    onRun: ({ close }) => {
      close();
      document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  {
    id: "signals",
    icon: "〰",
    label: "Signal monitor",
    description: "Nine oscilloscope waveform channels",
    onRun: ({ close }) => {
      close();
      document.getElementById("signals")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
  {
    id: "github",
    icon: "↗",
    label: "KonjoAI on GitHub",
    description: "Open github.com/konjoai in a new tab",
    onRun: ({ close }) => { close(); window.open("https://github.com/konjoai", "_blank", "noreferrer"); },
  },
];

type PaletteItem =
  | { kind: "product"; data: (typeof PRODUCTS)[number] }
  | { kind: "action"; data: PaletteAction };

/** Wraps the first occurrence of `query` inside `text` with an accent highlight span. */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-konjo-accent">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

/**
 * Keyboard-driven command palette — Cmd+K / Ctrl+K opens, Esc closes.
 * Supports product navigation and global actions. Responds to the
 * "konjo:open-palette" custom DOM event so SiteNav can trigger it
 * without shared state.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem("konjo:recent");
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch { /* storage unavailable */ }
  }, [open]);

  const q = query.toLowerCase();
  const filteredProducts = PRODUCTS.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q),
  );
  const filteredActions = GLOBAL_ACTIONS.filter(
    (a) => !q || a.label.toLowerCase().includes(q) || a.description.toLowerCase().includes(q),
  );

  const showRecent = !query && recent.length > 0;
  const recentProducts = recent
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof PRODUCTS)[number] => !!p);

  // Flat list for keyboard cursor: recent products first (if visible), then filtered products, then actions
  const displayList: PaletteItem[] = [
    ...(showRecent ? recentProducts : []).map((p): PaletteItem => ({ kind: "product", data: p })),
    ...(showRecent ? PRODUCTS : filteredProducts).map((p): PaletteItem => ({ kind: "product", data: p })),
    ...filteredActions.map((a): PaletteItem => ({ kind: "action", data: a })),
  ];

  useEffect(() => { setCursor(0); }, [query]);
  useEffect(() => { activeItemRef.current?.scrollIntoView({ block: "nearest" }); }, [cursor]);

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

  function close() { setOpen(false); }

  function runItem(item: PaletteItem) {
    if (item.kind === "product") {
      close();
      router.push(`/products/${item.data.slug}`);
    } else {
      item.data.onRun({ router, close });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((i) => Math.min(i + 1, displayList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && displayList[cursor]) {
      runItem(displayList[cursor]);
    }
  }

  // Split display list back into sections for rendering (with labels)
  const recentSection = showRecent ? recentProducts : [];
  const productSection = showRecent ? PRODUCTS : filteredProducts;
  const actionSection = filteredActions;

  // Base cursor offset for each section
  const recentOffset = 0;
  const productOffset = recentSection.length;
  const actionOffset = productOffset + productSection.length;

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
            aria-label="Command palette — navigate products and actions"
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
                placeholder="Search products and actions…"
                className="text-konjo-mono min-w-0 flex-1 bg-transparent text-sm text-konjo-fg placeholder:text-konjo-fg-faint focus:outline-none"
                aria-label="Search products and actions"
                aria-autocomplete="list"
                aria-controls="palette-list"
              />
              {query && (
                <span
                  className="text-konjo-mono shrink-0 text-[10px] tabular-nums text-konjo-fg-faint"
                  aria-live="polite"
                  aria-label={`${filteredProducts.length + filteredActions.length} result${filteredProducts.length + filteredActions.length !== 1 ? "s" : ""}`}
                >
                  {filteredProducts.length + filteredActions.length}
                </span>
              )}
              <kbd className="text-konjo-mono hidden rounded border border-konjo-line px-1.5 py-0.5 text-[10px] text-konjo-fg-faint sm:inline">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <ul
              id="palette-list"
              role="listbox"
              aria-label="Products and actions"
              className="max-h-80 overflow-y-auto py-1.5"
            >
              {/* Recently viewed */}
              {recentSection.length > 0 && (
                <>
                  <li role="presentation" className="px-3 pb-1 pt-2">
                    <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
                      Recently viewed
                    </span>
                  </li>
                  {recentSection.map((p, i) => {
                    const idx = recentOffset + i;
                    return (
                      <li key={`recent-${p.slug}`} role="option" aria-selected={idx === cursor}>
                        <button
                          ref={idx === cursor ? activeItemRef : undefined}
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent",
                            idx === cursor
                              ? "bg-konjo-surface-2 text-konjo-fg"
                              : "text-konjo-fg-muted hover:bg-konjo-surface/60 hover:text-konjo-fg",
                          )}
                          onMouseEnter={() => setCursor(idx)}
                          onClick={() => runItem({ kind: "product", data: p })}
                        >
                          <span className="text-konjo-mono w-7 shrink-0 text-center text-xl leading-none" style={{ color: "var(--color-konjo-brand-soft)" }} aria-hidden>{p.glyph}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-konjo-mono text-sm font-medium">{p.name}</p>
                            <p className="truncate text-xs text-konjo-fg-faint">{p.tagline}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span
                              className="text-konjo-mono text-[10px] tabular-nums hidden sm:inline"
                              style={{ color: sevColor[p.metric.severity] }}
                            >
                              {Number.isInteger(p.metric.value) ? p.metric.value : p.metric.value.toFixed(1)}{p.metric.unit}
                            </span>
                            <StatusBadge level={p.status} />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                  <li role="separator" className="mx-3 my-1.5 border-t border-konjo-line" aria-hidden />
                  <li role="presentation" className="px-3 pb-1 pt-1">
                    <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">All products</span>
                  </li>
                </>
              )}

              {/* Products */}
              {productSection.length === 0 && actionSection.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-konjo-fg-faint">
                  No results for &ldquo;{query}&rdquo;
                </li>
              ) : (
                productSection.map((p, i) => {
                  const idx = productOffset + i;
                  return (
                    <li key={p.slug} role="option" aria-selected={idx === cursor}>
                      <button
                        ref={idx === cursor ? activeItemRef : undefined}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent",
                          idx === cursor
                            ? "bg-konjo-surface-2 text-konjo-fg"
                            : "text-konjo-fg-muted hover:bg-konjo-surface/60 hover:text-konjo-fg",
                        )}
                        onMouseEnter={() => setCursor(idx)}
                        onClick={() => runItem({ kind: "product", data: p })}
                      >
                        <span className="text-konjo-mono w-7 shrink-0 text-center text-xl leading-none" style={{ color: "var(--color-konjo-brand-soft)" }} aria-hidden>{p.glyph}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-konjo-mono text-sm font-medium">
                            <Highlight text={p.name} query={query} />
                          </p>
                          <p className="truncate text-xs text-konjo-fg-faint">
                            <Highlight text={p.tagline} query={query} />
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className="text-konjo-mono text-[10px] tabular-nums hidden sm:inline"
                            style={{ color: sevColor[p.metric.severity] }}
                          >
                            {Number.isInteger(p.metric.value) ? p.metric.value : p.metric.value.toFixed(1)}{p.metric.unit}
                          </span>
                          <StatusBadge level={p.status} />
                        </div>
                      </button>
                    </li>
                  );
                })
              )}

              {/* Actions */}
              {actionSection.length > 0 && (
                <>
                  <li role="separator" className="mx-3 my-1.5 border-t border-konjo-line" aria-hidden />
                  <li role="presentation" className="px-3 pb-1 pt-1">
                    <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">Actions</span>
                  </li>
                  {actionSection.map((a, i) => {
                    const idx = actionOffset + i;
                    return (
                      <li key={a.id} role="option" aria-selected={idx === cursor}>
                        <button
                          ref={idx === cursor ? activeItemRef : undefined}
                          type="button"
                          className={cn(
                            "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-konjo-accent",
                            idx === cursor
                              ? "bg-konjo-surface-2 text-konjo-fg"
                              : "text-konjo-fg-muted hover:bg-konjo-surface/60 hover:text-konjo-fg",
                          )}
                          onMouseEnter={() => setCursor(idx)}
                          onClick={() => runItem({ kind: "action", data: a })}
                        >
                          <span className="text-konjo-mono w-7 shrink-0 text-center text-base leading-none text-konjo-fg-faint" aria-hidden>{a.icon}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-konjo-mono text-sm font-medium">
                              <Highlight text={a.label} query={query} />
                            </p>
                            <p className="truncate text-xs text-konjo-fg-faint">
                              <Highlight text={a.description} query={query} />
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>

            {/* Keyboard hints */}
            <div className="border-t border-konjo-line px-4 py-2">
              <div className="text-konjo-mono flex items-center gap-4 text-[10px] text-konjo-fg-faint">
                <span><kbd className="rounded border border-konjo-line px-1 py-0.5">↑↓</kbd>{" "}navigate</span>
                <span><kbd className="rounded border border-konjo-line px-1 py-0.5">↵</kbd>{" "}run</span>
                <span><kbd className="rounded border border-konjo-line px-1 py-0.5">Esc</kbd>{" "}close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
