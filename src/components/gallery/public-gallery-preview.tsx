"use client";

import { useEffect, useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import type { GalleryImage, PaginatedResponse } from "@/lib/types/generation";
import { ImageCard } from "./image-card";
import { ImageDetailModal } from "./image-detail-modal";

export function PublicGalleryPreview() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/gallery/public?pageSize=8");
        if (response.ok) {
          const data: PaginatedResponse<GalleryImage> = await response.json();
          setImages(data.items);
        }
      } catch (error) {
        console.error("Failed to fetch public gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square bg-muted rounded-lg flex items-center justify-center"
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.slice(0, 8).map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            showUser
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </div>

      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        showUser
      />
    </>
  );
}
