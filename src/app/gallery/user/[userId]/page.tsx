import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import { UserGalleryClient } from "@/components/gallery/user-gallery-client";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;

  const [userData] = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userData) {
    return {
      title: "User Not Found - Nano Banana Pro",
    };
  }

  return {
    title: `${userData.name}'s Gallery - Nano Banana Pro`,
    description: `View public AI-generated images by ${userData.name}`,
  };
}

export default async function UserGalleryPage({ params }: Props) {
  const { userId } = await params;

  // Verify user exists
  const [userData] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserGalleryClient userId={userId} />
    </div>
  );
}
