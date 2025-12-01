import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nano Banana Pro",
    template: "%s | Nano Banana Pro",
  },
  description:
    "AI-powered image generation using Gemini. Create stunning images with text-to-image and image-to-image capabilities, customizable prompts, and reusable avatars.",
  keywords: [
    "AI Image Generation",
    "Gemini",
    "Text to Image",
    "Image Generation",
    "Nano Banana Pro",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Nano Banana Pro" }],
  creator: "Nano Banana Pro",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nano Banana Pro",
    title: "Nano Banana Pro",
    description:
      "AI-powered image generation using Gemini. Create stunning images with customizable prompts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nano Banana Pro",
    description:
      "AI-powered image generation using Gemini. Create stunning images with customizable prompts.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Nano Banana Pro",
  description:
    "AI-powered image generation using Gemini. Create stunning images with text-to-image and image-to-image capabilities.",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Nano Banana Pro",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
