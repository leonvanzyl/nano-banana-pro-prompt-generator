"use client";

import { useState } from "react";
import { Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VisibilityToggleProps {
  imageId: string;
  isPublic: boolean;
  onToggle?: ((imageId: string, isPublic: boolean) => void) | undefined;
  className?: string | undefined;
}

export function VisibilityToggle({
  imageId,
  isPublic,
  onToggle,
  className,
}: VisibilityToggleProps) {
  const [loading, setLoading] = useState(false);
  const [currentVisibility, setCurrentVisibility] = useState(isPublic);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/images/${imageId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !currentVisibility }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      const updated = await response.json();
      setCurrentVisibility(updated.isPublic);
      onToggle?.(imageId, updated.isPublic);
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className={cn("gap-2", className)}
      title={currentVisibility ? "Make private" : "Make public"}
    >
      {currentVisibility ? (
        <>
          <Globe className="h-4 w-4" />
          <span>Public</span>
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          <span>Private</span>
        </>
      )}
    </Button>
  );
}
