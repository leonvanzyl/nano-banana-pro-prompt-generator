"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, User, Package, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Avatar } from "@/lib/types/generation";

interface AvatarSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  avatars: Avatar[];
  isLoading: boolean;
  selectedId?: string | undefined;
  onSelect: (avatar: Avatar | null) => void;
  filterType?: "human" | "object" | "all" | undefined;
}

export function AvatarSelectorModal({
  open,
  onOpenChange,
  avatars,
  isLoading,
  selectedId,
  onSelect,
  filterType = "all",
}: AvatarSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedId, setLocalSelectedId] = useState<string | undefined>(selectedId);

  // Filter avatars based on type and search query
  const filteredAvatars = avatars.filter((avatar) => {
    const matchesType = filterType === "all" || avatar.avatarType === filterType;
    const matchesSearch =
      !searchQuery ||
      avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      avatar.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleConfirm = () => {
    const selectedAvatar = avatars.find((a) => a.id === localSelectedId);
    onSelect(selectedAvatar || null);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalSelectedId(undefined);
    onSelect(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Avatar</DialogTitle>
          <DialogDescription>
            Choose an avatar to use as a reference image in your generation.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search avatars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Avatar Grid */}
        <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4 p-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredAvatars.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
              <p className="text-lg">No avatars found</p>
              {searchQuery && (
                <p className="text-sm">Try a different search term</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 p-1">
              {filteredAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setLocalSelectedId(avatar.id)}
                  className={`relative rounded-lg border overflow-hidden transition-all ${
                    localSelectedId === avatar.id
                      ? "ring-2 ring-primary border-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                    {localSelectedId === avatar.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 text-left">
                    <p className="text-sm font-medium truncate">{avatar.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {avatar.avatarType === "human" ? (
                        <User className="h-3 w-3 mr-1" />
                      ) : (
                        <Package className="h-3 w-3 mr-1" />
                      )}
                      {avatar.avatarType}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button type="button" variant="ghost" onClick={handleClear}>
            Clear Selection
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
