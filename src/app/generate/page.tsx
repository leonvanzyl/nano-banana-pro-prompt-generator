"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiKeyAlert } from "@/components/generate/api-key-alert";
import { GenerationErrorAlert } from "@/components/generate/generation-error-alert";
import { PreviewPanel } from "@/components/generate/preview/preview-panel";
import { PromptBuilderPanel } from "@/components/generate/prompt-builder/prompt-builder-panel";
import { ResultsPanel } from "@/components/generate/results/results-panel";
import { ThreeColumnLayout } from "@/components/generate/three-column-layout";
import { useApiKey } from "@/hooks/use-api-key";
import { useGeneration } from "@/hooks/use-generation";
import { usePresets } from "@/hooks/use-presets";
import { usePromptBuilder } from "@/hooks/use-prompt-builder";
import { useSession } from "@/lib/auth-client";
import type { Preset, PresetConfig } from "@/lib/types/generation";

export default function GeneratePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const { hasKey, isLoading: apiKeyLoading } = useApiKey();

  // Prompt builder state
  const {
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
    loadFromPreset,
  } = usePromptBuilder();

  // Presets state
  const {
    presets,
    isLoading: presetsLoading,
    createPreset,
    deletePreset,
  } = usePresets();

  // Generation state
  const {
    currentGeneration,
    isGenerating,
    isRefining,
    error,
    generate,
    refine,
    clearError,
  } = useGeneration();

  // Handle generation
  const handleGenerate = async () => {
    if (!assembledPrompt) {
      toast.error("Please build a prompt before generating");
      return;
    }

    if (!hasKey) {
      toast.error("Please add your Google API key in your profile");
      return;
    }

    // Get reference images from subjects with avatars
    const referenceImages = state.subjects
      .filter((s) => s.avatarId)
      .map((s) => ({
        avatarId: s.avatarId!,
        type: "human" as const, // We'll need to get the actual type from the avatar
      }));

    const generateInput = {
      prompt: assembledPrompt,
      settings,
      ...(referenceImages.length > 0 && { referenceImages }),
    };
    const result = await generate(generateInput);

    if (result) {
      toast.success("Images generated successfully!");
    }
  };

  // Handle refinement
  const handleRefine = async (instruction: string, selectedImageId?: string) => {
    if (!currentGeneration) return;

    const refineInput = {
      generationId: currentGeneration.id,
      instruction,
      ...(selectedImageId && { selectedImageId }),
    };
    const result = await refine(refineInput);

    if (result) {
      toast.success("Refinement complete!");
    }
  };

  // Preset handlers
  const handleSavePreset = async (name: string, config: PresetConfig): Promise<boolean> => {
    const success = await createPreset(name, config);
    if (success) {
      toast.success(`Preset "${name}" saved successfully!`);
    } else {
      toast.error("Failed to save preset");
    }
    return success;
  };

  const handleLoadPreset = (preset: Preset) => {
    // Convert PresetConfig to PromptBuilderState (fill in defaults for optional fields)
    loadFromPreset({
      location: preset.config.location ?? "",
      lighting: preset.config.lighting ?? "",
      camera: preset.config.camera ?? "",
      style: preset.config.style ?? "",
      subjects: preset.config.subjects,
      customPrompt: preset.config.customPrompt ?? "",
    });
    toast.success(`Loaded preset "${preset.name}"`);
  };

  const handleDeletePreset = async (id: string): Promise<boolean> => {
    const preset = presets.find((p) => p.id === id);
    const success = await deletePreset(id);
    if (success) {
      toast.success(`Preset "${preset?.name}" deleted`);
    } else {
      toast.error("Failed to delete preset");
    }
    return success;
  };

  // Get current config for preset saving
  const currentConfig: PresetConfig = {
    ...(state.location && { location: state.location }),
    ...(state.lighting && { lighting: state.lighting }),
    ...(state.camera && { camera: state.camera }),
    ...(state.style && { style: state.style }),
    subjects: state.subjects,
    ...(state.customPrompt && { customPrompt: state.customPrompt }),
  };

  // Get generated image URLs
  const generatedImages = currentGeneration?.images.map((img) => img.imageUrl) ?? [];

  // Auth check
  if (sessionPending || apiKeyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* API Key Alert - Show at top if no key */}
      {!hasKey && (
        <ApiKeyAlert
          title="API Key Required"
          message="You need to add your Google API key to generate images. Get your key from Google AI Studio."
        />
      )}

      {/* Error Alert */}
      {error && (
        <GenerationErrorAlert
          error={error}
          onDismiss={clearError}
          onRetry={handleGenerate}
        />
      )}

      <ThreeColumnLayout
        leftPanel={
          <PromptBuilderPanel
            location={state.location}
            lighting={state.lighting}
            camera={state.camera}
            style={state.style}
            customPrompt={state.customPrompt}
            onLocationChange={setLocation}
            onLightingChange={setLighting}
            onCameraChange={setCamera}
            onStyleChange={setStyle}
            onCustomPromptChange={setCustomPrompt}
            subjects={state.subjects}
            onAddSubject={addSubject}
            onRemoveSubject={removeSubject}
            onUpdateSubject={updateSubject}
            onLinkAvatarToSubject={linkAvatarToSubject}
          />
        }
        middlePanel={
          <PreviewPanel
            assembledPrompt={assembledPrompt}
            settings={settings}
            onSettingsChange={setSettings}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            hasApiKey={hasKey}
            currentConfig={currentConfig}
            presets={presets}
            presetsLoading={presetsLoading}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
          />
        }
        rightPanel={
          <ResultsPanel
            images={generatedImages}
            isGenerating={isGenerating}
            expectedCount={settings.imageCount}
            generationId={currentGeneration?.id}
            onRefine={handleRefine}
            isRefining={isRefining}
          />
        }
      />
    </div>
  );
}
