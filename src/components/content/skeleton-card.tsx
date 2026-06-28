"use client";

export function SkeletonCard() {
  return (
    <div className="aspect-[2/3] rounded-xl overflow-hidden bg-card border border-border shimmer">
      <div className="w-full h-full bg-gradient-to-br from-muted via-card to-muted" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="py-6">
      <div className="px-4 lg:px-12 mb-5">
        <div className="h-6 w-40 rounded bg-muted shimmer" />
      </div>
      <div className="flex gap-3 px-4 lg:px-12 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-none w-[160px] md:w-[195px]">
            <SkeletonCard />
          </div>
        ))}
      </div>
    </div>
  );
}
