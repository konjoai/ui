"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simulates a live "online now" visitor count that fluctuates subtly.
 * Count starts high during first render (seeded from sessionStorage for
 * consistency within a session) then drifts ±1–2 every 8–14 seconds.
 * Meant purely as a social signal; clearly simulated.
 */
export function OnlineCount() {
  const [count, setCount] = useState<number | null>(null);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    let base: number;
    try {
      const stored = sessionStorage.getItem("konjo:online");
      base = stored ? parseInt(stored, 10) : randInt(28, 64);
      sessionStorage.setItem("konjo:online", String(base));
    } catch {
      base = randInt(28, 64);
    }
    setCount(base);

    const id = setInterval(() => {
      setCount((c) => {
        if (c === null) return c;
        const delta = randInt(-2, 2);
        const next = Math.max(12, Math.min(99, c + delta));
        setPrev(c);
        return next;
      });
    }, randInt(8000, 14000));

    return () => clearInterval(id);
  }, []);

  if (count === null) return null;

  const dir = prev !== null && count > prev ? 1 : -1;

  return (
    <span
      className="text-konjo-mono inline-flex items-center gap-1.5 text-[10px] text-konjo-fg-faint"
      aria-label={`${count} people online now`}
    >
      <span className="konjo-pulse inline-block size-1.5 rounded-full bg-konjo-good" aria-hidden />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={{ y: dir * 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -dir * 8, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="tabular-nums"
        >
          {count}
        </motion.span>
      </AnimatePresence>
      <span>online</span>
    </span>
  );
}
