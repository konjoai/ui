import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeatureCard, ProductHero, StatusBadge } from "@konjoai/ui";
import { Footer } from "@/app/_components/Footer";
import { Breadcrumbs } from "@/app/_components/Breadcrumbs";
import { AnimatedSection } from "@/app/_components/AnimatedSection";
import { ProductDashboard } from "@/app/products/_components/ProductDashboard";
import { PRODUCTS, PRODUCT_BY_SLUG } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = PRODUCT_BY_SLUG[slug];
  if (!p) return { title: "Not found · KonjoAI" };
  return {
    title: `${p.name} — ${p.tagline}`,
    description: p.tagline,
    openGraph: {
      title: `${p.name} · KonjoAI`,
      description: p.tagline,
      url: `https://konjo.ai/products/${p.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCT_BY_SLUG[slug];
  if (!product) notFound();

  return (
    <main className="aurora-konjo relative min-h-screen overflow-x-clip">
      <div className="aurora-konjo-bg" aria-hidden />

      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/#projects" },
            { label: product.name },
          ]}
        />
      </div>

      <ProductHero
        name={product.name}
        tagline={product.tagline}
        glyph={product.glyph}
        eyebrow={product.eyebrow}
        version={product.version}
        status={<StatusBadge level={product.status} />}
        actions={
          <>
            <a
              href={product.github}
              target="_blank"
              rel="noreferrer"
              className="shadow-konjo-brand rounded-konjo-lg px-5 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--color-konjo-brand)" }}
            >
              View on GitHub ↗
            </a>
            <a
              href={product.demo}
              target="_blank"
              rel="noreferrer"
              className="rounded-konjo-lg border border-konjo-line bg-konjo-surface/60 px-5 py-2.5 text-sm font-medium text-konjo-fg backdrop-blur transition-colors hover:bg-konjo-surface"
            >
              Open demo ↗
            </a>
          </>
        }
      />

      <AnimatedSection className="mx-auto max-w-6xl px-6 pb-12">
        <p className="max-w-3xl text-base leading-relaxed text-konjo-fg-muted sm:text-lg">
          {product.about}
        </p>
      </AnimatedSection>

      <AnimatedSection className="mx-auto max-w-6xl px-6 pb-16" delay={0.08}>
        <h2 className="text-konjo-display mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">
          What it does
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((f) => (
            <FeatureCard
              key={f.title}
              glyph={f.glyph}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </AnimatedSection>

      <ProductDashboard slug={product.slug} />

      <AnimatedSection className="mx-auto max-w-6xl px-6 pb-24" delay={0.05}>
        <div className="glass-konjo rounded-konjo-lg flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-konjo-mono text-xs uppercase tracking-widest text-konjo-fg-faint">
              Get started
            </p>
            <p className="mt-1 text-base text-konjo-fg">
              Clone the repo, read the CLAUDE.md, run the test suite.
            </p>
          </div>
          <a
            href={product.github}
            target="_blank"
            rel="noreferrer"
            className="text-konjo-mono rounded-konjo border border-konjo-line bg-konjo-surface-2/60 px-4 py-2 text-sm text-konjo-fg transition-colors hover:bg-konjo-surface-2"
          >
            github.com/konjoai/{product.slug} ↗
          </a>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
