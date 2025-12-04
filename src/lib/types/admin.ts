// ==========================================
// Platform Admin - TypeScript Types
// ==========================================

export type PlatformRole = "admin" | null;

// Admin User with counts
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  platformRole: PlatformRole;
  createdAt: Date;
  avatarCount: number;
  imageCount: number;
}

// Admin Avatar with owner info
export interface AdminAvatar {
  id: string;
  name: string;
  imageUrl: string;
  description: string | null;
  avatarType: "human" | "object";
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

// Admin Image with owner info and stats
export interface AdminImage {
  id: string;
  imageUrl: string;
  isPublic: boolean;
  createdAt: Date;
  prompt: string;
  likeCount: number;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

// User search result for autocomplete
export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

// Paginated response generic
export interface AdminPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
