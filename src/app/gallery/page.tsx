import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PersonalGallery } from "@/components/gallery/personal-gallery";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "My Gallery - Nano Banana Pro",
  description: "View and manage your AI-generated images",
};

export default async function GalleryPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    redirect("/");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Gallery</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your AI-generated images
        </p>
      </div>
      <PersonalGallery />
    </div>
  );
}
