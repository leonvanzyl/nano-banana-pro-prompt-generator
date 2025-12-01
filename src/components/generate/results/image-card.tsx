"use client";

import { useState } from "react";
import { Download, ExternalLink, Trash2, Globe, Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { GeneratedImage } from "@/lib/types/generation";

interface ImageCardProps {
  image: GeneratedImage;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string, isPublic: boolean) => void;
  showActions?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ImageCard({
  image,
  onDelete,
  onToggleVisibility,
  showActions = true,
  isSelected = false,
  onSelect,
}: ImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingVisibility, setIsTogglingVisibility] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `generated-image-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(image.imageUrl, "_blank");
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(image.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!onToggleVisibility) return;
    setIsTogglingVisibility(true);
    try {
      await onToggleVisibility(image.id, !image.isPublic);
    } finally {
      setIsTogglingVisibility(false);
    }
  };

  return (
    <Card
      className={`overflow-hidden group cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-0 relative">
        <div className="aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.imageUrl}
            alt="Generated image"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hover overlay with actions */}
        {showActions && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
            <div className="flex flex-wrap gap-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="flex-1"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenInNewTab();
                }}
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>

              {onToggleVisibility && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleVisibility();
                  }}
                  disabled={isTogglingVisibility}
                  className="flex-1"
                  title={image.isPublic ? "Make private" : "Make public"}
                >
                  {image.isPublic ? (
                    <Globe className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </Button>
              )}

              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Image</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this image? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        )}

        {/* Visibility badge */}
        <div className="absolute top-2 right-2">
          {image.isPublic ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/80 text-white">
              <Globe className="h-3 w-3 mr-1" />
              Public
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
