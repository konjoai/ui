"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@konjoai/ui";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  /** HTML id for anchor / scroll-spy targets. */
  id?: string;
  /** Extra entrance delay in seconds. */
  delay?: number;
  /** Render as a div instead of section — use when already inside a section. */
  as?: "section" | "div";
}

/**
 * Scroll-triggered fade+rise entrance wrapper.
 * Instantly visible under prefers-reduced-motion.
 */
export function AnimatedSection({
  children,
  className,
  id,
  delay = 0,
  as = "section",
}: AnimatedSectionProps) {
  const reduce = useReducedMotion();
  const Tag = as === "div" ? motion.div : motion.section;

  return (
    <Tag
      id={id}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.55, ease: ease.kanjo, delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}
