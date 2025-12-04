import { NextResponse } from "next/server";
import { eq, sql, desc } from "drizzle-orm";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { avatars, user } from "@/lib/schema";
import type { AdminAvatar, AdminPaginatedResponse } from "@/lib/types/admin";

/**
 * GET /api/admin/avatars
 * List all avatars with user info
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
    const filterCondition = userId ? eq(avatars.userId, userId) : undefined;

    // Count total avatars
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(avatars)
      .where(filterCondition);
    const totalCount = countResult[0]?.count ?? 0;

    // Get avatars with user info
    const results = await db
      .select({
        id: avatars.id,
        name: avatars.name,
        imageUrl: avatars.imageUrl,
        description: avatars.description,
        avatarType: avatars.avatarType,
        createdAt: avatars.createdAt,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userImage: user.image,
      })
      .from(avatars)
      .leftJoin(user, eq(user.id, avatars.userId))
      .where(filterCondition)
      .orderBy(desc(avatars.createdAt))
      .limit(pageSize)
      .offset(offset);

    const items: AdminAvatar[] = results.map((r) => ({
      id: r.id,
      name: r.name,
      imageUrl: r.imageUrl,
      description: r.description,
      avatarType: r.avatarType as "human" | "object",
      createdAt: r.createdAt,
      user: {
        id: r.userId!,
        name: r.userName!,
        email: r.userEmail!,
        image: r.userImage,
      },
    }));

    const response: AdminPaginatedResponse<AdminAvatar> = {
      items,
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching avatars:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatars" },
      { status: 500 }
    );
  }
}
