"use client";

import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RefineInputProps {
  onRefine: (instruction: string) => Promise<void>;
  isRefining: boolean;
  disabled?: boolean;
}

const REFINEMENT_SUGGESTIONS = [
  "Make the lighting more dramatic",
  "Add more vibrant colors",
  "Make the background more detailed",
  "Change the expression to be happier",
  "Add more depth and shadows",
  "Make the composition more dynamic",
  "Increase the contrast",
  "Add a warm color tone",
];

export function RefineInput({ onRefine, isRefining, disabled = false }: RefineInputProps) {
  const [instruction, setInstruction] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isRefining || disabled) return;

    await onRefine(instruction.trim());
    setInstruction("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInstruction(suggestion);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="refine-instruction" className="text-sm font-medium">
          Refine Your Image
        </Label>
        <p className="text-xs text-muted-foreground mt-1">
          Describe how you would like to modify the generated image
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          id="refine-instruction"
          placeholder="e.g., Make the lighting more dramatic and add a sunset glow..."
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          disabled={isRefining || disabled}
          className="min-h-[80px] resize-none"
        />

        <div className="flex flex-wrap gap-2">
          {REFINEMENT_SUGGESTIONS.slice(0, 4).map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isRefining || disabled}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>

        <Button
          type="submit"
          disabled={!instruction.trim() || isRefining || disabled}
          className="w-full"
        >
          {isRefining ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refining...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Refine Image
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
