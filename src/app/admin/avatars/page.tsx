"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Loader2 } from "lucide-react";
import { DeleteConfirmation } from "@/components/admin/delete-confirmation";
import { ImageFullscreen } from "@/components/admin/image-fullscreen";
import { Pagination } from "@/components/admin/pagination";
import { UserSearch } from "@/components/admin/user-search";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AdminAvatar,
  AdminPaginatedResponse,
  UserSearchResult,
} from "@/lib/types/admin";

export default function AdminAvatarsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [avatars, setAvatars] = useState<AdminAvatar[]>([]);
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

  const fetchAvatars = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedUser) params.set("userId", selectedUser.id);
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());

      const response = await fetch(`/api/admin/avatars?${params.toString()}`);
      if (response.ok) {
        const data: AdminPaginatedResponse<AdminAvatar> = await response.json();
        setAvatars(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching avatars:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser, page, pageSize]);

  useEffect(() => {
    fetchAvatars();
  }, [fetchAvatars]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedUser) params.set("userId", selectedUser.id);
    if (page > 1) params.set("page", page.toString());
    if (pageSize !== 20) params.set("pageSize", pageSize.toString());

    const newUrl = params.toString()
      ? `/admin/avatars?${params.toString()}`
      : "/admin/avatars";
    router.replace(newUrl, { scroll: false });
  }, [selectedUser, page, pageSize, router]);

  const handleUserChange = (user: UserSearchResult | null) => {
    setSelectedUser(user);
    setPage(1);
  };

  const handleDelete = async (avatarId: string) => {
    const response = await fetch(`/api/admin/avatars/${avatarId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete avatar");
    }

    fetchAvatars();
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Avatars</h1>
        <p className="text-muted-foreground">
          View and manage all avatars created by users.
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

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : avatars.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {selectedUser
            ? "No avatars found for this user."
            : "No avatars found."}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {avatars.map((avatar) => (
              <TableRow key={avatar.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                    <ImageFullscreen
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      title={avatar.name}
                      description={avatar.description ?? undefined}
                      thumbnailWidth={40}
                      thumbnailHeight={40}
                      thumbnailClassName="w-full h-full"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{avatar.name}</p>
                    {avatar.description && (
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {avatar.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {avatar.avatarType === "human" ? "Human" : "Object"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {avatar.user.image ? (
                      <Image
                        src={avatar.user.image}
                        alt={avatar.user.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-sm">{avatar.user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(avatar.createdAt)}
                </TableCell>
                <TableCell>
                  <DeleteConfirmation
                    title="Delete Avatar"
                    description={`Are you sure you want to delete "${avatar.name}"? This action cannot be undone.`}
                    onConfirm={() => handleDelete(avatar.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      {!isLoading && avatars.length > 0 && (
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
