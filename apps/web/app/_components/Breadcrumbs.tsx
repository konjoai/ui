type Crumb = { label: string; href?: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-konjo-mono text-xs">
      <ol className="flex flex-wrap items-center gap-1.5 text-konjo-fg-faint">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <a
                  href={c.href}
                  className="text-konjo-fg-muted transition-colors hover:text-konjo-fg"
                >
                  {c.label}
                </a>
              ) : (
                <span className={last ? "text-konjo-fg" : undefined}>{c.label}</span>
              )}
              {!last ? <span aria-hidden>›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
