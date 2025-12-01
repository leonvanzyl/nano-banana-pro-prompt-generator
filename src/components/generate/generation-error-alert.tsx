"use client";

import Link from "next/link";
import { AlertCircle, XCircle, RefreshCw, Key, ExternalLink } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface GenerationErrorAlertProps {
  error: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

// Error type detection and friendly messages
function getErrorInfo(error: string): {
  title: string;
  message: string;
  action?: "api-key" | "retry" | "quota" | "none";
} {
  const errorLower = error.toLowerCase();

  // API Key errors
  if (
    errorLower.includes("api key") ||
    errorLower.includes("invalid key") ||
    errorLower.includes("unauthorized") ||
    errorLower.includes("authentication")
  ) {
    return {
      title: "Invalid API Key",
      message:
        "Your Google API key appears to be invalid or expired. Please check your key and try again.",
      action: "api-key",
    };
  }

  // Rate limit errors
  if (
    errorLower.includes("rate limit") ||
    errorLower.includes("too many requests") ||
    errorLower.includes("quota exceeded") ||
    errorLower.includes("429")
  ) {
    return {
      title: "Rate Limit Exceeded",
      message:
        "You've exceeded the API rate limit. Please wait a few minutes before trying again.",
      action: "retry",
    };
  }

  // Quota errors
  if (errorLower.includes("quota") || errorLower.includes("billing")) {
    return {
      title: "API Quota Exceeded",
      message:
        "Your Google API quota has been exceeded. Please check your Google Cloud billing settings.",
      action: "quota",
    };
  }

  // Content policy errors
  if (
    errorLower.includes("content policy") ||
    errorLower.includes("safety") ||
    errorLower.includes("blocked") ||
    errorLower.includes("harmful")
  ) {
    return {
      title: "Content Policy Violation",
      message:
        "Your prompt was blocked due to content policy. Please modify your prompt and try again.",
      action: "none",
    };
  }

  // Network errors
  if (
    errorLower.includes("network") ||
    errorLower.includes("timeout") ||
    errorLower.includes("connection")
  ) {
    return {
      title: "Connection Error",
      message:
        "There was a problem connecting to the server. Please check your internet connection and try again.",
      action: "retry",
    };
  }

  // Default error
  return {
    title: "Generation Failed",
    message: error || "An unexpected error occurred. Please try again.",
    action: "retry",
  };
}

export function GenerationErrorAlert({
  error,
  onDismiss,
  onRetry,
}: GenerationErrorAlertProps) {
  const { title, message, action } = getErrorInfo(error);

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        {title}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 hover:bg-destructive/20"
          >
            <XCircle className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>
        <div className="flex flex-wrap gap-2">
          {action === "api-key" && (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/profile">
                <Key className="h-4 w-4" />
                Check API Key
              </Link>
            </Button>
          )}
          {action === "retry" && onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
          {action === "quota" && (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Google Cloud Console
              </a>
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
