"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ease, StatusBadge, severity as sevColor } from "@konjoai/ui";
import { PRODUCTS, type Product } from "@/lib/products";

/** Portfolio grid — nine animated product cards with 3-D tilt on hover. */
export function ProjectGrid() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 pb-24">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <h2 className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl">
            The portfolio
          </h2>
          <p className="text-konjo-mono mt-2 text-sm text-konjo-fg-muted">
            Nine projects · one design system · one Konjo
          </p>
        </div>
        <div className="text-konjo-mono hidden text-xs text-konjo-fg-faint sm:block">
          {PRODUCTS.length.toString().padStart(2, "0")} / {PRODUCTS.length.toString().padStart(2, "0")}
        </div>
      </div>

      <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </ul>
    </section>
  );
}

/** Single product card with entrance animation and 3-D perspective tilt on hover. */
function ProjectCard({ project, index }: { project: Product; index: number }) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLLIElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(rawY, { stiffness: 300, damping: 25 });

  const metricColor = sevColor[project.metric.severity];
  const metricDisplay = Number.isInteger(project.metric.value)
    ? String(project.metric.value)
    : project.metric.value.toFixed(1);

  function handleMouseMove(e: React.MouseEvent<HTMLLIElement>) {
    if (reduce) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawY.set(x * 8);
    rawX.set(-y * 6);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.li
      ref={cardRef}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : {
        y: -4,
        boxShadow: "0 0 0 1px rgba(124,58,237,0.35), 0 0 40px -6px rgba(124,58,237,0.18)",
        transition: { duration: 0.2, ease: ease.nehan },
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.45,
        ease: ease.kanjo,
        delay: Math.min(index * 0.04, 0.32),
      }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group glass-konjo rounded-konjo-lg relative overflow-hidden p-6 transition-colors duration-300"
    >
      {/* Top shimmer on hover */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-konjo-brand), transparent)",
        }}
        aria-hidden
      />

      {/* Header: glyph + number + status */}
      <div className="flex items-start justify-between gap-4">
        <a
          href={`/products/${project.slug}`}
          aria-label={`Open ${project.name} product page`}
          className="text-konjo-mono text-3xl leading-none transition-colors"
          style={{ color: "var(--color-konjo-brand-soft)" }}
        >
          <span aria-hidden>{project.glyph}</span>
        </a>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
          <StatusBadge level={project.status} />
        </div>
      </div>

      {/* Name + tagline */}
      <a
        href={`/products/${project.slug}`}
        className="text-konjo-display mt-5 inline-block text-2xl font-semibold tracking-tight transition-colors hover:text-konjo-violet"
      >
        {project.name}
      </a>
      <p className="mt-2 text-sm leading-relaxed text-konjo-fg-muted">
        {project.tagline}
      </p>

      {/* Headline metric */}
      <div
        className="mt-4 flex items-baseline gap-1.5"
        aria-label={`${project.metric.label}: ${metricDisplay}${project.metric.unit}`}
      >
        <span
          className="text-konjo-display text-2xl font-semibold tabular-nums leading-none"
          style={{ color: metricColor }}
        >
          {metricDisplay}
          <span className="ml-0.5 text-base text-konjo-fg-muted">{project.metric.unit}</span>
        </span>
        <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          {project.metric.label}
        </span>
      </div>

      {/* CTAs */}
      <div className="mt-5 flex items-center gap-3 text-xs">
        <a
          href={`/products/${project.slug}`}
          className="text-konjo-mono inline-flex items-center gap-1.5 rounded-konjo border border-konjo-line bg-konjo-surface-2/60 px-3 py-1.5 text-konjo-fg transition-colors hover:bg-konjo-surface-2"
        >
          Details
          <span aria-hidden>→</span>
        </a>
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          className="text-konjo-mono inline-flex items-center gap-1.5 rounded-konjo border border-konjo-line/60 px-3 py-1.5 text-konjo-fg-muted transition-colors hover:border-konjo-line hover:text-konjo-fg"
        >
          GitHub
          <span aria-hidden>↗</span>
        </a>
      </div>
    </motion.li>
  );
}
