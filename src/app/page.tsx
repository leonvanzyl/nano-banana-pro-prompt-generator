import Link from "next/link";
import { Banana, ImageIcon, Sparkles, Users } from "lucide-react";
import { PublicGalleryPreview } from "@/components/gallery/public-gallery-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Nano Banana Pro - AI Image Generation",
  description: "Create stunning AI-generated images using Gemini. Build with customizable prompts, reusable avatars, and powerful image-to-image capabilities.",
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 mb-16">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-yellow-500/20">
            <Banana className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold">
          <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Nano Banana Pro
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create stunning AI-generated images using Gemini. Build with customizable prompts,
          reusable avatars, and powerful image-to-image capabilities.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/generate">Start Creating</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/gallery">View Gallery</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Prompt Builder</CardTitle>
            <CardDescription>
              Craft the perfect prompt with templates for lighting, camera angles, styles, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Predefined templates for quick setup</li>
              <li>Free text customization</li>
              <li>Live prompt preview</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Avatar System</CardTitle>
            <CardDescription>
              Create reusable avatars for consistent character generation across images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Human and object avatars</li>
              <li>Reference image support</li>
              <li>Character consistency</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Multi-Image Generation</CardTitle>
            <CardDescription>
              Generate up to 4 images at once with various resolutions and aspect ratios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>1K, 2K, 4K resolutions</li>
              <li>Multiple aspect ratios</li>
              <li>Iterative refinement</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Public Gallery Preview */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Public Gallery</h2>
        <p className="text-muted-foreground mb-8">
          Explore images created by the community
        </p>
        <PublicGalleryPreview />
        <Button asChild variant="outline" className="mt-8">
          <Link href="/gallery/public">View All Images</Link>
        </Button>
      </section>
    </div>
  );
}
