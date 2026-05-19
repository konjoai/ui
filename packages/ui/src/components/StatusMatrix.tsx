import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";
import { color } from "../lib/tokens";
import { ease } from "../lib/motion";

/** A single cell in a StatusMatrix row. */
export interface StatusCell {
  /** Short label for the cell — e.g. the check name. */
  label?: string;
  status: CellStatus;
  /** Detail text for screen readers and title tooltips. */
  detail?: string;
}

/** Pass/fail/warn/skip/pending — the five outcomes a compliance check can reach. */
export type CellStatus = "pass" | "fail" | "warn" | "skip" | "pending";

/** One row in a StatusMatrix — a named category with N cells. */
export interface StatusMatrixRow {
  /** Row header — e.g. "Article 9 – Risk Management". */
  label: string;
  cells: StatusCell[];
}

/** Props for StatusMatrix. */
export interface StatusMatrixProps {
  rows: StatusMatrixRow[];
  /** Column header labels. Should match cells-per-row count. */
  columns?: string[];
  /** Show a pass/fail/warn summary footer. Default true. */
  showSummary?: boolean;
  className?: string;
}

const STATUS_COLOR: Record<CellStatus, string> = {
  pass:    color.good,
  fail:    color.hot,
  warn:    color.warm,
  skip:    color.fgFaint,
  pending: color.fgFaint,
};

const STATUS_ICON: Record<CellStatus, string> = {
  pass:    "✓",
  fail:    "✕",
  warn:    "△",
  skip:    "–",
  pending: "·",
};

/**
 * Konjo StatusMatrix — a grid of pass/fail/warn cells for compliance and quality dashboards.
 *
 * Used by squash (EU AI Act article-by-article compliance) and toki (attack vs. defence
 * matrix). Rows represent categories/articles; columns represent checks/requirements.
 * Rows stagger in via `kanjo` on mount.
 */
export function StatusMatrix({
  rows,
  columns,
  showSummary = true,
  className,
}: StatusMatrixProps) {
  const reduce = useReducedMotion();
  if (rows.length === 0) return null;

  const colCount = Math.max(...rows.map((r) => r.cells.length));
  const allCells = rows.flatMap((r) => r.cells);
  const counts: Record<CellStatus, number> = {
    pass:    allCells.filter((c) => c.status === "pass").length,
    fail:    allCells.filter((c) => c.status === "fail").length,
    warn:    allCells.filter((c) => c.status === "warn").length,
    skip:    allCells.filter((c) => c.status === "skip").length,
    pending: allCells.filter((c) => c.status === "pending").length,
  };

  return (
    <div
      role="table"
      aria-label="Status matrix"
      className={cn("w-full", className)}
    >
      {/* Column headers */}
      {columns && (
        <div role="row" className="flex items-center gap-1 mb-1">
          <div className="w-[148px] shrink-0" aria-hidden />
          {Array.from({ length: colCount }).map((_, ci) => (
            <div
              key={ci}
              role="columnheader"
              className="flex-1 text-center text-konjo-mono text-[10px] uppercase tracking-[0.14em] text-konjo-fg-muted truncate"
            >
              {columns[ci] ?? ""}
            </div>
          ))}
        </div>
      )}

      {/* Data rows */}
      <div className="flex flex-col gap-1">
        {rows.map((row, ri) => (
          <motion.div
            key={row.label}
            role="row"
            className="flex items-center gap-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : ri * 0.05,
              duration: reduce ? 0 : 0.38,
              ease: ease.kanjo,
            }}
          >
            <div
              role="rowheader"
              className="w-[148px] shrink-0 text-[12px] text-konjo-fg-muted text-konjo-mono truncate pr-2"
              title={row.label}
            >
              {row.label}
            </div>
            {Array.from({ length: colCount }).map((_, ci) => {
              const cell = row.cells[ci];
              if (!cell) {
                return (
                  <div
                    key={ci}
                    role="cell"
                    className="flex-1 h-7 rounded border border-konjo-line/30"
                  />
                );
              }
              const c = STATUS_COLOR[cell.status];
              const ariaLabel = [
                cell.label ?? columns?.[ci] ?? `column ${ci + 1}`,
                cell.status,
                cell.detail,
              ]
                .filter(Boolean)
                .join(" — ");
              return (
                <div
                  key={ci}
                  role="cell"
                  aria-label={ariaLabel}
                  title={cell.detail}
                  className="flex-1 h-7 flex items-center justify-center rounded border"
                  style={{ borderColor: `${c}40`, backgroundColor: `${c}14` }}
                >
                  <span
                    aria-hidden
                    className="text-[13px] font-medium leading-none select-none"
                    style={{ color: c }}
                  >
                    {STATUS_ICON[cell.status]}
                  </span>
                </div>
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* Summary footer */}
      {showSummary && (
        <div
          role="row"
          aria-label="Summary"
          className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-konjo-line/40 text-konjo-mono text-[11px]"
        >
          {(["pass", "fail", "warn", "skip", "pending"] as CellStatus[])
            .filter((s) => counts[s] > 0)
            .map((s) => (
              <div key={s} className="flex items-center gap-1">
                <span aria-hidden style={{ color: STATUS_COLOR[s] }}>
                  {STATUS_ICON[s]}
                </span>
                <span style={{ color: STATUS_COLOR[s] }}>{counts[s]}</span>
                <span className="text-konjo-fg-muted">{s}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
