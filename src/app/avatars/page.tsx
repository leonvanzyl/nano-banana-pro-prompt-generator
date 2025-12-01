"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { AvatarFormModal } from "@/components/avatars/avatar-form-modal";
import { AvatarList } from "@/components/avatars/avatar-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAvatars } from "@/hooks/use-avatars";
import { useSession } from "@/lib/auth-client";
import type { Avatar, AvatarType } from "@/lib/types/generation";

export default function AvatarsPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const { avatars, isLoading, createAvatar, updateAvatar, deleteAvatar } = useAvatars();

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState<Avatar | undefined>();
  const [deletingAvatar, setDeletingAvatar] = useState<Avatar | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission (create or edit)
  const handleFormSubmit = async (data: {
    name: string;
    description: string;
    avatarType: AvatarType;
    image?: File | undefined;
  }) => {
    setIsSubmitting(true);
    try {
      if (editingAvatar) {
        // Update existing avatar
        const result = await updateAvatar(editingAvatar.id, {
          name: data.name,
          description: data.description || undefined,
          avatarType: data.avatarType,
        });
        if (result) {
          toast.success("Avatar updated successfully");
          setFormModalOpen(false);
          setEditingAvatar(undefined);
        } else {
          toast.error("Failed to update avatar");
        }
      } else {
        // Create new avatar
        if (!data.image) {
          toast.error("Image is required");
          return;
        }
        const result = await createAvatar(
          {
            name: data.name,
            description: data.description || undefined,
            avatarType: data.avatarType,
            imageUrl: "", // Will be set by API
          },
          data.image
        );
        if (result) {
          toast.success("Avatar created successfully");
          setFormModalOpen(false);
        } else {
          toast.error("Failed to create avatar");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit click
  const handleEdit = (avatar: Avatar) => {
    setEditingAvatar(avatar);
    setFormModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingAvatar) return;

    const success = await deleteAvatar(deletingAvatar.id);
    if (success) {
      toast.success("Avatar deleted successfully");
    } else {
      toast.error("Failed to delete avatar");
    }
    setDeletingAvatar(null);
  };

  // Handle modal close
  const handleFormModalClose = (open: boolean) => {
    if (!open) {
      setEditingAvatar(undefined);
    }
    setFormModalOpen(open);
  };

  // Auth check
  if (sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Your Avatars</h1>
            <p className="text-muted-foreground">
              Manage your reference images for AI generation
            </p>
          </div>
        </div>
        <Button onClick={() => setFormModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Avatar
        </Button>
      </div>

      {/* Avatar List */}
      <AvatarList
        avatars={avatars}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeletingAvatar}
      />

      {/* Create/Edit Modal */}
      <AvatarFormModal
        open={formModalOpen}
        onOpenChange={handleFormModalClose}
        avatar={editingAvatar}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingAvatar} onOpenChange={() => setDeletingAvatar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Avatar</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingAvatar?.name}&quot;? This action
              cannot be undone and the associated image will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
