"use client";

import { motion } from "motion/react";
import { ease } from "@konjoai/ui";
import { PRODUCTS, type Product } from "@/lib/products";

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

function ProjectCard({ project, index }: { project: Product; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.45,
        ease: ease.kanjo,
        delay: Math.min(index * 0.04, 0.32),
      }}
      className="group glass-konjo rounded-konjo-lg relative overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-konjo-brand), transparent)",
        }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-4">
        <a
          href={`/products/${project.slug}`}
          aria-label={`Open ${project.name} product page`}
          className="text-konjo-mono text-3xl leading-none transition-colors"
          style={{ color: "var(--color-konjo-brand-soft)" }}
        >
          <span aria-hidden>{project.glyph}</span>
        </a>
        <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <a
        href={`/products/${project.slug}`}
        className="text-konjo-display mt-5 inline-block text-2xl font-semibold tracking-tight transition-colors hover:text-konjo-violet"
      >
        {project.name}
      </a>
      <p className="mt-2 text-sm leading-relaxed text-konjo-fg-muted">
        {project.tagline}
      </p>

      <div className="mt-6 flex items-center gap-3 text-xs">
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
