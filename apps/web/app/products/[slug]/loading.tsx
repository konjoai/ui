/** Skeleton loader shown while the product page server component streams in. */
export default function ProductLoading() {
  return (
    <main className="aurora-konjo relative min-h-screen overflow-x-clip">
      <div className="aurora-konjo-bg" aria-hidden />

      {/* Breadcrumb skeleton */}
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 animate-pulse rounded-konjo bg-konjo-surface-2" />
          <div className="h-3 w-2 animate-pulse rounded-konjo bg-konjo-surface-2" />
          <div className="h-3 w-16 animate-pulse rounded-konjo bg-konjo-surface-2" />
          <div className="h-3 w-2 animate-pulse rounded-konjo bg-konjo-surface-2" />
          <div className="h-3 w-20 animate-pulse rounded-konjo bg-konjo-surface-2" />
        </div>
      </div>

      {/* Metric strip skeleton */}
      <div className="mx-auto max-w-6xl border-b border-konjo-line/40 px-6 py-5">
        <div className="flex items-baseline gap-3">
          <div className="h-14 w-28 animate-pulse rounded-konjo bg-konjo-surface-2" />
          <div className="h-3 w-20 animate-pulse rounded-konjo bg-konjo-surface-2" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-12 sm:pt-32">
        <div className="mb-3 h-3 w-40 animate-pulse rounded-konjo bg-konjo-surface-2" />
        <div className="mb-4 h-16 w-72 animate-pulse rounded-konjo bg-konjo-surface-2 sm:w-96" />
        <div className="mb-2 h-5 w-full max-w-lg animate-pulse rounded-konjo bg-konjo-surface-2" />
        <div className="mb-5 h-5 w-2/3 animate-pulse rounded-konjo bg-konjo-surface-2" />
        <div className="flex gap-3">
          <div className="h-10 w-36 animate-pulse rounded-konjo-lg bg-konjo-surface-2" />
          <div className="h-10 w-28 animate-pulse rounded-konjo-lg bg-konjo-surface-2" />
        </div>
      </div>

      {/* About skeleton */}
      <div className="mx-auto max-w-6xl px-6 pb-12">
        <div className="space-y-3">
          <div className="h-5 w-full max-w-2xl animate-pulse rounded-konjo bg-konjo-surface-2" />
          <div className="h-5 w-5/6 max-w-2xl animate-pulse rounded-konjo bg-konjo-surface-2" />
          <div className="h-5 w-4/6 max-w-2xl animate-pulse rounded-konjo bg-konjo-surface-2" />
        </div>
      </div>

      {/* Feature grid skeleton */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-6 h-8 w-40 animate-pulse rounded-konjo bg-konjo-surface-2" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="glass-konjo rounded-konjo-lg h-40 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
