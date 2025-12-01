import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, generatedImages } from "@/lib/schema";
import type { GenerationSettings, GenerationWithImages, PaginatedResponse } from "@/lib/types/generation";

/**
 * GET /api/generations
 * List user's generations with pagination
 */
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse pagination params
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)));
    const offset = (page - 1) * pageSize;

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(generations)
      .where(eq(generations.userId, session.user.id));

    const total = totalResult?.count || 0;

    // Get generations for this page
    const userGenerations = await db
      .select()
      .from(generations)
      .where(eq(generations.userId, session.user.id))
      .orderBy(desc(generations.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get all images for these generations
    const generationIds = userGenerations.map((g) => g.id);
    let images: typeof generatedImages.$inferSelect[] = [];

    if (generationIds.length > 0) {
      const { inArray } = await import("drizzle-orm");
      images = await db
        .select()
        .from(generatedImages)
        .where(inArray(generatedImages.generationId, generationIds));
    }

    // Map generations with their images
    const generationsWithImages: GenerationWithImages[] = userGenerations.map((gen) => ({
      id: gen.id,
      userId: gen.userId,
      prompt: gen.prompt,
      settings: gen.settings as GenerationSettings,
      status: gen.status as "pending" | "processing" | "completed" | "failed",
      errorMessage: gen.errorMessage,
      createdAt: gen.createdAt,
      updatedAt: gen.updatedAt,
      images: images
        .filter((img) => img.generationId === gen.id)
        .map((img) => ({
          id: img.id,
          generationId: img.generationId,
          imageUrl: img.imageUrl,
          isPublic: img.isPublic,
          createdAt: img.createdAt,
        })),
    }));

    const response: PaginatedResponse<GenerationWithImages> = {
      items: generationsWithImages,
      total,
      page,
      pageSize,
      hasMore: offset + userGenerations.length < total,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching generations:", error);
    return NextResponse.json(
      { error: "Failed to fetch generations" },
      { status: 500 }
    );
  }
}
