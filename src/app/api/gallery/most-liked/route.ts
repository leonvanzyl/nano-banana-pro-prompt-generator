import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, generatedImages, user } from "@/lib/schema";
import type { GalleryImage, GenerationSettings } from "@/lib/types/generation";

/**
 * GET /api/gallery/most-liked
 * Get the most liked public images
 */
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const currentUserId = session?.user?.id;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    // Get most liked public images
    const mostLikedImages = await db
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
      .where(eq(generatedImages.isPublic, true))
      .orderBy(
        desc(sql`(
          SELECT COUNT(*) FROM image_likes
          WHERE image_likes.image_id = ${generatedImages.id}
        )`),
        desc(generatedImages.createdAt)
      )
      .limit(limit);

    // Map to GalleryImage type
    const galleryImages: GalleryImage[] = mostLikedImages.map((row) => ({
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

    return NextResponse.json({ images: galleryImages });
  } catch (error) {
    console.error("Error fetching most liked images:", error);
    return NextResponse.json(
      { error: "Failed to fetch most liked images" },
      { status: 500 }
    );
  }
}
