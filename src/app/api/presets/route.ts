import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { presets } from "@/lib/schema";
import type { Preset, CreatePresetInput, PresetConfig } from "@/lib/types/generation";

/**
 * GET /api/presets
 * List all presets for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userPresets = await db
      .select()
      .from(presets)
      .where(eq(presets.userId, session.user.id))
      .orderBy(desc(presets.createdAt));

    const formattedPresets: Preset[] = userPresets.map((p) => ({
      id: p.id,
      userId: p.userId,
      name: p.name,
      config: p.config as PresetConfig,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({ presets: formattedPresets });
  } catch (error) {
    console.error("Error fetching presets:", error);
    return NextResponse.json(
      { error: "Failed to fetch presets" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/presets
 * Create a new preset
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreatePresetInput;
    const { name, config } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!config || typeof config !== "object") {
      return NextResponse.json(
        { error: "Config is required and must be an object" },
        { status: 400 }
      );
    }

    // Validate config structure
    if (!Array.isArray(config.subjects)) {
      return NextResponse.json(
        { error: "Config must contain a subjects array" },
        { status: 400 }
      );
    }

    // Create the preset
    const [newPreset] = await db
      .insert(presets)
      .values({
        userId: session.user.id,
        name: name.trim(),
        config: config,
      })
      .returning();

    if (!newPreset) {
      return NextResponse.json(
        { error: "Failed to create preset" },
        { status: 500 }
      );
    }

    const formattedPreset: Preset = {
      id: newPreset.id,
      userId: newPreset.userId,
      name: newPreset.name,
      config: newPreset.config as PresetConfig,
      createdAt: newPreset.createdAt,
      updatedAt: newPreset.updatedAt,
    };

    return NextResponse.json({ preset: formattedPreset }, { status: 201 });
  } catch (error) {
    console.error("Error creating preset:", error);
    return NextResponse.json(
      { error: "Failed to create preset" },
      { status: 500 }
    );
  }
}
