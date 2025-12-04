import { NextResponse } from "next/server";
import { eq, sql, ilike, or, desc } from "drizzle-orm";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { user, avatars, generatedImages, generations } from "@/lib/schema";
import type { AdminUser, AdminPaginatedResponse } from "@/lib/types/admin";

/**
 * GET /api/admin/users
 * List all users with avatar and image counts
 * Query params:
 *   - page: number (default: 1)
 *   - pageSize: number (default: 20, max: 50)
 *   - search: string (optional, searches name and email)
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
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * pageSize;

    // Build base query with search filter
    const searchCondition = search
      ? or(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`)
        )
      : undefined;

    // Count total users
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
      .where(searchCondition);
    const totalCount = countResult[0]?.count ?? 0;

    // Get users with avatar and image counts
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        platformRole: user.platformRole,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(searchCondition)
      .orderBy(desc(user.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get avatar counts for these users
    const userIds = users.map((u) => u.id);

    const avatarCounts = userIds.length > 0
      ? await db
          .select({
            userId: avatars.userId,
            count: sql<number>`count(*)::int`,
          })
          .from(avatars)
          .where(sql`${avatars.userId} IN ${userIds}`)
          .groupBy(avatars.userId)
      : [];

    // Get image counts for these users (through generations)
    const imageCounts = userIds.length > 0
      ? await db
          .select({
            userId: generations.userId,
            count: sql<number>`count(${generatedImages.id})::int`,
          })
          .from(generations)
          .leftJoin(generatedImages, eq(generatedImages.generationId, generations.id))
          .where(sql`${generations.userId} IN ${userIds}`)
          .groupBy(generations.userId)
      : [];

    // Create lookup maps
    const avatarCountMap = new Map(avatarCounts.map((a) => [a.userId, a.count]));
    const imageCountMap = new Map(imageCounts.map((i) => [i.userId, i.count]));

    // Combine data
    const items: AdminUser[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      platformRole: u.platformRole as "admin" | null,
      createdAt: u.createdAt,
      avatarCount: avatarCountMap.get(u.id) || 0,
      imageCount: imageCountMap.get(u.id) || 0,
    }));

    const response: AdminPaginatedResponse<AdminUser> = {
      items,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
