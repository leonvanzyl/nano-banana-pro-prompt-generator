import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { presets } from "@/lib/schema";
import type { Preset, UpdatePresetInput, PresetConfig } from "@/lib/types/generation";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/presets/[id]
 * Get a single preset
 */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [preset] = await db
      .select()
      .from(presets)
      .where(
        and(
          eq(presets.id, id),
          eq(presets.userId, session.user.id)
        )
      );

    if (!preset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    const formattedPreset: Preset = {
      id: preset.id,
      userId: preset.userId,
      name: preset.name,
      config: preset.config as PresetConfig,
      createdAt: preset.createdAt,
      updatedAt: preset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset });
  } catch (error) {
    console.error("Error fetching preset:", error);
    return NextResponse.json(
      { error: "Failed to fetch preset" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/presets/[id]
 * Update a preset
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as UpdatePresetInput;
    const { name, config } = body;

    // Verify the preset exists and belongs to the user
    const [existingPreset] = await db
      .select()
      .from(presets)
      .where(
        and(
          eq(presets.id, id),
          eq(presets.userId, session.user.id)
        )
      );

    if (!existingPreset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    // Build update object
    const updates: Partial<{ name: string; config: PresetConfig }> = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (config !== undefined) {
      if (typeof config !== "object" || !Array.isArray(config.subjects)) {
        return NextResponse.json(
          { error: "Config must be an object with a subjects array" },
          { status: 400 }
        );
      }
      updates.config = config;
    }

    // Check if there's anything to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Update the preset
    const [updatedPreset] = await db
      .update(presets)
      .set(updates)
      .where(eq(presets.id, id))
      .returning();

    if (!updatedPreset) {
      return NextResponse.json(
        { error: "Failed to update preset" },
        { status: 500 }
      );
    }

    const formattedPreset: Preset = {
      id: updatedPreset.id,
      userId: updatedPreset.userId,
      name: updatedPreset.name,
      config: updatedPreset.config as PresetConfig,
      createdAt: updatedPreset.createdAt,
      updatedAt: updatedPreset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset });
  } catch (error) {
    console.error("Error updating preset:", error);
    return NextResponse.json(
      { error: "Failed to update preset" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/presets/[id]
 * Delete a preset
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the preset exists and belongs to the user
    const [existingPreset] = await db
      .select()
      .from(presets)
      .where(
        and(
          eq(presets.id, id),
          eq(presets.userId, session.user.id)
        )
      );

    if (!existingPreset) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 });
    }

    // Delete the preset
    await db.delete(presets).where(eq(presets.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting preset:", error);
    return NextResponse.json(
      { error: "Failed to delete preset" },
      { status: 500 }
    );
  }
}
