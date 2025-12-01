import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateWithUserKey, type ReferenceImage } from "@/lib/gemini";
import { generations, generatedImages, generationHistory } from "@/lib/schema";
import { upload } from "@/lib/storage";
import type {
  GenerationSettings,
  GenerationWithImages,
  GenerationHistoryEntry,
} from "@/lib/types/generation";

// Maximum duration for Vercel Hobby plan is 60 seconds
export const maxDuration = 60;

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface RefineRequestBody {
  instruction: string;
  selectedImageId?: string;
}

/**
 * POST /api/generate/[id]/refine
 * Refine an existing generation with additional instructions
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as RefineRequestBody;
    const { instruction, selectedImageId } = body;

    // Validate instruction
    if (!instruction || typeof instruction !== "string" || instruction.trim().length === 0) {
      return NextResponse.json(
        { error: "Instruction is required" },
        { status: 400 }
      );
    }

    // Get the generation and verify ownership
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

    if (generation.status !== "completed") {
      return NextResponse.json(
        { error: "Can only refine completed generations" },
        { status: 400 }
      );
    }

    // Get existing images for this generation
    const existingImages = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.generationId, id));

    if (existingImages.length === 0) {
      return NextResponse.json(
        { error: "No images to refine" },
        { status: 400 }
      );
    }

    // Select the image to use as reference
    let referenceImage = existingImages[0];
    if (selectedImageId) {
      const selected = existingImages.find((img) => img.id === selectedImageId);
      if (selected) {
        referenceImage = selected;
      }
    }

    if (!referenceImage) {
      return NextResponse.json(
        { error: "Reference image not found" },
        { status: 400 }
      );
    }

    // Get the generation history for multi-turn context (text only, no images)
    // Note: We don't pass imageUrls in history because Gemini 3's thinking mode
    // requires thought_signature for images from previous turns, which we don't store
    const history = await db
      .select()
      .from(generationHistory)
      .where(eq(generationHistory.generationId, id))
      .orderBy(asc(generationHistory.createdAt));

    // Build history entries for the API (text only to avoid thought_signature requirement)
    const historyEntries: { role: "user" | "assistant"; content: string; imageUrls: string[] }[] =
      history.map((h) => ({
        role: h.role as "user" | "assistant",
        content: h.content,
        imageUrls: [], // Don't include images in history to avoid thought_signature requirement
      }));

    // Update generation status to processing
    await db
      .update(generations)
      .set({ status: "processing" })
      .where(eq(generations.id, id));

    // Store the new user instruction in history
    await db.insert(generationHistory).values({
      generationId: id,
      role: "user",
      content: instruction.trim(),
      imageUrls: [referenceImage.imageUrl],
    });

    // Parse the settings
    const settings = generation.settings as GenerationSettings;

    // Create reference image for refinement
    const referenceImages: ReferenceImage[] = [
      {
        imageUrl: referenceImage.imageUrl,
        type: "human",
        name: "previous generation",
      },
    ];

    // Generate refined image(s) with history context
    const result = await generateWithUserKey(
      session.user.id,
      instruction.trim(),
      {
        resolution: settings.resolution,
        aspectRatio: settings.aspectRatio,
        imageCount: settings.imageCount || 1,
        referenceImages,
        history: historyEntries,
      }
    );

    if (!result.success || result.images.length === 0) {
      // Update generation status back to completed (refinement failed but original is still valid)
      await db
        .update(generations)
        .set({ status: "completed" })
        .where(eq(generations.id, id));

      return NextResponse.json(
        {
          error: result.error || "Failed to generate refined images",
        },
        { status: 400 }
      );
    }

    // Save new images to storage and database
    const savedImages = [];
    for (let i = 0; i < result.images.length; i++) {
      const img = result.images[i];
      if (!img) continue;

      // Convert base64 to buffer
      const buffer = Buffer.from(img.base64, "base64");
      const extension = img.mimeType.split("/")[1] || "png";
      const timestamp = Date.now();
      const filename = `gen-${id}-refine-${i}-${timestamp}.${extension}`;

      // Upload to storage
      const uploadResult = await upload(buffer, filename, "generations");

      // Save to database
      const [savedImage] = await db
        .insert(generatedImages)
        .values({
          generationId: id,
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
      generationId: id,
      role: "assistant",
      content: result.text || "Generated refined images successfully",
      imageUrls: savedImages.map((img) => img.imageUrl),
    });

    // Update generation status back to completed and update the prompt
    const newPrompt = `${generation.prompt} | Refinement: ${instruction.trim()}`;
    await db
      .update(generations)
      .set({
        status: "completed",
        prompt: newPrompt,
      })
      .where(eq(generations.id, id));

    // Fetch all images for this generation (including new ones)
    const allImages = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.generationId, id));

    // Fetch updated history
    const updatedHistory = await db
      .select()
      .from(generationHistory)
      .where(eq(generationHistory.generationId, id))
      .orderBy(asc(generationHistory.createdAt));

    // Build response
    const generationWithImages: GenerationWithImages = {
      id: generation.id,
      userId: generation.userId,
      prompt: newPrompt,
      settings: settings,
      status: "completed",
      errorMessage: null,
      createdAt: generation.createdAt,
      updatedAt: new Date(),
      images: allImages.map((img) => ({
        id: img.id,
        generationId: img.generationId,
        imageUrl: img.imageUrl,
        isPublic: img.isPublic,
        createdAt: img.createdAt,
      })),
    };

    const historyResponse: GenerationHistoryEntry[] = updatedHistory.map((h) => ({
      id: h.id,
      generationId: h.generationId,
      role: h.role as "user" | "assistant",
      content: h.content,
      imageUrls: h.imageUrls as string[] | null,
      createdAt: h.createdAt,
    }));

    return NextResponse.json({
      generation: generationWithImages,
      history: historyResponse,
    });
  } catch (error) {
    console.error("Error refining generation:", error);
    return NextResponse.json(
      { error: "Failed to refine generation" },
      { status: 500 }
    );
  }
}
