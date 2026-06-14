import type { Metadata } from "next";
import { SiteNav } from "./_components/SiteNav";
import { ScrollProgressBar } from "./_components/ScrollProgressBar";
import { CommandPalette } from "./_components/CommandPalette";
import { FloatingDock } from "./_components/FloatingDock";
import { KeyboardHelp } from "./_components/KeyboardHelp";
import { ToastProvider } from "./_components/ToastProvider";
import { CursorGlow } from "./_components/CursorGlow";
import { Grain } from "./_components/Grain";
import { PageTitleEffect } from "./_components/PageTitleEffect";
import { SectionDots } from "./_components/SectionDots";
import { StatusRibbon } from "./_components/StatusRibbon";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://konjo.ai"),
  title: "KonjoAI — High-performance AI infrastructure",
  description:
    "High-performance AI infrastructure, built in the Konjo way. Inference, RAG, memory, compression, interpretability, and adversarial tooling.",
  openGraph: {
    title: "KonjoAI",
    description: "High-performance AI infrastructure, built in the Konjo way.",
    url: "https://konjo.ai",
    siteName: "KonjoAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KonjoAI",
    description: "High-performance AI infrastructure, built in the Konjo way.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-konjo-bg text-konjo-fg antialiased font-konjo-sans">
        {/* Keyboard accessibility: skip repeated nav to reach main content */}
        <a
          href="#main-content"
          className="text-konjo-mono sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-konjo focus:bg-konjo-surface focus:px-4 focus:py-2 focus:text-sm focus:text-konjo-fg focus:ring-2 focus:ring-konjo-accent"
        >
          Skip to content
        </a>
        <CursorGlow />
        <Grain />
        <PageTitleEffect />
        <ScrollProgressBar />
        <CommandPalette />
        <KeyboardHelp />
        <ToastProvider />
        <FloatingDock />
        <SectionDots />
        <SiteNav />
        <StatusRibbon />
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
