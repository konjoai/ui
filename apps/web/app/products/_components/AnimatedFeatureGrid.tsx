"use client";

import { motion, useReducedMotion } from "motion/react";
import { FeatureCard } from "@konjoai/ui";
import { ease } from "@konjoai/ui";
import type { ProductFeature } from "@/lib/products";

interface AnimatedFeatureGridProps {
  features: ProductFeature[];
}

/**
 * Staggered scroll-triggered entrance for a product's feature cards.
 * Each card fades and rises in with a small per-index delay.
 */
export function AnimatedFeatureGrid({ features }: AnimatedFeatureGridProps) {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: ease.kanjo, delay: i * 0.08 }}
        >
          <FeatureCard glyph={f.glyph} title={f.title} description={f.description} />
        </motion.div>
      ))}
    </div>
  );
}
