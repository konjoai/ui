"use client";

import { useState, useEffect, useRef } from "react";
import type { StreamToken, TimeSeriesPoint } from "@konjoai/ui";

/** Stream tokens one by one on an interval, looping forever. */
export function useStreamTokens(all: StreamToken[], ms: number): StreamToken[] {
  const [tokens, setTokens] = useState<StreamToken[]>([]);
  const i = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (i.current < all.length) {
        i.current += 1;
        setTokens(all.slice(0, i.current));
      } else {
        i.current = 0;
        setTokens([]);
      }
    }, ms);
    return () => clearInterval(id);
  }, [all, ms]);
  return tokens;
}

/** Advance a stage index 0..n on an interval, cycling. */
export function usePipelineTick(n: number, ms: number): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % (n + 1)), ms);
    return () => clearInterval(id);
  }, [n, ms]);
  return tick;
}

/**
 * Append one generated data point every `ms` ms, keeping at most
 * `maxPoints` entries. `gen(t)` receives a monotonic counter starting
 * at 0 and incrementing by `ms` on each tick.
 */
export function useLiveTimeSeries(
  seed: TimeSeriesPoint[],
  ms: number,
  maxPoints: number,
  gen: (t: number) => number,
): TimeSeriesPoint[] {
  const [data, setData] = useState<TimeSeriesPoint[]>(seed);
  const genRef = useRef(gen);
  genRef.current = gen;
  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += ms;
      setData((prev) => [
        ...prev.slice(-(maxPoints - 1)),
        { t, value: genRef.current(t) },
      ]);
    }, ms);
    return () => clearInterval(id);
  }, [ms, maxPoints]);
  return data;
}
