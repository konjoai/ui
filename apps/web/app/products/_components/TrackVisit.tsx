"use client";

import { useEffect } from "react";

const STORAGE_KEY = "konjo:recent";
const MAX_RECENT = 5;

/** Silently records this product slug in localStorage on mount. */
export function TrackVisit({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable (private mode, etc.) — silently skip
    }
  }, [slug]);
  return null;
}
