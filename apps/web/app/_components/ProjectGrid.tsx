"use client";

import { motion } from "motion/react";
import { ease } from "@konjoai/ui";

type Project = {
  name: string;
  tagline: string;
  github: string;
  demo: string;
  glyph: string;
};

const PROJECTS: Project[] = [
  {
    name: "squash",
    tagline: "Compliance bridge for the EU AI Act",
    github: "https://github.com/konjoai/squash",
    demo: "https://squash.konjo.ai",
    glyph: "▣",
  },
  {
    name: "squish",
    tagline: "MLX-accelerated local LLM inference server",
    github: "https://github.com/konjoai/squish",
    demo: "https://squish.konjo.ai",
    glyph: "◐",
  },
  {
    name: "vectro",
    tagline: "Embedding compression with Rust + Mojo kernels",
    github: "https://github.com/konjoai/vectro",
    demo: "https://vectro.konjo.ai",
    glyph: "◇",
  },
  {
    name: "kyro",
    tagline: "Production RAG with hybrid retrieval and HyDE",
    github: "https://github.com/konjoai/kyro",
    demo: "https://kyro.konjo.ai",
    glyph: "✸",
  },
  {
    name: "kairu",
    tagline: "Real-time inference optimizer with speculative decoding",
    github: "https://github.com/konjoai/kairu",
    demo: "https://kairu.konjo.ai",
    glyph: "▲",
  },
  {
    name: "miru",
    tagline: "Multimodal reasoning tracer for vision-language models",
    github: "https://github.com/konjoai/miru",
    demo: "https://miru.konjo.ai",
    glyph: "◉",
  },
  {
    name: "toki",
    tagline: "Adversarial fine-tuning lab for small LLMs",
    github: "https://github.com/konjoai/toki",
    demo: "https://toki.konjo.ai",
    glyph: "✕",
  },
  {
    name: "kohaku",
    tagline: "Episodic memory engine using hyperdimensional computing",
    github: "https://github.com/konjoai/kohaku",
    demo: "https://kohaku.konjo.ai",
    glyph: "❖",
  },
  {
    name: "lopi",
    tagline: "Rust agent orchestrator for Claude Code",
    github: "https://github.com/konjoai/lopi",
    demo: "https://lopi.konjo.ai",
    glyph: "⌬",
  },
];

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
          {PROJECTS.length.toString().padStart(2, "0")} / {PROJECTS.length.toString().padStart(2, "0")}
        </div>
      </div>

      <ul
        role="list"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} />
        ))}
      </ul>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
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
        <span
          className="text-konjo-mono text-3xl leading-none transition-colors"
          style={{ color: "var(--color-konjo-brand-soft)" }}
          aria-hidden
        >
          {project.glyph}
        </span>
        <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="text-konjo-display mt-5 text-2xl font-semibold tracking-tight">
        {project.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-konjo-fg-muted">
        {project.tagline}
      </p>

      <div className="mt-6 flex items-center gap-3 text-xs">
        <a
          href={project.demo}
          target="_blank"
          rel="noreferrer"
          className="text-konjo-mono inline-flex items-center gap-1.5 rounded-konjo border border-konjo-line bg-konjo-surface-2/60 px-3 py-1.5 text-konjo-fg transition-colors hover:bg-konjo-surface-2"
        >
          Demo
          <span aria-hidden>↗</span>
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
