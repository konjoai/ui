import type { MetadataRoute } from "next";

/** robots.txt — allow all crawlers, link the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://konjo.ai/sitemap.xml",
  };
}
