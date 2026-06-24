"use client";

import { useState, useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";

// Deliberately keep Konjo-brand characters mixed with latin for flavour
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ◈◇◐✸▲⬡◉❖⌬✦█▓░0123456789";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

/**
 * Reveals text with a left-to-right character scramble animation on scroll entry.
 * Server-renders the final text so there is no hydration mismatch; the scramble
 * fires only client-side once the element enters the viewport.
 * Respects prefers-reduced-motion — shows the final text immediately.
 */
export function ScrambleText({
  text,
  className,
  as: Tag = "span",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: HeadingTag;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const [displayed, setDisplayed] = useState(text);
  const triggered = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!inView || reduce || triggered.current) return;
    triggered.current = true;

    const DURATION = 620;

    const delayTimer = setTimeout(() => {
      // Briefly flash to random chars, then reveal L→R
      setDisplayed(
        text
          .split("")
          .map((c) => (c === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(""),
      );

      let start: number | null = null;
      function tick(ts: number) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / DURATION, 1);

        setDisplayed(
          text
            .split("")
            .map((c, i) => {
              if (c === " ") return " ";
              if (i / text.length <= progress) return c;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join(""),
        );

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDisplayed(text);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [inView, reduce, text, delay]);

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
    >
      {displayed}
    </Tag>
  );
}
