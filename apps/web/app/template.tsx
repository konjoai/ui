"use client";

import { motion } from "motion/react";
import { ease } from "@konjoai/ui";

/**
 * Route template — remounts on every navigation, giving page content a
 * smooth enter animation. Exit animations require layout-level support
 * not available in Next.js App Router, so only enter is animated here.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: ease.kanjo }}
    >
      {children}
    </motion.div>
  );
}
