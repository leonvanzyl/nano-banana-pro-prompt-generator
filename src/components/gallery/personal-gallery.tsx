"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  GenerationWithImages,
  GeneratedImage,
  GenerationSettings,
  PaginatedResponse,
} from "@/lib/types/generation";
import { GalleryGrid } from "./gallery-grid";
import { ImageCard } from "./image-card";
import { ImageDetailModal } from "./image-detail-modal";

type PersonalImage = GeneratedImage & {
  generation: {
    prompt: string;
    settings: GenerationSettings;
    createdAt: Date;
  };
};

export function PersonalGallery() {
  const [images, setImages] = useState<PersonalImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<PersonalImage | null>(null);

  const fetchImages = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/generations?page=${pageNum}&pageSize=20`);
      if (response.ok) {
        const data: PaginatedResponse<GenerationWithImages> = await response.json();

        // Flatten generations into individual images
        const flatImages: PersonalImage[] = data.items.flatMap((gen) =>
          gen.images.map((img) => ({
            ...img,
            generation: {
              prompt: gen.prompt,
              settings: gen.settings,
              createdAt: gen.createdAt,
            },
          }))
        );

        setImages(flatImages);
        setHasMore(data.hasMore);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(page);
  }, [page, fetchImages]);

  const handleVisibilityChange = (imageId: string, isPublic: boolean) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, isPublic } : img))
    );
    if (selectedImage?.id === imageId) {
      setSelectedImage({ ...selectedImage, isPublic });
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <>
      <GalleryGrid
        loading={loading}
        isEmpty={images.length === 0}
        emptyMessage="No images yet. Start generating to see your creations here!"
      >
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            showVisibilityToggle
            onClick={() => setSelectedImage(image)}
            onVisibilityChange={handleVisibilityChange}
          />
        ))}
      </GalleryGrid>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        showVisibilityToggle
        onVisibilityChange={handleVisibilityChange}
      />
    </>
  );
}
