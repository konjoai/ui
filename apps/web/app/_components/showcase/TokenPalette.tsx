"use client";

import { useState, useCallback } from "react";

type Swatch = { name: string; var: string; label: string };

const GROUPS: { title: string; swatches: Swatch[] }[] = [
  {
    title: "Brand",
    swatches: [
      { name: "brand",      var: "--color-konjo-brand",      label: "Brand"      },
      { name: "brand-soft", var: "--color-konjo-brand-soft", label: "Brand soft" },
      { name: "accent",     var: "--color-konjo-accent",     label: "Accent"     },
      { name: "violet",     var: "--color-konjo-violet",     label: "Violet"     },
    ],
  },
  {
    title: "Status",
    swatches: [
      { name: "good",  var: "--color-konjo-good",  label: "Good / OK"  },
      { name: "warm",  var: "--color-konjo-warm",  label: "Warn"       },
      { name: "hot",   var: "--color-konjo-hot",   label: "Error"      },
      { name: "cool",  var: "--color-konjo-cool",  label: "Info"       },
    ],
  },
  {
    title: "Foreground",
    swatches: [
      { name: "fg",        var: "--color-konjo-fg",        label: "Foreground"       },
      { name: "fg-muted",  var: "--color-konjo-fg-muted",  label: "Muted"            },
      { name: "fg-faint",  var: "--color-konjo-fg-faint",  label: "Faint"            },
    ],
  },
  {
    title: "Surface",
    swatches: [
      { name: "surface",   var: "--color-konjo-surface",   label: "Surface"          },
      { name: "surface-2", var: "--color-konjo-surface-2", label: "Surface 2"        },
      { name: "line",      var: "--color-konjo-line",      label: "Border"           },
    ],
  },
];

/** Single clickable swatch that copies the CSS var name on click. */
function Swatch({ swatch, onCopy }: { swatch: Swatch; onCopy: (v: string) => void }) {
  return (
    <button
      type="button"
      title={`Copy ${swatch.var}`}
      onClick={() => onCopy(swatch.var)}
      className="group flex flex-col items-center gap-2 rounded-konjo p-2 transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
    >
      <div
        className="size-10 rounded-konjo border border-konjo-line/30 shadow-sm transition-all group-hover:ring-2 group-hover:ring-konjo-accent/40"
        style={{ background: `var(${swatch.var})` }}
        aria-hidden
      />
      <span className="text-konjo-mono max-w-[72px] truncate text-center text-[9px] leading-tight text-konjo-fg-faint">
        {swatch.label}
      </span>
    </button>
  );
}

/**
 * Interactive color token showcase — click any swatch to copy its CSS variable name.
 * Organized by category: Brand, Status, Foreground, Surface.
 */
export function TokenPalette() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = useCallback((varName: string) => {
    navigator.clipboard.writeText(`var(${varName})`).catch(() => {});
    setCopied(varName);
    document.dispatchEvent(
      new CustomEvent("konjo:toast", {
        detail: { message: `Copied var(${varName})`, tone: "success" },
      }),
    );
    setTimeout(() => setCopied(null), 1800);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
        Design tokens · click any swatch to copy the CSS variable
      </p>
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            {group.title}
          </p>
          <div className="flex flex-wrap gap-3">
            {group.swatches.map((sw) => (
              <div key={sw.var} className="relative">
                <Swatch swatch={sw} onCopy={handleCopy} />
                {copied === sw.var && (
                  <span
                    className="text-konjo-mono pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-konjo-surface px-1.5 py-0.5 text-[9px] text-konjo-good shadow"
                    aria-live="polite"
                  >
                    ✓ copied
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
