"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

/** 90-day uptime history — deterministic seed matching the toki incident on days 20–22. */
function generateDays(): { date: string; uptime: number }[] {
  const days: { date: string; uptime: number }[] = [];
  const now = Date.now();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000);
    const label = d.toISOString().slice(0, 10);
    const incident = i >= 20 && i <= 22;
    const uptime = incident
      ? 85 + Math.sin(i * 1.3 + 5) * 4
      : 99.1 + Math.sin(i * 0.7 + 2) * 0.7;
    days.push({ date: label, uptime: Math.min(100, Math.max(0, uptime)) });
  }
  return days;
}

const DAYS = generateDays();

function cellColor(uptime: number): string {
  if (uptime >= 99.5) return "var(--color-konjo-good)";
  if (uptime >= 95)   return "var(--color-konjo-warm)";
  return "var(--color-konjo-hot)";
}

function cellOpacity(uptime: number): number {
  if (uptime >= 99.5) return 0.7;
  if (uptime >= 95)   return 0.65;
  return 0.75;
}

/** GitHub-style 90-day uptime calendar with hover tooltips and staggered entrance. */
export function UptimeCalendar() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState<number | null>(null);

  const rows = 7;
  const cols = Math.ceil(DAYS.length / rows);

  return (
    <div ref={ref}>
      <p className="text-konjo-mono mb-3 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
        90-day uptime history
      </p>

      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        aria-label="90-day uptime calendar"
        role="grid"
      >
        {DAYS.map((day, i) => {
          const col = Math.floor(i / rows);
          const delay = reduce ? 0 : col * 0.012;
          const isHovered = hovered === i;

          return (
            <motion.div
              key={day.date}
              role="gridcell"
              aria-label={`${day.date}: ${day.uptime.toFixed(1)}% uptime`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={inView ? { opacity: cellOpacity(day.uptime), scale: 1 } : { opacity: 0, scale: 0.4 }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.25, delay, ease: "easeOut" }
              }
              whileHover={{ scale: 1.4, opacity: 1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative aspect-square rounded-[2px] cursor-default"
              style={{ background: cellColor(day.uptime) }}
            >
              {/* Tooltip */}
              {isHovered && (
                <div
                  className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-konjo border border-konjo-line/60 bg-konjo-surface px-2.5 py-1.5 text-[10px] text-konjo-fg shadow-lg"
                  role="tooltip"
                >
                  <span className="text-konjo-mono font-medium">{day.date}</span>
                  <span className="ml-2 tabular-nums" style={{ color: cellColor(day.uptime) }}>
                    {day.uptime.toFixed(1)}%
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="text-konjo-mono mt-3 flex items-center gap-4 text-[10px] text-konjo-fg-faint">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-[2px]" style={{ background: "var(--color-konjo-good)", opacity: 0.7 }} aria-hidden />
          ≥ 99.5%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-[2px]" style={{ background: "var(--color-konjo-warm)", opacity: 0.65 }} aria-hidden />
          ≥ 95%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-[2px]" style={{ background: "var(--color-konjo-hot)", opacity: 0.75 }} aria-hidden />
          &lt; 95%
        </span>
      </div>
    </div>
  );
}
