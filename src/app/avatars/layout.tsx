import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avatars",
  description: "Manage your reference images for AI generation. Create and organize avatars for consistent character generation.",
};

export default function AvatarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
