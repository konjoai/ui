import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
