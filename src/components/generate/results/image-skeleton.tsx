"use client";

import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageSkeletonProps {
  count?: number;
  showSpinner?: boolean;
}

export function ImageSkeleton({ count = 1, showSpinner = true }: ImageSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square relative rounded-lg overflow-hidden">
          <Skeleton className="w-full h-full" />
          {showSpinner && i === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Generating...</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

interface ImageSkeletonGridProps {
  count?: number;
}

export function ImageSkeletonGrid({ count = 4 }: ImageSkeletonGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ImageSkeleton count={count} />
    </div>
  );
}
