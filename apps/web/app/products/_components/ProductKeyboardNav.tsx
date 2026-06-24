"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/lib/products";
import { toast } from "@/lib/toast";

interface ProductKeyboardNavProps {
  currentSlug: string;
}

/**
 * Keyboard navigation between products — press [ for previous, ] for next.
 * Wraps around the PRODUCTS array and fires a toast naming the destination.
 */
export function ProductKeyboardNav({ currentSlug }: ProductKeyboardNavProps) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key !== "[" && e.key !== "]") return;

      const idx = PRODUCTS.findIndex((p) => p.slug === currentSlug);
      if (idx === -1) return;

      e.preventDefault();
      const next =
        e.key === "]"
          ? PRODUCTS[(idx + 1) % PRODUCTS.length]
          : PRODUCTS[(idx - 1 + PRODUCTS.length) % PRODUCTS.length];

      toast(`${next.glyph} ${next.name}`, "info");
      router.push(`/products/${next.slug}`);
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [currentSlug, router]);

  return null;
}
