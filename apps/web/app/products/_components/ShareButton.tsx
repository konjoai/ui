"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";

interface ShareButtonProps {
  slug: string;
}

/** Copies the product page URL to the clipboard and fires a success toast. */
export function ShareButton({ slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/products/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? "Link copied to clipboard" : "Copy link to this product"}
      className="rounded-konjo-lg border border-konjo-line bg-konjo-surface/60 px-5 py-2.5 text-sm font-medium text-konjo-fg backdrop-blur transition-colors hover:bg-konjo-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent"
    >
      {copied ? "Copied ✓" : "Share ↗"}
    </button>
  );
}
