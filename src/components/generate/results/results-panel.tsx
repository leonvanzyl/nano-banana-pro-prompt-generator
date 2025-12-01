"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { RefineInput } from "./refine-input";

interface ResultsPanelProps {
  images: string[];
  isGenerating: boolean;
  expectedCount: number;
  generationId?: string | undefined;
  onRefine?: ((instruction: string, selectedImageId?: string) => Promise<void>) | undefined;
  isRefining?: boolean | undefined;
}

export function ResultsPanel({
  images,
  isGenerating,
  expectedCount,
  generationId,
  onRefine,
  isRefining = false,
}: ResultsPanelProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const hasImages = images.length > 0;
  const fullscreenImage = fullscreenIndex !== null ? images[fullscreenIndex] : null;

  const handleRefine = async (instruction: string) => {
    if (onRefine) {
      await onRefine(instruction, undefined);
    }
  };

  const handleDownload = async (url: string, index: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `generated-image-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  const handleOpenInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Results</h2>
        <p className="text-sm text-muted-foreground">
          Your generated images will appear here
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {!hasImages && !isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-4" />
              <p className="text-lg">No images yet</p>
              <p className="text-sm">Build your prompt and generate images</p>
            </div>
          ) : (
            <>
              {/* Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                {isGenerating ? (
                  // Show skeletons while generating
                  Array.from({ length: expectedCount }).map((_, i) => (
                    <div key={i} className="aspect-square">
                      <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                  ))
                ) : (
                  // Show generated images
                  images.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg overflow-hidden border bg-muted relative cursor-pointer transition-all group hover:ring-2 hover:ring-primary"
                      onClick={() => setFullscreenIndex(i)}
                    >
                      <Image
                        src={url}
                        alt={`Generated image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 200px"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                          Click to view
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Refinement Section */}
              {hasImages && generationId && onRefine && (
                <>
                  <Separator />
                  <RefineInput
                    onRefine={handleRefine}
                    isRefining={isRefining}
                    disabled={isGenerating}
                  />
                </>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Fullscreen Image Dialog */}
      <Dialog open={fullscreenIndex !== null} onOpenChange={(open) => !open && setFullscreenIndex(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95">
          <DialogTitle className="sr-only">
            Generated Image {fullscreenIndex !== null ? fullscreenIndex + 1 : ""}
          </DialogTitle>
          {fullscreenIndex !== null && fullscreenImage && (
            <div className="relative w-full h-[90vh] flex items-center justify-center">
              <Image
                src={fullscreenImage}
                alt={`Generated image ${fullscreenIndex + 1}`}
                fill
                className="object-contain"
                sizes="95vw"
                priority
              />

              {/* Action buttons */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(fullscreenImage, fullscreenIndex)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenInNewTab(fullscreenImage)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in new tab
                </Button>
              </div>

              {/* Navigation for multiple images */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setFullscreenIndex((fullscreenIndex - 1 + images.length) % images.length)}
                  >
                    <span className="text-2xl">&lt;</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => setFullscreenIndex((fullscreenIndex + 1) % images.length)}
                  >
                    <span className="text-2xl">&gt;</span>
                  </Button>

                  {/* Image counter */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {fullscreenIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
