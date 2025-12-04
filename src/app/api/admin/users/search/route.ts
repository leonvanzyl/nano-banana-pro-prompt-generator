import { NextResponse } from "next/server";
import { eq, ilike, or, desc } from "drizzle-orm";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import type { UserSearchResult } from "@/lib/types/admin";

/**
 * GET /api/admin/users/search
 * Search users for autocomplete dropdown or lookup by ID
 * Query params:
 *   - q: string (search query for name or email)
 *   - id: string (direct user ID lookup)
 *   - limit: number (default: 10, max: 20)
 */
export async function GET(request: Request) {
  try {
    const session = await isAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const userId = searchParams.get("id");
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    // Direct ID lookup
    if (userId) {
      const users = await db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      const results: UserSearchResult[] = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
      }));

      return NextResponse.json({ users: results });
    }

    // Search by name or email
    if (!query.trim()) {
      return NextResponse.json({ users: [] });
    }

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      })
      .from(user)
      .where(
        or(
          ilike(user.name, `%${query}%`),
          ilike(user.email, `%${query}%`)
        )
      )
      .orderBy(desc(user.createdAt))
      .limit(limit);

    const results: UserSearchResult[] = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
    }));

    return NextResponse.json({ users: results });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
