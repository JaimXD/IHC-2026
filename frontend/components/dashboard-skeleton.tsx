"use client"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="rounded-2xl border border-border/70 bg-card/80 px-6 py-6 space-y-4">
        <div className="h-6 w-32 bg-muted rounded-full animate-pulse" />
        <div className="h-8 w-3/4 bg-muted rounded-lg animate-pulse" />
        <div className="h-4 w-full max-w-md bg-muted rounded-lg animate-pulse" />
        <div className="h-3 w-64 bg-muted rounded-lg animate-pulse" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="h-5 w-32 bg-muted rounded-lg animate-pulse" />
              <div className="h-10 w-10 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
            <div className="h-3 w-full bg-muted rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4"
          >
            <div className="h-5 w-40 bg-muted rounded-lg animate-pulse" />
            <div className="h-64 w-full bg-muted rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
        <div className="h-5 w-40 bg-muted rounded-lg animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function MetricSkeletonCard() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-5 w-32 bg-muted rounded-lg" />
        <div className="h-10 w-10 bg-muted rounded-lg" />
      </div>
      <div className="h-8 w-24 bg-muted rounded-lg" />
      <div className="h-3 w-full bg-muted rounded-lg" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4 animate-pulse">
      <div className="h-5 w-40 bg-muted rounded-lg" />
      <div className="h-64 w-full bg-muted rounded-lg" />
    </div>
  )
}
