"use client";

import { useEffect } from "react";

const AWAY_TITLES = [
  "Still here 👋 · KonjoAI",
  "9 products building... · KonjoAI",
  "Come back! · KonjoAI",
];

/**
 * Cycles through friendly browser-tab messages while the user is away,
 * restoring the original title on return. Easter egg — no visible UI.
 */
export function PageTitleEffect() {
  useEffect(() => {
    const originalTitle = document.title;
    let timer: ReturnType<typeof setInterval> | null = null;
    let idx = 0;

    function onVisibilityChange() {
      if (document.hidden) {
        timer = setInterval(() => {
          document.title = AWAY_TITLES[idx % AWAY_TITLES.length];
          idx++;
        }, 2200);
      } else {
        if (timer) clearInterval(timer);
        timer = null;
        idx = 0;
        document.title = originalTitle;
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timer) clearInterval(timer);
      document.title = originalTitle;
    };
  }, []);

  return null;
}
