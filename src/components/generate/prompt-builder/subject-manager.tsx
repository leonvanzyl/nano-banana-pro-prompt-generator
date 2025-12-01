"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AvatarSelectorModal } from "@/components/avatars/avatar-selector-modal";
import { Button } from "@/components/ui/button";
import { useAvatars } from "@/hooks/use-avatars";
import type { SubjectConfig, Avatar } from "@/lib/types/generation";
import { SubjectCard } from "./subject-card";

interface SubjectManagerProps {
  subjects: SubjectConfig[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SubjectConfig>) => void;
  onLinkAvatar: (subjectId: string, avatar: Avatar | null) => void;
}

export function SubjectManager({
  subjects,
  onAdd,
  onRemove,
  onUpdate,
  onLinkAvatar,
}: SubjectManagerProps) {
  const { avatars, isLoading: avatarsLoading } = useAvatars();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectingForSubjectId, setSelectingForSubjectId] = useState<string | null>(null);

  const handleOpenAvatarSelector = (subjectId: string) => {
    setSelectingForSubjectId(subjectId);
    setAvatarModalOpen(true);
  };

  const handleSelectAvatar = (avatar: Avatar | null) => {
    if (selectingForSubjectId) {
      onLinkAvatar(selectingForSubjectId, avatar);
    }
    setSelectingForSubjectId(null);
  };

  // Get the currently selected avatar ID for the subject being edited
  const selectedAvatarId = selectingForSubjectId
    ? subjects.find((s) => s.id === selectingForSubjectId)?.avatarId
    : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Subjects</h3>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No subjects added yet</p>
          <Button variant="outline" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Subject
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              index={index}
              onUpdate={(updates) => onUpdate(subject.id, updates)}
              onRemove={() => onRemove(subject.id)}
              onSelectAvatar={() => handleOpenAvatarSelector(subject.id)}
            />
          ))}
        </div>
      )}

      {/* Avatar Selector Modal */}
      <AvatarSelectorModal
        open={avatarModalOpen}
        onOpenChange={setAvatarModalOpen}
        avatars={avatars}
        isLoading={avatarsLoading}
        selectedId={selectedAvatarId}
        onSelect={handleSelectAvatar}
      />
    </div>
  );
}
