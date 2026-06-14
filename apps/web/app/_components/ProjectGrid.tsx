"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { ease, StatusBadge, severity as sevColor, cn } from "@konjoai/ui";
import { PRODUCTS, type Product } from "@/lib/products";
import { ScrambleText } from "./ScrambleText";
import { AnimatedMiniSparkline } from "./AnimatedMiniSparkline";

type StatusFilter = "all" | "operational" | "degraded" | "research";

const FILTER_OPTS: { label: string; value: StatusFilter }[] = [
  { label: "All",         value: "all"         },
  { label: "Operational", value: "operational" },
  { label: "Degraded",    value: "degraded"    },
  { label: "Research",    value: "research"    },
];

const STATUS_DOT: Record<StatusFilter, string> = {
  all:         "var(--color-konjo-accent)",
  operational: "var(--color-konjo-good)",
  degraded:    "var(--color-konjo-warm)",
  research:    "var(--color-konjo-violet)",
};

/** Portfolio grid — nine animated product cards with 3-D tilt, status filter, and text search. */
export function ProjectGrid() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      // / → focus search
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !inInput) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // 1-9 → navigate to product by index (only when not in an input)
      if (!inInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= 9 && PRODUCTS[num - 1]) {
          e.preventDefault();
          router.push(`/products/${PRODUCTS[num - 1].slug}`);
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);

  const filtered = PRODUCTS.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: ease.kanjo }}
        className="mb-8 flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <ScrambleText
            as="h2"
            text="The portfolio"
            className="text-konjo-display text-3xl font-semibold tracking-tight sm:text-4xl"
            delay={100}
          />
          <p className="text-konjo-mono mt-2 text-sm text-konjo-fg-muted">
            <span
              className="tabular-nums"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Showing ${filtered.length} of ${PRODUCTS.length} projects`}
            >
              {String(filtered.length).padStart(2, "0")}&thinsp;/&thinsp;{String(PRODUCTS.length).padStart(2, "0")}
            </span>
            {" "}projects · one design system · one Konjo
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: ease.kanjo }}
          className="flex flex-wrap items-center gap-2"
        >
          {/* Text search */}
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search… /"
            autoComplete="off"
            spellCheck={false}
            aria-label="Search products by name or description (press / to focus)"
            className="text-konjo-mono w-28 rounded-full border border-konjo-line/50 bg-konjo-surface/30 px-3 py-1 text-[11px] text-konjo-fg placeholder:text-konjo-fg-faint transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-offset-1 focus-visible:w-40 focus-visible:border-konjo-brand/40"
          />

          {/* Status filter */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by status">
          {FILTER_OPTS.map(({ label, value }) => {
            const count = value === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.status === value).length;
            const active = filter === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={cn(
                  "text-konjo-mono inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-konjo-accent focus-visible:ring-offset-1",
                  active
                    ? "border-konjo-brand/40 bg-konjo-brand/10 text-konjo-fg"
                    : "border-konjo-line/50 bg-konjo-surface/30 text-konjo-fg-muted hover:border-konjo-line hover:text-konjo-fg",
                )}
              >
                <span
                  className="inline-block size-1.5 rounded-full"
                  style={{ background: STATUS_DOT[value] }}
                  aria-hidden
                />
                {label}
                <span className="tabular-nums text-konjo-fg-faint">{String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
          </div>
        </motion.div>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-konjo-mono py-16 text-center text-sm text-konjo-fg-faint">
          No products match <span className="text-konjo-fg">&ldquo;{search}&rdquo;</span>
        </p>
      )}

      <GridSpotlight>
        {filtered.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </GridSpotlight>
    </section>
  );
}

/**
 * Wraps the product grid with hover-spotlight behaviour: hovering any child
 * dims the rest to 0.35 opacity, restoring to 1 on mouse leave.
 */
function GridSpotlight({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hovered={hovered ? "true" : undefined}
    >
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      {/* Spotlight: when grid is hovered, darken all but the card being hovered */}
      <style>{`
        [data-hovered="true"] > li:not(:hover) {
          opacity: 0.45;
          transition: opacity 0.25s;
        }
        [data-hovered="true"] > li:hover {
          opacity: 1;
          transition: opacity 0.15s;
        }
      `}</style>
    </ul>
  );
}

/** Single product card with entrance animation, 3-D tilt, and mouse-follow spotlight. */
function ProjectCard({ project, index }: { project: Product; index: number }) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLLIElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const [cardHovered, setCardHovered] = useState(false);
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
    // Direct DOM update avoids re-renders for the spotlight position
    if (spotRef.current) {
      const sx = ((e.clientX - rect.left) / rect.width) * 100;
      const sy = ((e.clientY - rect.top) / rect.height) * 100;
      spotRef.current.style.background = `radial-gradient(circle at ${sx}% ${sy}%, rgba(124,58,237,0.11) 0%, transparent 58%)`;
    }
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    setCardHovered(false);
  }

  return (
    <motion.li
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
      whileHover={reduce ? undefined : {
        y: -4,
        boxShadow: `0 0 0 1px color-mix(in oklch, ${metricColor} 35%, transparent), 0 0 40px -6px color-mix(in oklch, ${metricColor} 18%, transparent)`,
        transition: { duration: 0.2, ease: ease.nehan },
      }}
      transition={{
        duration: 0.38,
        ease: ease.kanjo,
        delay: Math.min(index * 0.04, 0.24),
      }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setCardHovered(true)}
      className="group glass-konjo rounded-konjo-lg relative overflow-hidden p-6 transition-colors duration-300"
    >
      {/* Mouse-following spotlight overlay */}
      {!reduce && (
        <div
          ref={spotRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      {/* Top shimmer on hover — product-specific color */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-px h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${metricColor}, transparent)`,
        }}
        aria-hidden
      />

      {/* Header: glyph + number + status */}
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/products/${project.slug}`}
          aria-label={`Open ${project.name} product page`}
          className="text-konjo-mono text-3xl leading-none transition-colors"
          style={{ color: "var(--color-konjo-brand-soft)" }}
        >
          <span aria-hidden>{project.glyph}</span>
        </Link>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-konjo-mono text-[10px] uppercase tracking-widest text-konjo-fg-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
          <StatusBadge level={project.status} />
        </div>
      </div>

      {/* Name + tagline */}
      <Link
        href={`/products/${project.slug}`}
        className="text-konjo-display mt-5 inline-block text-2xl font-semibold tracking-tight transition-colors hover:text-konjo-violet"
      >
        {project.name}
      </Link>
      <p className="mt-2 text-sm leading-relaxed text-konjo-fg-muted">
        {project.tagline}
      </p>

      {/* Headline metric */}
      <div
        className="mt-4 flex items-center gap-2"
        aria-label={`${project.metric.label}: ${metricDisplay}${project.metric.unit}`}
      >
        <div className="flex items-baseline gap-1.5">
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
        <div className="ml-auto flex items-center gap-2">
          <AnimatedMiniSparkline
            slug={project.slug}
            width={56}
            height={22}
            color={metricColor}
            hovered={cardHovered}
          />
          <span
            className="konjo-pulse size-1.5 shrink-0 rounded-full"
            style={{ background: metricColor }}
            aria-label="Live metric"
          />
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-5 flex items-center gap-3 text-xs">
        <Link
          href={`/products/${project.slug}`}
          className="text-konjo-mono inline-flex items-center gap-1.5 rounded-konjo border border-konjo-line bg-konjo-surface-2/60 px-3 py-1.5 text-konjo-fg transition-colors hover:bg-konjo-surface-2"
        >
          Details
          <span aria-hidden>→</span>
        </Link>
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
