"use client";

import { useEffect } from "react";
import { toast } from "@/lib/toast";
import { PRODUCTS } from "@/lib/products";

/**
 * Fires a personalized "welcome back" toast once per session when the user
 * has previously visited product pages. Uses sessionStorage to avoid
 * repeating on every navigation within the same tab.
 */
export function WelcomeBack() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("konjo:welcomed")) return;
      const raw = localStorage.getItem("konjo:recent");
      if (!raw) return;
      const slugs = JSON.parse(raw) as string[];
      if (slugs.length === 0) return;
      sessionStorage.setItem("konjo:welcomed", "1");
      const first = PRODUCTS.find((p) => p.slug === slugs[0]);
      if (!first) return;
      const others = slugs.length - 1;
      const msg =
        others > 0
          ? `Welcome back — ${first.glyph} ${first.name} +${others} more`
          : `Welcome back — ${first.glyph} ${first.name}`;
      setTimeout(() => toast(msg, "info"), 900);
    } catch { /* storage unavailable */ }
  }, []);

  return null;
}
