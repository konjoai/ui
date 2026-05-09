import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";
import { color } from "../lib/tokens";
import { ease } from "../lib/motion";

export type StageStatus = "pending" | "active" | "done" | "error";

export interface Stage {
  id: string;
  label: string;
  status: StageStatus;
  /** Optional duration shown under the label, e.g. "12 ms". */
  durationMs?: number;
  /** Optional sublabel — e.g. "12 docs · top score 0.87". */
  detail?: string;
}

export interface StagePipelineProps {
  stages: Stage[];
  /** Vertical orientation. Default false (horizontal). */
  vertical?: boolean;
  onStageClick?: (id: string) => void;
  className?: string;
}

const STATUS_COLOR: Record<StageStatus, string> = {
  pending: color.fgFaint,
  active:  color.accent,
  done:    color.good,
  error:   color.hot,
};

/**
 * Konjo StagePipeline — a flow of stages for a multi-step process.
 *
 * Used by: kyro (RAG retrieval pipeline), vectro (quantization stages),
 * squash (compliance scan stages), kairu (decode pipeline), squish (prefill →
 * decode → detok).
 *
 * Each stage shows status, label, optional duration, optional detail. Active
 * stages pulse via `seishin`. Connectors fill in left-to-right as upstream
 * stages complete.
 */
export function StagePipeline({
  stages,
  vertical = false,
  onStageClick,
  className,
}: StagePipelineProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "flex w-full",
        vertical ? "flex-col items-stretch gap-0" : "flex-row items-stretch gap-0",
        className,
      )}
      role="list"
    >
      {stages.map((stage, i) => {
        const last = i === stages.length - 1;
        const c = STATUS_COLOR[stage.status];
        const isClickable = !!onStageClick;
        return (
          <div
            key={stage.id}
            role="listitem"
            className={cn(
              "flex",
              vertical ? "flex-col items-start" : "flex-row items-center",
              "flex-1 min-w-0",
            )}
          >
            {/* Node */}
            <button
              type="button"
              onClick={isClickable ? () => onStageClick!(stage.id) : undefined}
              disabled={!isClickable}
              className={cn(
                "group relative flex flex-col items-start text-left",
                "rounded-konjo px-3 py-2 min-w-0 w-full",
                isClickable && "hover:bg-konjo-surface-2/60 transition-colors",
                "border border-konjo-line bg-konjo-surface/60",
              )}
              aria-current={stage.status === "active" ? "step" : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="relative inline-flex items-center justify-center">
                  <span
                    aria-hidden
                    className="block rounded-full"
                    style={{
                      width: 10,
                      height: 10,
                      background: c,
                      boxShadow: stage.status === "active" ? `0 0 12px ${c}` : undefined,
                    }}
                  />
                  {stage.status === "active" && !reduce && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full"
                      style={{ background: c }}
                      animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.2, 1] }}
                      transition={{ duration: 1.4, ease: ease.seishin, repeat: Infinity }}
                    />
                  )}
                </span>
                <span className="text-[13px] text-konjo-fg font-medium truncate">
                  {stage.label}
                </span>
                {stage.durationMs != null && (
                  <span className="text-konjo-mono text-[11px] text-konjo-fg-muted ml-auto tabular-nums">
                    {stage.durationMs.toFixed(stage.durationMs < 10 ? 1 : 0)}ms
                  </span>
                )}
              </div>
              {stage.detail && (
                <div className="text-konjo-mono text-[11px] text-konjo-fg-muted mt-1 truncate w-full">
                  {stage.detail}
                </div>
              )}
            </button>

            {/* Connector */}
            {!last && (
              <div
                aria-hidden
                className={cn(
                  "relative shrink-0",
                  vertical ? "h-4 w-full" : "w-4 h-full self-stretch",
                )}
              >
                <div
                  className="absolute"
                  style={{
                    background: color.lineSoft,
                    ...(vertical
                      ? { left: "50%", top: 0, bottom: 0, width: 2, transform: "translateX(-50%)" }
                      : { top: "50%", left: 0, right: 0, height: 2, transform: "translateY(-50%)" }),
                  }}
                />
                <motion.div
                  className="absolute"
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={{
                    scaleX: vertical ? 1 : stage.status === "done" ? 1 : 0,
                    scaleY: vertical ? (stage.status === "done" ? 1 : 0) : 1,
                  }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: ease.kanjo }}
                  style={{
                    background: c,
                    transformOrigin: vertical ? "top" : "left",
                    boxShadow: `0 0 8px ${c}`,
                    ...(vertical
                      ? { left: "50%", top: 0, bottom: 0, width: 2, transform: "translateX(-50%)" }
                      : { top: "50%", left: 0, right: 0, height: 2, transform: "translateY(-50%)" }),
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
