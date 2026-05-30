"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";
import { color, severity as severityToken } from "../lib/tokens";
import type { Severity } from "../lib/tokens";
import { ease } from "../lib/motion";

/** A single item in a RankList. */
export interface RankListItem {
  /** Document title, chunk label, model name, or any ranked entity. */
  label: string;
  /** Relevance / quality score. Scaled against `maxScore`. */
  score: number;
  /** Optional second line — e.g. source path, dataset name. */
  sublabel?: string;
  /** Explicit rank badge. Defaults to 1-based list position. */
  rank?: number;
  /** Color tint override. Auto-computed from score / maxScore when omitted. */
  severity?: Severity;
}

/** Props for RankList. */
export interface RankListProps {
  items: RankListItem[];
  /** Maximum score for bar scaling and auto-severity. Default 1. */
  maxScore?: number;
  /** Suffix after the score — e.g. "%", "BM25". */
  scoreUnit?: string;
  /** Decimal places in the score readout. Default 3. */
  scoreDecimals?: number;
  className?: string;
}

function scoreSeverity(score: number, max: number): Severity {
  const r = max > 0 ? score / max : 0;
  if (r >= 0.75) return "ok";
  if (r >= 0.5)  return "info";
  if (r >= 0.25) return "warn";
  return "high";
}

/**
 * Konjo RankList — a scored, ranked list with relevance score bars.
 *
 * Used by kyro (retrieval results with NDCG/MRR scores), miru (reasoning steps
 * ranked by attention weight), toki (adversarial attacks ranked by severity).
 * Items stagger in on mount; score bars fill from the left via `kanjo`.
 */
export function RankList({
  items,
  maxScore = 1,
  scoreUnit,
  scoreDecimals = 3,
  className,
}: RankListProps) {
  const reduce = useReducedMotion();
  if (items.length === 0) return null;

  return (
    <ol
      role="list"
      aria-label="Ranked list"
      className={cn("flex flex-col gap-1.5", className)}
    >
      {items.map((item, i) => {
        const rank = item.rank ?? i + 1;
        const sev = item.severity ?? scoreSeverity(item.score, maxScore);
        const c = severityToken[sev];
        const barPct = maxScore > 0 ? Math.min(1, item.score / maxScore) : 0;
        const display = item.score.toFixed(scoreDecimals);
        const ariaLabel = `#${rank}: ${item.label}, score ${display}${scoreUnit ? ` ${scoreUnit}` : ""}`;

        return (
          <motion.li
            key={`${item.label}-${i}`}
            aria-label={ariaLabel}
            className={cn(
              "flex items-center gap-3",
              "rounded-konjo px-3 py-2",
              "bg-konjo-surface/60 border border-konjo-line",
            )}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduce ? 0 : i * 0.05,
              duration: reduce ? 0 : 0.32,
              ease: ease.kanjo,
            }}
          >
            {/* Rank badge */}
            <div
              aria-hidden
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-konjo-mono text-[11px] font-medium"
              style={{
                background: `${c}20`,
                color: c,
                border: `1px solid ${c}40`,
              }}
            >
              {rank}
            </div>

            {/* Label + sublabel + bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] text-konjo-fg font-medium truncate">
                  {item.label}
                </span>
                <span
                  className="shrink-0 text-konjo-mono text-[11px] tabular-nums"
                  style={{ color: c }}
                >
                  {display}
                  {scoreUnit && (
                    <span className="text-konjo-fg-muted ml-0.5 text-[10px]">{scoreUnit}</span>
                  )}
                </span>
              </div>

              {item.sublabel && (
                <div className="text-[11px] text-konjo-fg-muted text-konjo-mono mt-0.5 truncate">
                  {item.sublabel}
                </div>
              )}

              {/* Score bar */}
              <div
                aria-hidden
                className="mt-1.5 h-[3px] w-full rounded-full"
                style={{ background: color.line }}
              >
                <motion.div
                  className="h-full rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: barPct }}
                  transition={{
                    delay: reduce ? 0 : i * 0.05 + 0.1,
                    duration: reduce ? 0 : 0.65,
                    ease: ease.kanjo,
                  }}
                  style={{
                    transformOrigin: "left",
                    width: "100%",
                    background: c,
                    boxShadow: `0 0 6px ${c}`,
                  }}
                />
              </div>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}