"use client";

import { Wand2 } from "lucide-react";
import { LoadPresetDropdown } from "@/components/presets/load-preset-dropdown";
import { SavePresetModal } from "@/components/presets/save-preset-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { GenerationSettings, Preset, PresetConfig } from "@/lib/types/generation";

interface PreviewPanelProps {
  assembledPrompt: string;
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasApiKey: boolean;
  // Preset props
  currentConfig: PresetConfig;
  presets: Preset[];
  presetsLoading: boolean;
  onSavePreset: (name: string, config: PresetConfig) => Promise<boolean>;
  onLoadPreset: (preset: Preset) => void;
  onDeletePreset: (id: string) => Promise<boolean>;
}

export function PreviewPanel({
  assembledPrompt,
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
  hasApiKey,
  currentConfig,
  presets,
  presetsLoading,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: PreviewPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-lg">Preview & Generate</h2>
            <p className="text-sm text-muted-foreground">
              Review your prompt and generate images
            </p>
          </div>
        </div>
        {/* Preset Actions */}
        <div className="flex items-center gap-2 mt-3">
          <LoadPresetDropdown
            presets={presets}
            onLoad={onLoadPreset}
            onDelete={onDeletePreset}
            isLoading={presetsLoading}
            disabled={isGenerating}
          />
          <SavePresetModal
            config={currentConfig}
            onSave={onSavePreset}
            disabled={isGenerating || !assembledPrompt}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Prompt Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Generated Prompt</Label>
            <div className="p-4 bg-muted/50 rounded-lg min-h-[100px]">
              {assembledPrompt ? (
                <p className="text-sm whitespace-pre-wrap">{assembledPrompt}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Your prompt will appear here as you build it...
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Generation Settings
            </h3>

            {/* Number of Images */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Number of Images</Label>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map((num) => (
                  <Button
                    key={num}
                    variant={settings.imageCount === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSettingsChange({ imageCount: num })}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Resolution</Label>
              <Select
                value={settings.resolution}
                onValueChange={(value) =>
                  onSettingsChange({ resolution: value as GenerationSettings["resolution"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1K">1K (1024px)</SelectItem>
                  <SelectItem value="2K">2K (2048px)</SelectItem>
                  <SelectItem value="4K">4K (4096px)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Aspect Ratio</Label>
              <Select
                value={settings.aspectRatio}
                onValueChange={(value) =>
                  onSettingsChange({ aspectRatio: value as GenerationSettings["aspectRatio"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="3:4">3:4 (Portrait Standard)</SelectItem>
                  <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Generate Button */}
      <div className="p-4 border-t">
        {!hasApiKey ? (
          <div className="text-center py-2">
            <p className="text-sm text-muted-foreground mb-2">
              Please add your Google API key in your profile to generate images.
            </p>
            <Button variant="outline" asChild>
              <a href="/profile">Go to Profile</a>
            </Button>
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={onGenerate}
            disabled={isGenerating || !assembledPrompt}
          >
            <Wand2 className="h-5 w-5 mr-2" />
            {isGenerating ? "Generating..." : "Generate Images"}
          </Button>
        )}
      </div>
    </div>
  );
}
