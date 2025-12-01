"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, TrendingUp, Users, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { GalleryImage, PaginatedResponse, TopContributor } from "@/lib/types/generation";
import { GalleryGrid } from "./gallery-grid";
import { ImageCard } from "./image-card";
import { ImageDetailModal } from "./image-detail-modal";

export function PublicGalleryClient() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [mostLikedImages, setMostLikedImages] = useState<GalleryImage[]>([]);
  const [topContributors, setTopContributors] = useState<TopContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const pageSize = 20;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch featured sections (most liked and top contributors)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [mostLikedRes, contributorsRes] = await Promise.all([
          fetch("/api/gallery/most-liked?limit=8"),
          fetch("/api/gallery/top-contributors?limit=5"),
        ]);

        if (mostLikedRes.ok) {
          const data = await mostLikedRes.json();
          setMostLikedImages(data.images);
        }

        if (contributorsRes.ok) {
          const data = await contributorsRes.json();
          setTopContributors(data.contributors);
        }
      } catch (error) {
        console.error("Error fetching featured sections:", error);
      }
    };

    fetchFeatured();
  }, []);

  // Fetch public gallery images
  const fetchImages = useCallback(async (pageNum: number, searchQuery: string, isInitial: boolean) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        pageSize: pageSize.toString(),
      });
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const response = await fetch(`/api/gallery/public?${params}`);
      if (!response.ok) throw new Error("Failed to fetch images");

      const data: PaginatedResponse<GalleryImage> = await response.json();

      if (isInitial) {
        setImages(data.items);
      } else {
        setImages((prev) => [...prev, ...data.items]);
      }
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching public gallery:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial fetch and search changes
  useEffect(() => {
    fetchImages(1, debouncedSearch, true);
  }, [debouncedSearch, fetchImages]);

  // Load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchImages(nextPage, debouncedSearch, false);
    }
  };

  // Handle like changes
  const handleLikeChange = (imageId: string, isLiked: boolean, likeCount: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, isLikedByUser: isLiked, likeCount } : img
      )
    );
    setMostLikedImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, isLikedByUser: isLiked, likeCount } : img
      )
    );
    // Update selected image if it's the one being liked
    if (selectedImage?.id === imageId) {
      setSelectedImage((prev) =>
        prev ? { ...prev, isLikedByUser: isLiked, likeCount } : null
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search images by prompt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Only show featured sections when not searching */}
      {!debouncedSearch && (
        <>
          {/* Most Liked Section */}
          {mostLikedImages.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-semibold">Most Liked</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mostLikedImages.slice(0, 8).map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    showUser
                    showLikes
                    onClick={() => setSelectedImage(image)}
                    onLikeChange={handleLikeChange}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Top Contributors Section */}
          {topContributors.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Top Contributors</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {topContributors.map((contributor, index) => (
                  <Link key={contributor.user.id} href={`/gallery/user/${contributor.user.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={contributor.user.image || undefined}
                              alt={contributor.user.name}
                            />
                            <AvatarFallback>
                              {contributor.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {index < 3 && (
                            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-yellow-500 text-white text-xs font-bold rounded-full">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{contributor.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contributor.totalImages} images · {contributor.totalLikes} likes
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* All Images Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="text-xl font-semibold">
            {debouncedSearch ? `Search Results` : "Latest Images"}
          </h2>
          {total > 0 && (
            <span className="text-sm text-muted-foreground">({total} total)</span>
          )}
        </div>

        <GalleryGrid
          loading={loading}
          isEmpty={images.length === 0}
          emptyMessage={
            debouncedSearch
              ? `No images found for "${debouncedSearch}"`
              : "No public images yet. Be the first to share!"
          }
        >
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              showUser
              showLikes
              onClick={() => setSelectedImage(image)}
              onLikeChange={handleLikeChange}
            />
          ))}
        </GalleryGrid>

        {/* Load More Button */}
        {hasMore && !loading && images.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </section>

      {/* Image Detail Modal */}
      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
        showUser
      />
    </div>
  );
}
