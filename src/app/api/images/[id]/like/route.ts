import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq, and, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generatedImages, imageLikes } from "@/lib/schema";

/**
 * POST /api/images/[id]/like
 * Like an image (toggle - if already liked, unlike it)
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: imageId } = await params;

    // Verify the image exists and is public
    const [image] = await db
      .select()
      .from(generatedImages)
      .where(eq(generatedImages.id, imageId))
      .limit(1);

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    if (!image.isPublic) {
      return NextResponse.json(
        { error: "Cannot like a private image" },
        { status: 403 }
      );
    }

    // Check if user already liked this image
    const [existingLike] = await db
      .select()
      .from(imageLikes)
      .where(
        and(
          eq(imageLikes.imageId, imageId),
          eq(imageLikes.userId, session.user.id)
        )
      )
      .limit(1);

    let isLiked: boolean;

    if (existingLike) {
      // Unlike: Remove the like
      await db
        .delete(imageLikes)
        .where(eq(imageLikes.id, existingLike.id));
      isLiked = false;
    } else {
      // Like: Add the like
      await db.insert(imageLikes).values({
        imageId,
        userId: session.user.id,
      });
      isLiked = true;
    }

    // Get updated like count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(imageLikes)
      .where(eq(imageLikes.imageId, imageId));

    const likeCount = likeCountResult?.count || 0;

    return NextResponse.json({
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/images/[id]/like
 * Get like status and count for an image
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const { id: imageId } = await params;

    // Get like count
    const [likeCountResult] = await db
      .select({ count: count() })
      .from(imageLikes)
      .where(eq(imageLikes.imageId, imageId));

    const likeCount = likeCountResult?.count || 0;

    // Check if current user liked (if logged in)
    let isLiked = false;
    if (session?.user) {
      const [existingLike] = await db
        .select()
        .from(imageLikes)
        .where(
          and(
            eq(imageLikes.imageId, imageId),
            eq(imageLikes.userId, session.user.id)
          )
        )
        .limit(1);
      isLiked = !!existingLike;
    }

    return NextResponse.json({
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error("Error getting like status:", error);
    return NextResponse.json(
      { error: "Failed to get like status" },
      { status: 500 }
    );
  }
}
