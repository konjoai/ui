import { cn } from "../lib/cn";

export type StatusLevel = "operational" | "degraded" | "outage" | "research" | "checking";

export interface StatusBadgeProps {
  level: StatusLevel;
  /** Optional human label override. Defaults to the level's canonical text. */
  label?: string;
  /** Optional ISO timestamp of last check — rendered as `· hh:mm:ss UTC`. */
  lastCheckedAt?: string;
  /** Pulse the dot — for "live" health checks. Default true for operational, false otherwise. */
  pulse?: boolean;
  className?: string;
}

const LABEL: Record<StatusLevel, string> = {
  operational: "Operational",
  degraded:    "Degraded",
  outage:      "Outage",
  research:    "Research",
  checking:    "Checking",
};

const DOT_CLASS: Record<StatusLevel, string> = {
  operational: "bg-konjo-good",
  degraded:    "bg-konjo-warm",
  outage:      "bg-konjo-hot",
  research:    "bg-konjo-violet",
  checking:    "bg-konjo-fg-faint",
};

const PILL_CLASS: Record<StatusLevel, string> = {
  operational: "text-konjo-good   border-konjo-good/30",
  degraded:    "text-konjo-warm   border-konjo-warm/30",
  outage:      "text-konjo-hot    border-konjo-hot/30",
  research:    "text-konjo-violet border-konjo-violet/30",
  checking:    "text-konjo-fg-muted border-konjo-line",
};

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
}

/**
 * Konjo StatusBadge — small pill summarizing a service's health.
 *
 * Used by the /status page and inline anywhere a "live" indicator is needed.
 * Server-rendering safe (no hooks). Honors prefers-reduced-motion via CSS.
 */
export function StatusBadge({
  level,
  label,
  lastCheckedAt,
  pulse,
  className,
}: StatusBadgeProps) {
  const showPulse = pulse ?? level === "operational";
  return (
    <span
      role="status"
      aria-label={`${LABEL[level]}${label ? ` — ${label}` : ""}`}
      className={cn(
        "text-konjo-mono inline-flex items-center gap-2 rounded-full border bg-konjo-surface/40 px-2.5 py-1 text-[11px] backdrop-blur",
        PILL_CLASS[level],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-block size-1.5 rounded-full",
          DOT_CLASS[level],
          showPulse && "konjo-pulse motion-reduce:animate-none",
        )}
      />
      <span>{label ?? LABEL[level]}</span>
      {lastCheckedAt ? (
        <span className="text-konjo-fg-faint">· {formatTimestamp(lastCheckedAt)}</span>
      ) : null}
    </span>
  );
}
