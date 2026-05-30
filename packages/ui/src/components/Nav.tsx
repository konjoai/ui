import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface NavLink {
  label: string;
  href: string;
  /** If true, opens in a new tab with rel="noreferrer". */
  external?: boolean;
}

export interface NavProductGroup {
  label: string;
  items: NavLink[];
}

export interface NavProps {
  /** Brand wordmark — defaults to "KonjoAI". */
  brand?: ReactNode;
  /** Hyperlink for the brand. Default "/". */
  brandHref?: string;
  /** Top-level links rendered inline next to the products menu. */
  links?: NavLink[];
  /** Optional grouped product menu. Renders as a click-to-expand details/summary. */
  products?: NavProductGroup;
  /** Right-side actions — typically a GitHub link. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Konjo Nav — top navigation bar used across the marketing site.
 *
 * Uses native <details>/<summary> for the product menu and mobile drawer, so
 * the component is fully server-renderable (no `useState`, no `"use client"`).
 * Works without JavaScript; progressive enhancement comes from CSS transitions.
 */
export function Nav({
  brand = "KonjoAI",
  brandHref = "/",
  links = [],
  products,
  actions,
  className,
}: NavProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-konjo-line/60 bg-konjo-bg/70 backdrop-blur",
        className,
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6"
      >
        <a
          href={brandHref}
          className="text-konjo-display text-base font-semibold tracking-tight text-konjo-fg transition-colors hover:text-konjo-violet"
        >
          {brand}
        </a>

        <div className="hidden flex-1 items-center gap-1 sm:flex">
          {products ? <ProductMenu group={products} /> : null}
          {links.map((l) => (
            <NavLinkItem key={l.href} link={l} />
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 sm:ml-0">
          {actions}
          {(products || links.length > 0) && (
            <MobileMenu products={products} links={links} />
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLinkItem({ link }: { link: NavLink }) {
  const external = link.external
    ? { target: "_blank", rel: "noreferrer" as const }
    : {};
  return (
    <a
      href={link.href}
      {...external}
      className="rounded-konjo px-3 py-1.5 text-sm text-konjo-fg-muted transition-colors hover:bg-konjo-surface/60 hover:text-konjo-fg"
    >
      {link.label}
    </a>
  );
}

function ProductMenu({ group }: { group: NavProductGroup }) {
  return (
    <details className="group relative">
      <summary
        className="text-konjo-mono inline-flex cursor-pointer list-none items-center gap-1.5 rounded-konjo px-3 py-1.5 text-sm text-konjo-fg-muted transition-colors hover:bg-konjo-surface/60 hover:text-konjo-fg [&::-webkit-details-marker]:hidden"
        aria-label="Products menu"
      >
        {group.label}
        <span aria-hidden className="text-xs transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="glass-konjo rounded-konjo-lg absolute left-0 top-full mt-2 w-64 p-2 shadow-konjo-glow">
        <ul role="list" className="grid grid-cols-1 gap-0.5">
          {group.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-konjo-mono block rounded-konjo px-3 py-2 text-sm text-konjo-fg-muted transition-colors hover:bg-konjo-surface-2 hover:text-konjo-fg"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function MobileMenu({
  products,
  links,
}: {
  products?: NavProductGroup;
  links: NavLink[];
}) {
  return (
    <details className="group relative sm:hidden">
      <summary
        className="inline-flex size-9 cursor-pointer list-none items-center justify-center rounded-konjo border border-konjo-line bg-konjo-surface/60 text-konjo-fg transition-colors hover:bg-konjo-surface [&::-webkit-details-marker]:hidden"
        aria-label="Open menu"
      >
        <span aria-hidden className="text-base">≡</span>
      </summary>
      <div className="glass-konjo rounded-konjo-lg absolute right-0 top-full mt-2 w-64 p-3 shadow-konjo-glow">
        {products ? (
          <>
            <p className="text-konjo-mono mb-1 px-1 text-[10px] uppercase tracking-widest text-konjo-fg-faint">
              {products.label}
            </p>
            <ul role="list" className="mb-2 grid grid-cols-1 gap-0.5">
              {products.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-konjo-mono block rounded-konjo px-3 py-2 text-sm text-konjo-fg-muted transition-colors hover:bg-konjo-surface-2 hover:text-konjo-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {links.length > 0 ? (
          <ul role="list" className="grid grid-cols-1 gap-0.5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="block rounded-konjo px-3 py-2 text-sm text-konjo-fg-muted transition-colors hover:bg-konjo-surface-2 hover:text-konjo-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </details>
  );
}
