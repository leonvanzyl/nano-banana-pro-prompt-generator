"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { GalleryImage, GeneratedImage, GenerationSettings } from "@/lib/types/generation";
import { LikeButton } from "./like-button";
import { VisibilityToggle } from "./visibility-toggle";

interface BaseImageCardProps {
  onClick?: () => void;
  className?: string;
}

interface GalleryImageCardProps extends BaseImageCardProps {
  image: GalleryImage;
  showUser?: boolean;
  showVisibilityToggle?: false;
  showLikes?: boolean;
  onLikeChange?: (imageId: string, isLiked: boolean, likeCount: number) => void;
}

interface PersonalImageCardProps extends BaseImageCardProps {
  image: GeneratedImage & {
    generation: {
      prompt: string;
      settings: GenerationSettings;
      createdAt: Date;
    };
  };
  showUser?: false;
  showVisibilityToggle?: boolean;
  showLikes?: false;
  onVisibilityChange?: (imageId: string, isPublic: boolean) => void;
}

type ImageCardProps = GalleryImageCardProps | PersonalImageCardProps;

function isGalleryImage(image: GalleryImageCardProps["image"] | PersonalImageCardProps["image"]): image is GalleryImage {
  return "user" in image && "likeCount" in image;
}

export function ImageCard({
  image,
  showUser = false,
  showVisibilityToggle = false,
  onClick,
  className,
  ...props
}: ImageCardProps) {
  const onVisibilityChange = "onVisibilityChange" in props ? props.onVisibilityChange : undefined;
  const showLikes = "showLikes" in props ? props.showLikes : false;
  const onLikeChange = "onLikeChange" in props ? props.onLikeChange : undefined;

  const prompt = image.generation.prompt;
  const truncatedPrompt = prompt.length > 100 ? `${prompt.slice(0, 100)}...` : prompt;
  const createdAt = new Date(image.createdAt);

  return (
    <Card
      className={`group relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${className || ""}`}
      onClick={onClick}
    >
      <div className="aspect-square relative">
        <Image
          src={image.imageUrl}
          alt={prompt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-sm line-clamp-2 mb-2">{truncatedPrompt}</p>
            <div className="flex items-center justify-between">
              {showUser && isGalleryImage(image) && (
                <Link
                  href={`/gallery/user/${image.user.id}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={image.user.image || undefined} alt={image.user.name} />
                    <AvatarFallback className="text-xs">
                      {image.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-white/80">{image.user.name}</span>
                </Link>
              )}
              <div className="flex items-center gap-2">
                {showLikes && isGalleryImage(image) && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center"
                  >
                    <LikeButton
                      imageId={image.id}
                      initialLikeCount={image.likeCount}
                      initialIsLiked={image.isLikedByUser}
                      onLikeChange={(isLiked, likeCount) => onLikeChange?.(image.id, isLiked, likeCount)}
                      size="sm"
                      className="text-white hover:text-white hover:bg-white/20"
                    />
                  </div>
                )}
                <span className="text-xs text-white/60">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Like count badge (always visible) */}
      {showLikes && isGalleryImage(image) && image.likeCount > 0 && (
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
          <Heart className="h-3 w-3 fill-current text-red-500" />
          <span>{image.likeCount}</span>
        </div>
      )}
      {showVisibilityToggle && (
        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <VisibilityToggle
            imageId={image.id}
            isPublic={image.isPublic}
            onToggle={onVisibilityChange}
          />
        </div>
      )}
    </Card>
  );
}
