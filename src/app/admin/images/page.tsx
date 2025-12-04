"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Loader2, Eye, EyeOff, Heart } from "lucide-react";
import { DeleteConfirmation } from "@/components/admin/delete-confirmation";
import { Pagination } from "@/components/admin/pagination";
import { UserSearch } from "@/components/admin/user-search";
import { Badge } from "@/components/ui/badge";
import type {
  AdminImage,
  AdminPaginatedResponse,
  UserSearchResult,
} from "@/lib/types/admin";

export default function AdminImagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [images, setImages] = useState<AdminImage[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(
    null
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get("pageSize") || "20", 10)
  );

  // Handle userId from URL on initial load
  const initialUserId = searchParams.get("userId");

  // Fetch user info when userId is in URL
  useEffect(() => {
    if (initialUserId && !selectedUser) {
      fetch(`/api/admin/users/search?id=${initialUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.users && data.users.length > 0) {
            setSelectedUser(data.users[0]);
          }
        })
        .catch(console.error);
    }
  }, [initialUserId, selectedUser]);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedUser) params.set("userId", selectedUser.id);
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());

      const response = await fetch(`/api/admin/images?${params.toString()}`);
      if (response.ok) {
        const data: AdminPaginatedResponse<AdminImage> = await response.json();
        setImages(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser, page, pageSize]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedUser) params.set("userId", selectedUser.id);
    if (page > 1) params.set("page", page.toString());
    if (pageSize !== 20) params.set("pageSize", pageSize.toString());

    const newUrl = params.toString()
      ? `/admin/images?${params.toString()}`
      : "/admin/images";
    router.replace(newUrl, { scroll: false });
  }, [selectedUser, page, pageSize, router]);

  const handleUserChange = (user: UserSearchResult | null) => {
    setSelectedUser(user);
    setPage(1);
  };

  const handleDelete = async (imageId: string) => {
    const response = await fetch(`/api/admin/images/${imageId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete image");
    }

    fetchImages();
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncatePrompt = (prompt: string, maxLength: number = 80) => {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Generated Images</h1>
        <p className="text-muted-foreground">
          View and manage all generated images on the platform.
        </p>
      </div>

      {/* User Filter */}
      <div className="max-w-sm">
        <label className="text-sm font-medium mb-2 block">Filter by user</label>
        <UserSearch
          selectedUser={selectedUser}
          onSelect={handleUserChange}
          placeholder="Search users to filter..."
        />
      </div>

      {/* Image Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {selectedUser
            ? "No images found for this user."
            : "No images found."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="border rounded-lg overflow-hidden bg-card"
            >
              {/* Image */}
              <div className="aspect-square relative bg-muted">
                <Image
                  src={image.imageUrl}
                  alt={image.prompt}
                  fill
                  className="object-cover"
                />
                {/* Visibility Badge */}
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={image.isPublic ? "default" : "secondary"}
                    className="gap-1"
                  >
                    {image.isPublic ? (
                      <>
                        <Eye className="h-3 w-3" />
                        Public
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
                {/* Like Count */}
                {image.likeCount > 0 && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="gap-1">
                      <Heart className="h-3 w-3" />
                      {image.likeCount}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 space-y-2">
                {/* Prompt */}
                <p
                  className="text-sm line-clamp-2"
                  title={image.prompt}
                >
                  {truncatePrompt(image.prompt)}
                </p>

                {/* Owner & Date */}
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {image.user.image ? (
                      <Image
                        src={image.user.image}
                        alt={image.user.name}
                        width={16}
                        height={16}
                        className="rounded-full flex-shrink-0"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="h-2 w-2" />
                      </div>
                    )}
                    <span className="truncate">{image.user.name}</span>
                  </div>
                  <span className="flex-shrink-0">
                    {formatDate(image.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t">
                  <DeleteConfirmation
                    title="Delete Image"
                    description="Are you sure you want to delete this image? This action cannot be undone."
                    onConfirm={() => handleDelete(image.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && images.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPage(1);
          }}
        />
      )}
    </div>
  );
}
