import { GoogleGenAI, Part, Content } from "@google/genai";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { userApiKeys } from "@/lib/schema";
import type {
  ImageResolution,
  AspectRatio,
  AvatarType,
} from "@/lib/types/generation";

/**
 * Simplified history entry for multi-turn conversations
 */
interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
  imageUrls?: string[] | null;
}

// Model for image generation
const MODEL_ID = "gemini-3-pro-image-preview";

/**
 * Get the user's decrypted API key from the database
 */
export async function getUserApiKey(userId: string): Promise<string | null> {
  try {
    const result = await db
      .select({
        encryptedKey: userApiKeys.encryptedKey,
        iv: userApiKeys.iv,
      })
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    if (!row) {
      return null;
    }

    const { encryptedKey, iv } = row;
    return decrypt(encryptedKey, iv);
  } catch (error) {
    console.error("Error fetching user API key:", error);
    return null;
  }
}

/**
 * Create a Gemini client with the user's API key
 */
function createGeminiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

/**
 * Convert a URL or base64 string to a Gemini-compatible image part
 */
async function createImagePart(
  imageSource: string,
  mimeType: string = "image/png"
): Promise<Part> {
  // If it's already base64 data
  if (imageSource.startsWith("data:")) {
    const matches = imageSource.match(/^data:([^;]+);base64,(.+)$/);
    if (matches && matches[1] && matches[2]) {
      return {
        inlineData: {
          mimeType: matches[1],
          data: matches[2],
        },
      };
    }
  }

  // If it's a local file path (starts with /), convert to full URL
  let fetchUrl = imageSource;
  if (imageSource.startsWith("/")) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    fetchUrl = `${appUrl}${imageSource}`;
  }

  // If it starts with http or is a local path (now converted to full URL), fetch it
  if (fetchUrl.startsWith("http")) {
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const contentType = response.headers.get("content-type") || mimeType;

      return {
        inlineData: {
          mimeType: contentType,
          data: base64,
        },
      };
    } catch (error) {
      console.error("Error fetching image:", error);
      throw new Error(`Failed to fetch image from URL: ${fetchUrl}`);
    }
  }

  // Fallback: treat as raw base64 data
  return {
    inlineData: {
      mimeType,
      data: imageSource,
    },
  };
}

/**
 * Reference image for generation
 */
export interface ReferenceImage {
  imageUrl: string;
  type: AvatarType;
  name?: string;
}

/**
 * Result from image generation
 */
export interface GenerationResult {
  success: boolean;
  images: {
    base64: string;
    mimeType: string;
  }[];
  text?: string;
  error?: string;
}

/**
 * Build the prompt with reference image context
 */
function buildPromptWithReferences(
  prompt: string,
  referenceImages: ReferenceImage[]
): string {
  if (referenceImages.length === 0) {
    return prompt;
  }

  const humanRefs = referenceImages.filter((r) => r.type === "human");
  const objectRefs = referenceImages.filter((r) => r.type === "object");

  let enhancedPrompt = prompt;

  if (humanRefs.length > 0) {
    const humanNames = humanRefs
      .map((r) => r.name || "the person")
      .join(", ");
    enhancedPrompt = `Using the reference images of ${humanNames} for character consistency, ${enhancedPrompt}`;
  }

  if (objectRefs.length > 0) {
    const objectNames = objectRefs
      .map((r) => r.name || "the object")
      .join(", ");
    enhancedPrompt += ` Include ${objectNames} as shown in the reference images.`;
  }

  return enhancedPrompt;
}

/**
 * Extract images and text from Gemini response
 */
function extractFromResponse(
  response: Awaited<ReturnType<GoogleGenAI["models"]["generateContent"]>>
): { images: { base64: string; mimeType: string }[]; textContent: string } {
  const images: { base64: string; mimeType: string }[] = [];
  let textContent = "";

  const candidates = response.candidates;
  if (!candidates || candidates.length === 0) {
    return { images, textContent };
  }

  const candidate = candidates[0];
  if (!candidate?.content?.parts) {
    return { images, textContent };
  }

  for (const part of candidate.content.parts) {
    if (part.inlineData) {
      images.push({
        base64: part.inlineData.data || "",
        mimeType: part.inlineData.mimeType || "image/png",
      });
    } else if (part.text) {
      textContent += part.text;
    }
  }

  return { images, textContent };
}

/**
 * Generate images using the user's API key
 */
export async function generateWithUserKey(
  userId: string,
  prompt: string,
  options: {
    resolution: ImageResolution;
    aspectRatio: AspectRatio;
    imageCount?: number;
    referenceImages?: ReferenceImage[];
    history?: HistoryEntry[];
  }
): Promise<GenerationResult> {
  // Get user's API key
  const apiKey = await getUserApiKey(userId);
  if (!apiKey) {
    return {
      success: false,
      images: [],
      error: "No API key configured. Please add your Google AI API key in your profile settings.",
    };
  }

  try {
    const client = createGeminiClient(apiKey);
    const {
      resolution,
      aspectRatio,
      referenceImages = [],
      history = [],
    } = options;

    // Build the enhanced prompt with reference context
    const enhancedPrompt = buildPromptWithReferences(prompt, referenceImages);

    // Build the content parts
    const parts: Part[] = [];

    // Add reference images first if any
    for (const ref of referenceImages) {
      const imagePart = await createImagePart(ref.imageUrl);
      parts.push(imagePart);
    }

    // Add the text prompt
    parts.push({ text: enhancedPrompt });

    // Build conversation history for multi-turn
    const contents: Content[] = [];

    // Add history if present
    for (const entry of history) {
      const historyParts: Part[] = [];

      // Add any images from this history entry
      if (entry.imageUrls && entry.imageUrls.length > 0) {
        for (const imageUrl of entry.imageUrls) {
          const imagePart = await createImagePart(imageUrl);
          historyParts.push(imagePart);
        }
      }

      // Add the text content
      historyParts.push({ text: entry.content });

      contents.push({
        role: entry.role === "user" ? "user" : "model",
        parts: historyParts,
      });
    }

    // Add the current user message
    contents.push({
      role: "user",
      parts,
    });

    // Generate the image(s)
    const response = await client.models.generateContent({
      model: MODEL_ID,
      contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
      },
    });

    // Extract images and text from the response
    const { images, textContent } = extractFromResponse(response);

    if (images.length === 0) {
      return {
        success: false,
        images: [],
        text: textContent,
        error: textContent || "No images were generated. Please try a different prompt.",
      };
    }

    return {
      success: true,
      images,
      text: textContent,
    };
  } catch (error) {
    console.error("Gemini API error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return {
          success: false,
          images: [],
          error: "Invalid API key. Please check your API key in profile settings.",
        };
      }
      if (error.message.includes("quota") || error.message.includes("rate")) {
        return {
          success: false,
          images: [],
          error: "API rate limit exceeded. Please try again later.",
        };
      }
      if (error.message.includes("safety")) {
        return {
          success: false,
          images: [],
          error: "Content was blocked by safety filters. Please modify your prompt.",
        };
      }
      return {
        success: false,
        images: [],
        error: error.message,
      };
    }

    return {
      success: false,
      images: [],
      error: "An unexpected error occurred during image generation.",
    };
  }
}

/**
 * Refine an existing generation with additional instructions
 */
export async function refineGeneration(
  userId: string,
  existingImageUrl: string,
  instruction: string,
  options: {
    resolution: ImageResolution;
    aspectRatio: AspectRatio;
  }
): Promise<GenerationResult> {
  // Get user's API key
  const apiKey = await getUserApiKey(userId);
  if (!apiKey) {
    return {
      success: false,
      images: [],
      error: "No API key configured. Please add your Google AI API key in your profile settings.",
    };
  }

  try {
    const client = createGeminiClient(apiKey);
    const { resolution, aspectRatio } = options;

    // Build the refinement prompt
    const refinementPrompt = `Based on this image, ${instruction}.`;

    // Create the image part from the existing image
    const imagePart = await createImagePart(existingImageUrl);

    // Build the content
    const contents: Content[] = [
      {
        role: "user",
        parts: [imagePart, { text: refinementPrompt }],
      },
    ];

    // Generate the refined image
    const response = await client.models.generateContent({
      model: MODEL_ID,
      contents,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
      },
    });

    // Extract images and text from the response
    const { images, textContent } = extractFromResponse(response);

    if (images.length === 0) {
      return {
        success: false,
        images: [],
        text: textContent,
        error: textContent || "No images were generated. Please try different instructions.",
      };
    }

    return {
      success: true,
      images,
      text: textContent,
    };
  } catch (error) {
    console.error("Gemini API refinement error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        images: [],
        error: error.message,
      };
    }

    return {
      success: false,
      images: [],
      error: "An unexpected error occurred during image refinement.",
    };
  }
}
