// ==========================================
// Nano Banana Pro - TypeScript Types
// ==========================================

// Avatar Types
export type AvatarType = "human" | "object";

export interface Avatar {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  description: string | null;
  avatarType: AvatarType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAvatarInput {
  name: string;
  imageUrl: string;
  description?: string | undefined;
  avatarType: AvatarType;
}

export interface UpdateAvatarInput {
  name?: string | undefined;
  description?: string | undefined;
  avatarType?: AvatarType | undefined;
}

// Generation Settings
export type ImageResolution = "1K" | "2K" | "4K";
export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "21:9";
export type GenerationStatus = "pending" | "processing" | "completed" | "failed";

export interface GenerationSettings {
  resolution: ImageResolution;
  aspectRatio: AspectRatio;
  imageCount: 1 | 2 | 3 | 4;
}

export interface Generation {
  id: string;
  userId: string;
  prompt: string;
  settings: GenerationSettings;
  status: GenerationStatus;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeneratedImage {
  id: string;
  generationId: string;
  imageUrl: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface GenerationWithImages extends Generation {
  images: GeneratedImage[];
}

// Generation History for Multi-turn
export type HistoryRole = "user" | "assistant";

export interface GenerationHistoryEntry {
  id: string;
  generationId: string;
  role: HistoryRole;
  content: string;
  imageUrls: string[] | null;
  createdAt: Date;
}

// Preset Configuration
export interface SubjectConfig {
  id: string;
  avatarId?: string | undefined;
  avatarName?: string | undefined;
  avatarDescription?: string | undefined;
  avatarImageUrl?: string | undefined;
  pose?: string | undefined;
  action?: string | undefined;
  clothing?: string | undefined;
  hair?: string | undefined;
  makeup?: string | undefined;
  expression?: string | undefined;
  customDescription?: string | undefined;
}

export interface PresetConfig {
  location?: string;
  lighting?: string;
  camera?: string;
  style?: string;
  subjects: SubjectConfig[];
  customPrompt?: string;
}

export interface Preset {
  id: string;
  userId: string;
  name: string;
  config: PresetConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePresetInput {
  name: string;
  config: PresetConfig;
}

export interface UpdatePresetInput {
  name?: string;
  config?: PresetConfig;
}

// Template Types
export interface Template {
  id: string;
  name: string;
  description: string;
  promptFragment: string;
}

// Prompt Builder State
export interface PromptBuilderState {
  location: string;
  lighting: string;
  camera: string;
  style: string;
  subjects: SubjectConfig[];
  customPrompt: string;
}

// API Response Types
export interface ApiKeyStatus {
  hasKey: boolean;
  hint?: string;
}

export interface GenerateImageRequest {
  prompt: string;
  settings: GenerationSettings;
  referenceImages?: {
    avatarId: string;
    imageUrl: string;
    type: AvatarType;
  }[];
}

export interface RefineImageRequest {
  generationId: string;
  instruction: string;
}

// Gallery Types
export interface GalleryImage extends GeneratedImage {
  generation: {
    prompt: string;
    settings: GenerationSettings;
    createdAt: Date;
  };
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  likeCount: number;
  isLikedByUser: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Like Types
export interface ImageLike {
  id: string;
  imageId: string;
  userId: string;
  createdAt: Date;
}

// Top Contributor Types
export interface TopContributor {
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  totalImages: number;
  totalLikes: number;
}

// Public User Profile Types
export interface PublicUserProfile {
  id: string;
  name: string;
  image: string | null;
  createdAt: Date;
  stats: {
    totalPublicImages: number;
    totalLikesReceived: number;
  };
}
