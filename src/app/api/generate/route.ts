import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateWithUserKey, type ReferenceImage } from "@/lib/gemini";
import { generations, generatedImages, generationHistory, avatars } from "@/lib/schema";
import { upload } from "@/lib/storage";
import type {
  GenerationSettings,
  AvatarType,
  GenerationWithImages,
} from "@/lib/types/generation";

// Maximum duration for Vercel Hobby plan is 60 seconds
export const maxDuration = 60;

interface GenerateRequestBody {
  prompt: string;
  settings: GenerationSettings;
  referenceImages?: {
    avatarId: string;
    type: AvatarType;
  }[];
}

/**
 * POST /api/generate
 * Start a new image generation
 */
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as GenerateRequestBody;
    const { prompt, settings, referenceImages = [] } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!settings || !settings.resolution || !settings.aspectRatio) {
      return NextResponse.json(
        { error: "Settings with resolution and aspectRatio are required" },
        { status: 400 }
      );
    }

    // Validate settings
    const validResolutions = ["1K", "2K", "4K"];
    const validAspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4", "21:9"];
    const validImageCounts = [1, 2, 3, 4];

    if (!validResolutions.includes(settings.resolution)) {
      return NextResponse.json(
        { error: "Invalid resolution" },
        { status: 400 }
      );
    }

    if (!validAspectRatios.includes(settings.aspectRatio)) {
      return NextResponse.json(
        { error: "Invalid aspect ratio" },
        { status: 400 }
      );
    }

    if (settings.imageCount && !validImageCounts.includes(settings.imageCount)) {
      return NextResponse.json(
        { error: "Invalid image count. Must be 1-4" },
        { status: 400 }
      );
    }

    // Get avatar details for reference images
    let avatarDetails: ReferenceImage[] = [];
    if (referenceImages.length > 0) {
      const avatarIds = referenceImages.map((r) => r.avatarId);
      const avatarRecords = await db
        .select()
        .from(avatars)
        .where(inArray(avatars.id, avatarIds));

      // Map avatar records to reference images
      avatarDetails = referenceImages
        .map((ref) => {
          const avatar = avatarRecords.find((a) => a.id === ref.avatarId);
          if (!avatar) return null;
          return {
            imageUrl: avatar.imageUrl,
            type: avatar.avatarType as AvatarType,
            name: avatar.name,
          } as ReferenceImage;
        })
        .filter((a): a is ReferenceImage => a !== null);
    }

    // Create the generation record with 'processing' status
    const [generation] = await db
      .insert(generations)
      .values({
        userId: session.user.id,
        prompt: prompt.trim(),
        settings: settings,
        status: "processing",
      })
      .returning();

    if (!generation) {
      return NextResponse.json(
        { error: "Failed to create generation record" },
        { status: 500 }
      );
    }

    // Store the initial user message in history
    await db.insert(generationHistory).values({
      generationId: generation.id,
      role: "user",
      content: prompt.trim(),
      imageUrls: avatarDetails.map((a) => a.imageUrl),
    });

    // Generate images using Gemini
    const result = await generateWithUserKey(session.user.id, prompt.trim(), {
      resolution: settings.resolution,
      aspectRatio: settings.aspectRatio,
      imageCount: settings.imageCount || 1,
      referenceImages: avatarDetails,
    });

    if (!result.success || result.images.length === 0) {
      // Update generation status to failed
      await db
        .update(generations)
        .set({
          status: "failed",
          errorMessage: result.error || "No images generated",
        })
        .where(eq(generations.id, generation.id));

      return NextResponse.json(
        {
          error: result.error || "No images generated",
          generation: {
            id: generation.id,
            status: "failed",
            errorMessage: result.error,
          },
        },
        { status: 400 }
      );
    }

    // Save generated images to storage and database
    const savedImages = [];
    for (let i = 0; i < result.images.length; i++) {
      const img = result.images[i];
      if (!img) continue;

      // Convert base64 to buffer
      const buffer = Buffer.from(img.base64, "base64");
      const extension = img.mimeType.split("/")[1] || "png";
      const timestamp = Date.now();
      const filename = `gen-${generation.id}-${i}-${timestamp}.${extension}`;

      // Upload to storage
      const uploadResult = await upload(buffer, filename, "generations");

      // Save to database
      const [savedImage] = await db
        .insert(generatedImages)
        .values({
          generationId: generation.id,
          imageUrl: uploadResult.url,
          isPublic: false,
        })
        .returning();

      if (savedImage) {
        savedImages.push(savedImage);
      }
    }

    // Store the assistant response in history
    await db.insert(generationHistory).values({
      generationId: generation.id,
      role: "assistant",
      content: result.text || "Generated images successfully",
      imageUrls: savedImages.map((img) => img.imageUrl),
    });

    // Update generation status to completed
    await db
      .update(generations)
      .set({ status: "completed" })
      .where(eq(generations.id, generation.id));

    // Fetch the updated generation with images
    const [updatedGeneration] = await db
      .select()
      .from(generations)
      .where(eq(generations.id, generation.id));

    const generationWithImages: GenerationWithImages = {
      id: updatedGeneration!.id,
      userId: updatedGeneration!.userId,
      prompt: updatedGeneration!.prompt,
      settings: updatedGeneration!.settings as GenerationSettings,
      status: "completed",
      errorMessage: null,
      createdAt: updatedGeneration!.createdAt,
      updatedAt: updatedGeneration!.updatedAt,
      images: savedImages.map((img) => ({
        id: img.id,
        generationId: img.generationId,
        imageUrl: img.imageUrl,
        isPublic: img.isPublic,
        createdAt: img.createdAt,
      })),
    };

    return NextResponse.json({ generation: generationWithImages }, { status: 201 });
  } catch (error) {
    console.error("Error generating images:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
