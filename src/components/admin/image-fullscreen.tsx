"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageFullscreenProps {
  src: string;
  alt: string;
  title?: string | undefined;
  description?: string | undefined;
  thumbnailClassName?: string | undefined;
  thumbnailWidth?: number | undefined;
  thumbnailHeight?: number | undefined;
  fill?: boolean | undefined;
  children?: React.ReactNode | undefined;
}

export function ImageFullscreen({
  src,
  alt,
  title,
  description,
  thumbnailClassName,
  thumbnailWidth = 40,
  thumbnailHeight = 40,
  fill,
  children,
}: ImageFullscreenProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail/Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "group relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md overflow-hidden",
          fill && "w-full h-full"
        )}
        aria-label={`View ${title ?? alt} in fullscreen`}
      >
        {children ? (
          children
        ) : fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className={cn("object-cover", thumbnailClassName)}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={thumbnailWidth}
            height={thumbnailHeight}
            className={cn("object-cover", thumbnailClassName)}
          />
        )}
        {/* Hover overlay with expand icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      {/* Fullscreen Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 bg-black/95 border-none overflow-hidden"
        >
          <div className="sr-only">
            <DialogTitle>{title ?? alt}</DialogTitle>
            <DialogDescription>
              {description ?? `Fullscreen view of ${title ?? alt}`}
            </DialogDescription>
          </div>

          {/* Close button - Escape key also closes dialog */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>

          {/* Image container */}
          <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh]">
            <Image
              src={src}
              alt={alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain"
              priority
            />
          </div>

          {/* Title and description overlay */}
          {(title || description) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
              {title && (
                <h3 className="text-white font-semibold text-lg">{title}</h3>
              )}
              {description && (
                <p className="text-white/80 text-sm mt-1 line-clamp-3">
                  {description}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
