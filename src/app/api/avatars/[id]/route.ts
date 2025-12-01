import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { avatars } from "@/lib/schema";
import { deleteFile } from "@/lib/storage";
import type { Avatar, AvatarType } from "@/lib/types/generation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/avatars/[id]
 * Get a single avatar by ID
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [avatar] = await db
      .select()
      .from(avatars)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)))
      .limit(1);

    if (!avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    return NextResponse.json({ avatar: avatar as Avatar });
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return NextResponse.json(
      { error: "Failed to fetch avatar" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/avatars/[id]
 * Update an avatar's metadata (name, description, type)
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, avatarType } = body as {
      name?: string;
      description?: string;
      avatarType?: AvatarType;
    };

    // Check if avatar exists and belongs to user
    const [existingAvatar] = await db
      .select()
      .from(avatars)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)))
      .limit(1);

    if (!existingAvatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
    }

    // Build update object
    const updateData: Partial<typeof avatars.$inferInsert> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name cannot be empty" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (avatarType !== undefined) {
      if (!["human", "object"].includes(avatarType)) {
        return NextResponse.json(
          { error: "Avatar type must be 'human' or 'object'" },
          { status: 400 }
        );
      }
      updateData.avatarType = avatarType;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update the avatar
    const [updatedAvatar] = await db
      .update(avatars)
      .set(updateData)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)))
      .returning();

    return NextResponse.json({ avatar: updatedAvatar as Avatar });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/avatars/[id]
 * Delete an avatar and its associated image
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the avatar to delete its image
    const [avatar] = await db
      .select()
      .from(avatars)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)))
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
    await db
      .delete(avatars)
      .where(and(eq(avatars.id, id), eq(avatars.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return NextResponse.json(
      { error: "Failed to delete avatar" },
      { status: 500 }
    );
  }
}
