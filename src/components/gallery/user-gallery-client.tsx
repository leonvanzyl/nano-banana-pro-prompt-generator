"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Heart, ImageIcon, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GalleryImage, PaginatedResponse, PublicUserProfile } from "@/lib/types/generation";
import { GalleryGrid } from "./gallery-grid";
import { ImageCard } from "./image-card";
import { ImageDetailModal } from "./image-detail-modal";

interface UserGalleryClientProps {
  userId: string;
}

export function UserGalleryClient({ userId }: UserGalleryClientProps) {
  const [userProfile, setUserProfile] = useState<PublicUserProfile | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const pageSize = 20;

  // Fetch user gallery
  const fetchUserGallery = useCallback(async (pageNum: number, isInitial: boolean) => {
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

      const response = await fetch(`/api/gallery/user/${userId}?${params}`);
      if (!response.ok) throw new Error("Failed to fetch user gallery");

      const data: { user: PublicUserProfile; images: PaginatedResponse<GalleryImage> } = await response.json();

      if (isInitial) {
        setUserProfile(data.user);
        setImages(data.images.items);
      } else {
        setImages((prev) => [...prev, ...data.images.items]);
      }
      setTotal(data.images.total);
      setHasMore(data.images.hasMore);
    } catch (error) {
      console.error("Error fetching user gallery:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchUserGallery(1, true);
  }, [fetchUserGallery]);

  // Load more
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUserGallery(nextPage, false);
    }
  };

  // Handle like changes
  const handleLikeChange = (imageId: string, isLiked: boolean, likeCount: number) => {
    setImages((prev) =>
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
    // Update user stats
    if (userProfile) {
      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              stats: {
                ...prev.stats,
                totalLikesReceived: prev.stats.totalLikesReceived + (isLiked ? 1 : -1),
              },
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/gallery/public">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Button>
      </Link>

      {/* User Profile Header */}
      {loading && !userProfile ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : userProfile ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.image || undefined} alt={userProfile.name} />
                <AvatarFallback className="text-2xl">
                  {userProfile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {formatDistanceToNow(new Date(userProfile.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="flex gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-2xl font-bold">
                    <ImageIcon className="h-5 w-5 text-purple-500" />
                    {userProfile.stats.totalPublicImages}
                  </div>
                  <p className="text-xs text-muted-foreground">Public Images</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-2xl font-bold">
                    <Heart className="h-5 w-5 text-red-500" />
                    {userProfile.stats.totalLikesReceived}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Likes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* User's Images */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">Public Images</h2>
          {total > 0 && (
            <span className="text-sm text-muted-foreground">({total})</span>
          )}
        </div>

        <GalleryGrid
          loading={loading}
          isEmpty={images.length === 0}
          emptyMessage="This user hasn't shared any public images yet."
        >
          {images.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              showUser={false}
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
        showUser={false}
      />
    </div>
  );
}
