import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc, count, sql, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, generatedImages, user } from "@/lib/schema";
import type { GalleryImage, GenerationSettings, PaginatedResponse, PublicUserProfile } from "@/lib/types/generation";

/**
 * GET /api/gallery/user/[userId]
 * Get a user's public images and profile
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const currentUserId = session?.user?.id;
    const { userId } = await params;

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));
    const offset = (page - 1) * pageSize;

    // Get user info
    const [targetUser] = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user stats
    const [statsResult] = await db
      .select({
        totalPublicImages: sql<number>`(
          SELECT COUNT(*) FROM generated_images gi
          INNER JOIN generations g ON g.id = gi.generation_id
          WHERE g.user_id = ${userId} AND gi.is_public = true
        )::int`,
        totalLikesReceived: sql<number>`(
          SELECT COUNT(*) FROM image_likes il
          INNER JOIN generated_images gi ON gi.id = il.image_id
          INNER JOIN generations g ON g.id = gi.generation_id
          WHERE g.user_id = ${userId} AND gi.is_public = true
        )::int`,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const userProfile: PublicUserProfile = {
      id: targetUser.id,
      name: targetUser.name,
      image: targetUser.image,
      createdAt: targetUser.createdAt,
      stats: {
        totalPublicImages: statsResult?.totalPublicImages || 0,
        totalLikesReceived: statsResult?.totalLikesReceived || 0,
      },
    };

    // Get total count of user's public images
    const [totalResult] = await db
      .select({ count: count() })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .where(
        and(
          eq(generatedImages.isPublic, true),
          eq(generations.userId, userId)
        )
      );

    const total = totalResult?.count || 0;

    // Get user's public images with like counts
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
      .where(
        and(
          eq(generatedImages.isPublic, true),
          eq(generations.userId, userId)
        )
      )
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

    const images: PaginatedResponse<GalleryImage> = {
      items: galleryImages,
      total,
      page,
      pageSize,
      hasMore: offset + publicImages.length < total,
    };

    return NextResponse.json({
      user: userProfile,
      images,
    });
  } catch (error) {
    console.error("Error fetching user gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch user gallery" },
      { status: 500 }
    );
  }
}
