"use client";

import { useState, useCallback, useEffect } from "react";
import type { ApiKeyStatus } from "@/lib/types/generation";

interface UseApiKeyReturn {
  hasKey: boolean;
  hint: string | null;
  isLoading: boolean;
  error: string | null;
  checkApiKey: () => Promise<void>;
}

export function useApiKey(): UseApiKeyReturn {
  const [hasKey, setHasKey] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/user/api-key");
      const data = (await response.json()) as ApiKeyStatus;

      if (!response.ok) {
        throw new Error("Failed to check API key status");
      }

      setHasKey(data.hasKey);
      setHint(data.hint || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to check API key status";
      setError(message);
      setHasKey(false);
      setHint(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  return {
    hasKey,
    hint,
    isLoading,
    error,
    checkApiKey,
  };
}
