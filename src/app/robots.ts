import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";

const baseUrl = siteConfig.baseUrl ?? "https://lp-tutor.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
