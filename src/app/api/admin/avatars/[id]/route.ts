import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { avatars } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/admin/avatars/[id]
 * Delete an avatar by ID and its image from storage
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await isAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Get the avatar to delete its image
    const [avatar] = await db
      .select()
      .from(avatars)
      .where(eq(avatars.id, id))
      .limit(1);

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    // Delete the image from storage
    try {
      await deleteFile(avatar.imageUrl);
    } catch (storageError) {
      console.error("Error deleting avatar image:", storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete the avatar from database
    await db.delete(avatars).where(eq(avatars.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    );
  }
}
