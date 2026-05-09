import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist, Lexend, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { VisionProvider } from "@/components/vision/VisionProvider";

const geist = Geist({subsets:['latin'],variable:'--font-geist'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "I3.MRMRRT.ƐI | Autonomous Shadow Strategist",
  description: "Decision Support System - I3.MRMRRT.ƐI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={cn("h-full", "antialiased", inter.variable, jetbrainsMono.variable, "font-sans", geist.variable, lexend.variable, outfit.variable)}
    >
      <head>
        {/* Atkinson Hyperlegible — loaded via CSS @import for accessibility */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-obsidian text-foreground">
        <VisionProvider>{children}</VisionProvider>
      </body>
    </html>
  );
}
