"use client";

import { useState, useCallback, useMemo } from "react";
import { nanoid } from "nanoid";
import { getTemplateById } from "@/lib/data/templates";
import type {
  PromptBuilderState,
  SubjectConfig,
  GenerationSettings,
  Avatar,
} from "@/lib/types/generation";

interface UsePromptBuilderReturn {
  // State
  state: PromptBuilderState;
  settings: GenerationSettings;

  // Setters
  setLocation: (value: string) => void;
  setLighting: (value: string) => void;
  setCamera: (value: string) => void;
  setStyle: (value: string) => void;
  setCustomPrompt: (value: string) => void;
  setSettings: (settings: Partial<GenerationSettings>) => void;

  // Subject management
  addSubject: () => void;
  removeSubject: (id: string) => void;
  updateSubject: (id: string, updates: Partial<SubjectConfig>) => void;
  linkAvatarToSubject: (subjectId: string, avatar: Avatar | null) => void;

  // Computed
  assembledPrompt: string;
  referenceImages: { avatarId: string; imageUrl: string; type: "human" | "object" }[];

  // Actions
  reset: () => void;
  loadFromPreset: (preset: PromptBuilderState) => void;
}

const defaultSettings: GenerationSettings = {
  resolution: "2K",
  aspectRatio: "1:1",
  imageCount: 1,
};

const defaultState: PromptBuilderState = {
  location: "",
  lighting: "",
  camera: "",
  style: "",
  subjects: [],
  customPrompt: "",
};

const createEmptySubject = (): SubjectConfig => ({
  id: nanoid(),
  pose: "",
  action: "",
  clothing: "",
  hair: "",
  makeup: "",
  expression: "",
  customDescription: "",
});

export function usePromptBuilder(): UsePromptBuilderReturn {
  const [state, setState] = useState<PromptBuilderState>(defaultState);
  const [settings, setSettingsState] = useState<GenerationSettings>(defaultSettings);

  // Simple setters
  const setLocation = useCallback((value: string) => {
    setState((prev) => ({ ...prev, location: value }));
  }, []);

  const setLighting = useCallback((value: string) => {
    setState((prev) => ({ ...prev, lighting: value }));
  }, []);

  const setCamera = useCallback((value: string) => {
    setState((prev) => ({ ...prev, camera: value }));
  }, []);

  const setStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, style: value }));
  }, []);

  const setCustomPrompt = useCallback((value: string) => {
    setState((prev) => ({ ...prev, customPrompt: value }));
  }, []);

  const setSettings = useCallback((newSettings: Partial<GenerationSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Subject management
  const addSubject = useCallback(() => {
    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, createEmptySubject()],
    }));
  }, []);

  const removeSubject = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s.id !== id),
    }));
  }, []);

  const updateSubject = useCallback((id: string, updates: Partial<SubjectConfig>) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const linkAvatarToSubject = useCallback((subjectId: string, avatar: Avatar | null) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              avatarId: avatar?.id,
              avatarName: avatar?.name,
              avatarDescription: avatar?.description ?? undefined,
              avatarImageUrl: avatar?.imageUrl,
            }
          : s
      ),
    }));
  }, []);

  // Helper to get prompt fragment from template ID or return the value as-is
  const getPromptValue = useCallback((value: string): string => {
    if (!value) return "";
    // Check if it's a template ID
    const template = getTemplateById(value);
    return template ? template.promptFragment : value;
  }, []);

  // Assemble the final prompt
  const assembledPrompt = useMemo(() => {
    const parts: string[] = [];

    // Add style first (overall aesthetic)
    const stylePrompt = getPromptValue(state.style);
    if (stylePrompt) {
      parts.push(stylePrompt);
    }

    // Add subjects
    state.subjects.forEach((subject, index) => {
      const subjectParts: string[] = [];

      // If has avatar, use description for better prompt context (fallback to name)
      if (subject.avatarDescription) {
        subjectParts.push(subject.avatarDescription);
      } else if (subject.avatarName) {
        subjectParts.push(subject.avatarName);
      } else {
        subjectParts.push(`Subject ${index + 1}`);
      }

      // Add subject attributes
      const pose = getPromptValue(subject.pose || "");
      const action = getPromptValue(subject.action || "");
      const clothing = getPromptValue(subject.clothing || "");
      const expression = getPromptValue(subject.expression || "");

      if (pose) subjectParts.push(pose);
      if (action) subjectParts.push(action);
      if (clothing) subjectParts.push(clothing);
      if (expression) subjectParts.push(expression);
      if (subject.hair) subjectParts.push(subject.hair);
      if (subject.makeup) subjectParts.push(subject.makeup);
      if (subject.customDescription) subjectParts.push(subject.customDescription);

      if (subjectParts.length > 0) {
        parts.push(subjectParts.join(", "));
      }
    });

    // Add location
    const locationPrompt = getPromptValue(state.location);
    if (locationPrompt) {
      parts.push(`in ${locationPrompt}`);
    }

    // Add lighting
    const lightingPrompt = getPromptValue(state.lighting);
    if (lightingPrompt) {
      parts.push(lightingPrompt);
    }

    // Add camera/composition
    const cameraPrompt = getPromptValue(state.camera);
    if (cameraPrompt) {
      parts.push(cameraPrompt);
    }

    // Add custom prompt at the end
    if (state.customPrompt) {
      parts.push(state.customPrompt);
    }

    return parts.filter(Boolean).join(". ");
  }, [state, getPromptValue]);

  // Get reference images from subjects with avatars
  const referenceImages = useMemo(() => {
    return state.subjects
      .filter((s) => s.avatarId && s.avatarImageUrl)
      .map((s) => ({
        avatarId: s.avatarId!,
        imageUrl: s.avatarImageUrl!,
        type: "human" as const, // We could determine this from the avatar type
      }));
  }, [state.subjects]);

  // Reset to default
  const reset = useCallback(() => {
    setState(defaultState);
    setSettingsState(defaultSettings);
  }, []);

  // Load from preset
  const loadFromPreset = useCallback((preset: PromptBuilderState) => {
    setState(preset);
  }, []);

  return {
    state,
    settings,
    setLocation,
    setLighting,
    setCamera,
    setStyle,
    setCustomPrompt,
    setSettings,
    addSubject,
    removeSubject,
    updateSubject,
    linkAvatarToSubject,
    assembledPrompt,
    referenceImages,
    reset,
    loadFromPreset,
  };
}
