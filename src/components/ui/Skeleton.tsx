'use client';

import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded bg-on-surface-dim/20',
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="space-y-4 p-4 bg-surface border border-on-surface/10 rounded-lg">
      <Skeleton className="h-4 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
