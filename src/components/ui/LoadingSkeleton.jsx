export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 dark:bg-white/10 ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }) {
  return (
    <div className={`p-6 rounded-2xl border border-gray-100 dark:border-white/10 ${className}`}>
      <Skeleton className="h-48 mb-4 rounded-xl" />
      <Skeleton className="h-5 w-3/4 mb-3" />
      <SkeletonText lines={2} />
      <div className="flex gap-2 mt-4">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    </div>
  );
}

export function SectionSkeleton({ type = "default" }) {
  if (type === "hero") {
    return (
      <div className="flex flex-col items-center text-center space-y-6 py-20">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-16 w-96 max-w-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-80 max-w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-12 w-40 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (type === "skills") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col items-center p-5 rounded-2xl border border-gray-100 dark:border-white/10">
            <Skeleton className="w-20 h-20 rounded-full mb-3" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-64 mx-auto" />
      <SkeletonText lines={4} className="mt-8 max-w-2xl mx-auto" />
    </div>
  );
}
