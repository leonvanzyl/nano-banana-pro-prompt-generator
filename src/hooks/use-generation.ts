"use client";

import { useState, useCallback } from "react";
import type {
  GenerationSettings,
  GenerationWithImages,
  GenerationHistoryEntry,
  PaginatedResponse,
  AvatarType,
} from "@/lib/types/generation";

interface GenerateInput {
  prompt: string;
  settings: GenerationSettings;
  referenceImages?: {
    avatarId: string;
    type: AvatarType;
  }[];
}

interface RefineInput {
  generationId: string;
  instruction: string;
  selectedImageId?: string;
}

interface UseGenerationReturn {
  // Current generation state
  currentGeneration: GenerationWithImages | null;
  currentHistory: GenerationHistoryEntry[];
  isGenerating: boolean;
  isRefining: boolean;
  error: string | null;

  // Generation list state
  generations: GenerationWithImages[];
  isLoadingList: boolean;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };

  // Actions
  generate: (input: GenerateInput) => Promise<GenerationWithImages | null>;
  refine: (input: RefineInput) => Promise<GenerationWithImages | null>;
  loadGeneration: (id: string) => Promise<void>;
  loadGenerations: (page?: number, pageSize?: number) => Promise<void>;
  deleteGeneration: (id: string) => Promise<boolean>;
  clearCurrent: () => void;
  clearError: () => void;
}

export function useGeneration(): UseGenerationReturn {
  // Current generation state
  const [currentGeneration, setCurrentGeneration] = useState<GenerationWithImages | null>(null);
  const [currentHistory, setCurrentHistory] = useState<GenerationHistoryEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generation list state
  const [generations, setGenerations] = useState<GenerationWithImages[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: false,
  });

  /**
   * Generate new images
   */
  const generate = useCallback(
    async (input: GenerateInput): Promise<GenerationWithImages | null> => {
      setIsGenerating(true);
      setError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.error || "Failed to generate images";
          setError(errorMessage);
          // Even on error, we may have a generation record with failed status
          if (data.generation) {
            setCurrentGeneration(data.generation);
          }
          return null;
        }

        const generation = data.generation as GenerationWithImages;
        setCurrentGeneration(generation);

        // Add to the list if we have a list loaded
        setGenerations((prev) => {
          // Check if already in list
          const exists = prev.some((g) => g.id === generation.id);
          if (exists) {
            return prev.map((g) => (g.id === generation.id ? generation : g));
          }
          return [generation, ...prev];
        });

        return generation;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to generate images";
        setError(message);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  /**
   * Refine an existing generation
   */
  const refine = useCallback(
    async (input: RefineInput): Promise<GenerationWithImages | null> => {
      setIsRefining(true);
      setError(null);

      try {
        const response = await fetch(`/api/generate/${input.generationId}/refine`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instruction: input.instruction,
            selectedImageId: input.selectedImageId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMessage = data.error || "Failed to refine generation";
          setError(errorMessage);
          return null;
        }

        const generation = data.generation as GenerationWithImages;
        const history = data.history as GenerationHistoryEntry[];

        setCurrentGeneration(generation);
        setCurrentHistory(history);

        // Update in the list
        setGenerations((prev) =>
          prev.map((g) => (g.id === generation.id ? generation : g))
        );

        return generation;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to refine generation";
        setError(message);
        return null;
      } finally {
        setIsRefining(false);
      }
    },
    []
  );

  /**
   * Load a specific generation with its history
   */
  const loadGeneration = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);

      const response = await fetch(`/api/generations/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load generation");
      }

      setCurrentGeneration(data.generation as GenerationWithImages);
      setCurrentHistory(data.history as GenerationHistoryEntry[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load generation";
      setError(message);
    }
  }, []);

  /**
   * Load list of generations with pagination
   */
  const loadGenerations = useCallback(
    async (page: number = 1, pageSize: number = 10): Promise<void> => {
      setIsLoadingList(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/generations?page=${page}&pageSize=${pageSize}`
        );
        const data = (await response.json()) as PaginatedResponse<GenerationWithImages>;

        if (!response.ok) {
          throw new Error("Failed to load generations");
        }

        setGenerations(data.items);
        setPagination({
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          hasMore: data.hasMore,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load generations";
        setError(message);
      } finally {
        setIsLoadingList(false);
      }
    },
    []
  );

  /**
   * Delete a generation
   */
  const deleteGeneration = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/generations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete generation");
      }

      // Remove from list
      setGenerations((prev) => prev.filter((g) => g.id !== id));

      // Clear current if it was the deleted one
      setCurrentGeneration((prev) => (prev?.id === id ? null : prev));
      if (currentGeneration?.id === id) {
        setCurrentHistory([]);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete generation";
      setError(message);
      return false;
    }
  }, [currentGeneration?.id]);

  /**
   * Clear current generation
   */
  const clearCurrent = useCallback(() => {
    setCurrentGeneration(null);
    setCurrentHistory([]);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    currentGeneration,
    currentHistory,
    isGenerating,
    isRefining,
    error,
    generations,
    isLoadingList,
    pagination,
    generate,
    refine,
    loadGeneration,
    loadGenerations,
    deleteGeneration,
    clearCurrent,
    clearError,
  };
}
