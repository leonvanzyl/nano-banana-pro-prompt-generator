import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, generatedImages, generationHistory } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";
import type { GenerationSettings, GenerationWithImages, GenerationHistoryEntry } from "@/lib/types/generation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/generations/[id]
 * Get a single generation with its images and history
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the generation
    const [generation] = await db
      .select()
      .from(generations)
      .where(
        and(
          eq(generations.id, id),
          eq(generations.userId, session.user.id)
        )
      );

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    // Get images for this generation
    const images = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.generationId, id));

    // Get history for this generation
    const history = await db
      .select()
      .from(generationHistory)
      .where(eq(generationHistory.generationId, id))
      .orderBy(generationHistory.createdAt);

    const generationWithImages: GenerationWithImages = {
      id: generation.id,
      userId: generation.userId,
      prompt: generation.prompt,
      settings: generation.settings as GenerationSettings,
      status: generation.status as "pending" | "processing" | "completed" | "failed",
      errorMessage: generation.errorMessage,
      createdAt: generation.createdAt,
      updatedAt: generation.updatedAt,
      images: images.map((img) => ({
        id: img.id,
        generationId: img.generationId,
        imageUrl: img.imageUrl,
        isPublic: img.isPublic,
        createdAt: img.createdAt,
      })),
    };

    const historyEntries: GenerationHistoryEntry[] = history.map((h) => ({
      id: h.id,
      generationId: h.generationId,
      role: h.role as "user" | "assistant",
      content: h.content,
      imageUrls: h.imageUrls as string[] | null,
      createdAt: h.createdAt,
    }));

    return NextResponse.json({
      generation: generationWithImages,
      history: historyEntries,
    });
  } catch (error) {
    console.error("Error fetching generation:", error);
    return NextResponse.json(
      { error: "Failed to fetch generation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/generations/[id]
 * Delete a generation and all its images
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the generation belongs to the user
    const [generation] = await db
      .select()
      .from(generations)
      .where(
        and(
          eq(generations.id, id),
          eq(generations.userId, session.user.id)
        )
      );

    if (!generation) {
      return NextResponse.json({ error: "Generation not found" }, { status: 404 });
    }

    // Get all images to delete from storage
    const images = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.generationId, id));

    // Delete images from storage
    for (const image of images) {
      try {
        await deleteFile(image.imageUrl);
      } catch (err) {
        console.error(`Failed to delete image from storage: ${image.imageUrl}`, err);
        // Continue with deletion even if storage deletion fails
      }
    }

    // Delete the generation (cascades to images and history)
    await db.delete(generations).where(eq(generations.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting generation:", error);
    return NextResponse.json(
      { error: "Failed to delete generation" },
      { status: 500 }
    );
  }
}
