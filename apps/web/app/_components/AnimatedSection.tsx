"use client";

import { motion } from "motion/react";
import { ease } from "@konjoai/ui";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  /** Extra entrance delay in seconds. */
  delay?: number;
}

/**
 * Transparent wrapper that animates children in as they enter the viewport.
 * Renders as a `<section>` element; safe to use in server component pages.
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: ease.kanjo, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
