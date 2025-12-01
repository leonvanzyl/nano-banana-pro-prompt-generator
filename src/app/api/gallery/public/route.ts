import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc, count, ilike, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, generatedImages, user } from "@/lib/schema";
import type { GalleryImage, GenerationSettings, PaginatedResponse } from "@/lib/types/generation";

/**
 * GET /api/gallery/public
 * List public images from all users with pagination and search
 */
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const currentUserId = session?.user?.id;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const offset = (page - 1) * pageSize;

    // Build where conditions
    const whereConditions = search
      ? and(
          eq(generatedImages.isPublic, true),
          ilike(generations.prompt, `%${search}%`)
        )
      : eq(generatedImages.isPublic, true);

    // Get total count of public images (with search filter)
    const totalQuery = db
      .select({ count: count() })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .where(whereConditions);

    const [totalResult] = await totalQuery;
    const total = totalResult?.count || 0;

    // Get public images with generation, user info, and like counts
    const publicImages = await db
      .select({
        image: generatedImages,
        generation: generations,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        likeCount: sql<number>`(
          SELECT COUNT(*) FROM image_likes
          WHERE image_likes.image_id = ${generatedImages.id}
        )::int`,
        isLikedByUser: currentUserId
          ? sql<boolean>`EXISTS(
              SELECT 1 FROM image_likes
              WHERE image_likes.image_id = ${generatedImages.id}
              AND image_likes.user_id = ${currentUserId}
            )`
          : sql<boolean>`false`,
      })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .innerJoin(user, eq(generations.userId, user.id))
      .where(whereConditions)
      .orderBy(desc(generatedImages.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Map to GalleryImage type
    const galleryImages: GalleryImage[] = publicImages.map((row) => ({
      id: row.image.id,
      generationId: row.image.generationId,
      imageUrl: row.image.imageUrl,
      isPublic: row.image.isPublic,
      createdAt: row.image.createdAt,
      generation: {
        prompt: row.generation.prompt,
        settings: row.generation.settings as GenerationSettings,
        createdAt: row.generation.createdAt,
      },
      user: {
        id: row.user.id,
        name: row.user.name,
        image: row.user.image,
      },
      likeCount: row.likeCount || 0,
      isLikedByUser: row.isLikedByUser || false,
    }));

    const response: PaginatedResponse<GalleryImage> = {
      items: galleryImages,
      total,
      page,
      pageSize,
      hasMore: offset + publicImages.length < total,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching public gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch public gallery" },
      { status: 500 }
    );
  }
}
