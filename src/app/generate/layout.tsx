import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate",
  description: "Create AI-generated images with Nano Banana Pro. Use the prompt builder to craft the perfect image.",
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
