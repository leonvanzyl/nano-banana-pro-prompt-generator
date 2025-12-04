import { NextResponse } from "next/server";
import { eq, sql, desc } from "drizzle-orm";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { generatedImages, generations, user, imageLikes } from "@/lib/schema";
import type { AdminImage, AdminPaginatedResponse } from "@/lib/types/admin";

/**
 * GET /api/admin/images
 * List all generated images with user info and like counts
 * Query params:
 *   - page: number (default: 1)
 *   - pageSize: number (default: 20, max: 50)
 *   - userId: string (optional, filter by user)
 */
export async function GET(request: Request) {
  try {
    const session = await isAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)));
    const userId = searchParams.get("userId");

    const offset = (page - 1) * pageSize;

    // Build filter condition
    const filterCondition = userId ? eq(generations.userId, userId) : undefined;

    // Count total images
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(generatedImages)
      .leftJoin(generations, eq(generations.id, generatedImages.generationId))
      .where(filterCondition);
    const totalCount = countResult[0]?.count ?? 0;

    // Get images with user info
    const results = await db
      .select({
        id: generatedImages.id,
        imageUrl: generatedImages.imageUrl,
        isPublic: generatedImages.isPublic,
        createdAt: generatedImages.createdAt,
        prompt: generations.prompt,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(generatedImages)
      .leftJoin(generations, eq(generations.id, generatedImages.generationId))
      .leftJoin(user, eq(user.id, generations.userId))
      .where(filterCondition)
      .orderBy(desc(generatedImages.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get like counts for these images
    const imageIds = results.map((r) => r.id);

    const likeCounts = imageIds.length > 0
      ? await db
          .select({
            imageId: imageLikes.imageId,
            count: sql<number>`count(*)::int`,
          })
          .from(imageLikes)
          .where(sql`${imageLikes.imageId} IN ${imageIds}`)
          .groupBy(imageLikes.imageId)
      : [];

    const likeCountMap = new Map(likeCounts.map((l) => [l.imageId, l.count]));

    const items: AdminImage[] = results.map((r) => ({
      id: r.id,
      imageUrl: r.imageUrl,
      isPublic: r.isPublic,
      createdAt: r.createdAt,
      prompt: r.prompt!,
      likeCount: likeCountMap.get(r.id) || 0,
      user: {
        id: r.userId!,
        name: r.userName!,
        email: r.userEmail!,
        image: r.userImage,
      },
    }));

    const response: AdminPaginatedResponse<AdminImage> = {
      items,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
