"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  Preset,
  PresetConfig,
  CreatePresetInput,
  UpdatePresetInput,
} from "@/lib/types/generation";

interface UsePresetsReturn {
  presets: Preset[];
  isLoading: boolean;
  error: string | null;
  fetchPresets: () => Promise<void>;
  createPreset: (name: string, config: PresetConfig) => Promise<boolean>;
  updatePreset: (id: string, input: UpdatePresetInput) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
  getPresetById: (id: string) => Preset | undefined;
  clearError: () => void;
}

export function usePresets(): UsePresetsReturn {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/presets");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch presets");
      }

      setPresets(data.presets);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch presets";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPreset = useCallback(
    async (name: string, config: PresetConfig): Promise<boolean> => {
      try {
        setError(null);

        const input: CreatePresetInput = { name, config };

        const response = await fetch("/api/presets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create preset");
        }

        // Add the new preset to the list
        setPresets((prev) => [data.preset, ...prev]);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create preset";
        setError(message);
        return false;
      }
    },
    []
  );

  const updatePreset = useCallback(
    async (id: string, input: UpdatePresetInput): Promise<boolean> => {
      try {
        setError(null);

        const response = await fetch(`/api/presets/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update preset");
        }

        // Update the preset in the list
        setPresets((prev) =>
          prev.map((preset) => (preset.id === id ? data.preset : preset))
        );
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update preset";
        setError(message);
        return false;
      }
    },
    []
  );

  const deletePreset = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/presets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete preset");
      }

      // Remove the preset from the list
      setPresets((prev) => prev.filter((preset) => preset.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete preset";
      setError(message);
      return false;
    }
  }, []);

  const getPresetById = useCallback(
    (id: string): Preset | undefined => {
      return presets.find((preset) => preset.id === id);
    },
    [presets]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch presets on mount
  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  return {
    presets,
    isLoading,
    error,
    fetchPresets,
    createPreset,
    updatePreset,
    deletePreset,
    getPresetById,
    clearError,
  };
}
