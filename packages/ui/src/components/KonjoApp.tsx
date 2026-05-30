"use client";

import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { color, severity as severityToken } from "../lib/tokens";
import type { Severity } from "../lib/tokens";

export interface KonjoStatus {
  /** Status label. e.g. "live", "idle", "scanning". */
  label: string;
  /** Tint. Default "ok" for live, "info" for idle. */
  severity?: Severity;
  /** Pulse a dot beside the label. Default true. */
  pulse?: boolean;
}

export interface KonjoAppProps {
  /** Product name shown after the wordmark — e.g. "miru", "squash". */
  product: string;
  /** Single-line tagline rendered under the lockup. */
  tagline?: string;
  /** Right-aligned status pill. */
  status?: KonjoStatus;
  /** Additional content for the header right side (e.g. action buttons). */
  headerRight?: ReactNode;
  /** Aurora background. Default true. */
  aurora?: boolean;
  /** Page content. */
  children?: ReactNode;
  className?: string;
}

/**
 * Konjo brand wordmark — uppercase letterforms with a tracked-out monospace.
 * The trailing dot is a subtle Konjo signature.
 */
function Wordmark() {
  return (
    <span className="inline-flex items-baseline select-none">
      <span
        className="text-konjo-mono text-konjo-fg"
        style={{
          fontSize: 14,
          letterSpacing: "0.32em",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        konjo
      </span>
      <span
        aria-hidden
        className="ml-1 inline-block rounded-full"
        style={{
          width: 5,
          height: 5,
          background: color.accent,
          boxShadow: `0 0 8px ${color.accent}`,
        }}
      />
    </span>
  );
}

function StatusPill({ status }: { status: KonjoStatus }) {
  const c = severityToken[status.severity ?? "ok"];
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full glass-konjo px-3 py-1.5"
      role="status"
      aria-live="polite"
    >
      <span className="relative inline-flex items-center justify-center">
        <span
          className={cn("inline-block rounded-full", status.pulse !== false && "konjo-pulse")}
          style={{
            width: 7,
            height: 7,
            background: c,
            boxShadow: `0 0 10px ${c}`,
          }}
        />
      </span>
      <span
        className="text-konjo-mono uppercase tracking-[0.18em] text-konjo-fg"
        style={{ fontSize: 11 }}
      >
        {status.label}
      </span>
    </div>
  );
}

/**
 * Konjo App shell — the brand wrapper every flagship sits inside.
 *
 *   - Aurora background (animated, GPU-cheap, beautiful)
 *   - Header lockup: wordmark · product · tagline · status pill
 *   - Children receive a content container with sane padding
 *
 * Usage:
 *   <KonjoApp product="miru" tagline="The mind of the machine"
 *             status={{ label: "streaming" }}>
 *     ...your app...
 *   </KonjoApp>
 */
export function KonjoApp({
  product,
  tagline,
  status,
  headerRight,
  aurora = true,
  children,
  className,
}: KonjoAppProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full text-konjo-fg",
        aurora && "aurora-konjo",
        className,
      )}
    >
      {aurora && <div className="aurora-konjo-bg" aria-hidden />}
      <header className="px-6 py-5 border-b border-konjo-line/60 flex items-center gap-4">
        <Wordmark />
        <span className="text-konjo-fg-faint" aria-hidden>·</span>
        <span
          className="text-konjo-display text-konjo-fg"
          style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}
        >
          {product}
        </span>
        {tagline && (
          <span
            className="text-konjo-fg-muted hidden sm:inline"
            style={{ fontSize: 13 }}
          >
            {tagline}
          </span>
        )}
        <div className="ml-auto flex items-center gap-3">
          {headerRight}
          {status && <StatusPill status={status} />}
        </div>
      </header>
      <main className="px-6 py-8 max-w-[1400px] mx-auto">{children}</main>
    </div>
  );
}