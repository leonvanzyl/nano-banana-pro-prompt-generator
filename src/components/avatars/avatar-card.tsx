"use client";

import Image from "next/image";
import { Pencil, Trash2, User, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Avatar } from "@/lib/types/generation";

interface AvatarCardProps {
  avatar: Avatar;
  onEdit: (avatar: Avatar) => void;
  onDelete: (avatar: Avatar) => void;
}

export function AvatarCard({ avatar, onEdit, onDelete }: AvatarCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <Image
            src={avatar.imageUrl}
            alt={avatar.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold truncate">{avatar.name}</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            {avatar.avatarType === "human" ? (
              <User className="h-3 w-3" />
            ) : (
              <Package className="h-3 w-3" />
            )}
            {avatar.avatarType}
          </Badge>
        </div>
        {avatar.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {avatar.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(avatar)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive"
          onClick={() => onDelete(avatar)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
