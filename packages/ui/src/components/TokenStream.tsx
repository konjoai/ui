import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "../lib/cn";
import { ease } from "../lib/motion";

export interface StreamToken {
  /** Text content of this token. Whitespace counts. */
  text: string;
  /** Optional severity / colour tint (CSS color). Falls back to fg. */
  color?: string;
  /** Attention strength 0..1 — drives background opacity halo. */
  weight?: number;
  /** Stable identity. Provide if tokens may reorder; otherwise index is used. */
  id?: string | number;
}

export interface TokenStreamProps {
  tokens: StreamToken[];
  /** Show a blinking caret at the end. Default true. */
  cursor?: boolean;
  /** Auto-scroll to bottom as tokens append. Default true. */
  autoScroll?: boolean;
  /** Max height with scroll. Default unlimited. */
  maxHeight?: number | string;
  /** Mono / display font. Default mono. */
  font?: "mono" | "display";
  /** Visual density. Default "normal". */
  density?: "compact" | "normal" | "loose";
  className?: string;
  /** Called once per token after it mounts. Useful for sound/haptics. */
  onTokenAppear?: (token: StreamToken, index: number) => void;
}

/**
 * Konjo TokenStream — render an evolving list of tokens with optional
 * per-token color and attention-weight halo. Each newly-appended token fades
 * + slides in via `kanjo`; the parent owns streaming (SSE/WS hooks).
 *
 * Used by: miru (reasoning trace), squish (chat), kairu (decoded tokens),
 * kyro (agent thoughts), toki (model A/B responses).
 */
export function TokenStream({
  tokens,
  cursor = true,
  autoScroll = true,
  maxHeight,
  font = "mono",
  density = "normal",
  className,
  onTokenAppear,
}: TokenStreamProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const seenRef = useRef<Set<string | number>>(new Set());
  const lastCount = useRef(0);

  useEffect(() => {
    if (autoScroll && ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
    if (onTokenAppear) {
      for (let i = lastCount.current; i < tokens.length; i++) {
        const t = tokens[i];
        const key = t.id ?? i;
        if (!seenRef.current.has(key)) {
          seenRef.current.add(key);
          onTokenAppear(t, i);
        }
      }
    }
    lastCount.current = tokens.length;
  }, [tokens, autoScroll, onTokenAppear]);

  const lineHeight =
    density === "compact" ? "leading-snug" :
    density === "loose"   ? "leading-loose" : "leading-relaxed";

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-y-auto rounded-konjo bg-konjo-surface/60 px-4 py-3",
        "border border-konjo-line",
        font === "mono" ? "text-konjo-mono" : "text-konjo-display",
        lineHeight,
        className,
      )}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <span className="text-[15px] text-konjo-fg whitespace-pre-wrap break-words">
        <AnimatePresence initial={false}>
          {tokens.map((t, i) => {
            const key = t.id ?? i;
            const w = Math.max(0, Math.min(1, t.weight ?? 0));
            const bg = w > 0
              ? `color-mix(in oklch, ${t.color ?? "#7ad7ff"} ${Math.round(w * 35)}%, transparent)`
              : "transparent";
            return (
              <motion.span
                key={key}
                initial={reduce ? false : { opacity: 0, y: 4, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.22, ease: ease.kanjo }}
                style={{
                  color: t.color,
                  background: bg,
                  borderRadius: w > 0 ? 3 : undefined,
                  padding: w > 0 ? "0 2px" : undefined,
                }}
              >
                {t.text}
              </motion.span>
            );
          })}
        </AnimatePresence>
        {cursor && (
          <motion.span
            aria-hidden
            className="inline-block w-[0.55em] h-[1em] -mb-[0.1em] ml-[1px] align-baseline bg-konjo-accent"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.0, ease: ease.seishin, repeat: Infinity }}
          />
        )}
      </span>
    </div>
  );
}
