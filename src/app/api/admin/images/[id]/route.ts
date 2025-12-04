import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { generatedImages } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/admin/images/[id]
 * Delete an image by ID and its file from storage
 * Related likes will be cascade deleted
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await isAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Get the image to delete its file
    const [image] = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.id, id))
      .limit(1);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete the file from storage
    try {
      await deleteFile(image.imageUrl);
    } catch (storageError) {
      console.error("Error deleting image file:", storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete the image from database (cascade will handle likes)
    await db.delete(generatedImages).where(eq(generatedImages.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
