"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  imageId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  onLikeChange?: (isLiked: boolean, likeCount: number) => void;
  size?: "sm" | "default";
  showCount?: boolean;
  className?: string;
}

export function LikeButton({
  imageId,
  initialLikeCount,
  initialIsLiked,
  onLikeChange,
  size = "default",
  showCount = true,
  className,
}: LikeButtonProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!session?.user) {
      // Could show a toast or redirect to sign in
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    try {
      const response = await fetch(`/api/images/${imageId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        // Revert on error
        setIsLiked(!newIsLiked);
        setLikeCount(likeCount);
        throw new Error("Failed to toggle like");
      }

      const data = await response.json();
      setIsLiked(data.isLiked);
      setLikeCount(data.likeCount);
      onLikeChange?.(data.isLiked, data.likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = size === "sm" ? "h-8 px-2" : "h-9 px-3";

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        buttonSize,
        "gap-1.5 font-normal",
        isLiked && "text-red-500 hover:text-red-600",
        !session?.user && "cursor-default opacity-70",
        className
      )}
      onClick={handleLike}
      disabled={isLoading || !session?.user}
    >
      <Heart
        className={cn(
          iconSize,
          "transition-all",
          isLiked && "fill-current",
          isLoading && "animate-pulse"
        )}
      />
      {showCount && (
        <span className="text-sm tabular-nums">{likeCount}</span>
      )}
    </Button>
  );
}
