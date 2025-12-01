"use client";

import Link from "next/link";
import { AlertCircle, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ApiKeyAlertProps {
  variant?: "warning" | "error";
  title?: string;
  message?: string;
  showSettingsLink?: boolean;
}

export function ApiKeyAlert({
  variant = "warning",
  title = "API Key Required",
  message = "Please add your Google API key to generate images.",
  showSettingsLink = true,
}: ApiKeyAlertProps) {
  return (
    <Alert variant={variant === "error" ? "destructive" : "default"} className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>
        {showSettingsLink && (
          <Button asChild variant="outline" size="sm" className="w-fit gap-2">
            <Link href="/profile">
              <Key className="h-4 w-4" />
              Add API Key in Settings
            </Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
