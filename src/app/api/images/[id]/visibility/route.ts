import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generations, generatedImages } from "@/lib/schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/images/[id]/visibility
 * Toggle image visibility (public/private)
 */
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isPublic } = body;

    if (typeof isPublic !== "boolean") {
      return NextResponse.json(
        { error: "isPublic must be a boolean" },
        { status: 400 }
      );
    }

    // Get the image with its generation to verify ownership
    const [image] = await db
      .select({
        image: generatedImages,
        generation: generations,
      })
      .from(generatedImages)
      .innerJoin(generations, eq(generatedImages.generationId, generations.id))
      .where(eq(generatedImages.id, id))
      .limit(1);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Verify the user owns this image
    if (image.generation.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update visibility
    const result = await db
      .update(generatedImages)
      .set({ isPublic })
      .where(eq(generatedImages.id, id))
      .returning();

    const updated = result[0];
    if (!updated) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({
      id: updated.id,
      generationId: updated.generationId,
      imageUrl: updated.imageUrl,
      isPublic: updated.isPublic,
      createdAt: updated.createdAt,
    });
  } catch (error) {
    console.error("Error updating image visibility:", error);
    return NextResponse.json(
      { error: "Failed to update image visibility" },
      { status: 500 }
    );
  }
}
