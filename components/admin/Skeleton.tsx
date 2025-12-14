"use client";

import { HTMLAttributes } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SkeletonBlock({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx("animate-pulse rounded-xl bg-foreground/10", className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonLine({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cx("animate-pulse rounded-full bg-foreground/10", className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-foreground/10 bg-white/80">
      <div className="grid grid-cols-4 gap-3 border-b border-foreground/10 px-4 py-3">
        <SkeletonLine className="h-3 w-20" />
        <SkeletonLine className="h-3 w-24" />
        <SkeletonLine className="h-3 w-16" />
        <SkeletonLine className="h-3 w-20" />
      </div>
      <div className="divide-y divide-foreground/10">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="grid grid-cols-4 items-center gap-3 px-4 py-4">
            <SkeletonLine className="h-4 w-40" />
            <SkeletonLine className="h-4 w-44" />
            <SkeletonLine className="h-4 w-24" />
            <SkeletonLine className="h-8 w-32 justify-self-end rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

