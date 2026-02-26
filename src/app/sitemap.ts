import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site";
import { SUPPORTED_LOCALES } from "@/lib/routing";

const baseUrl = siteConfig.baseUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastMod = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: `${baseUrl}/${locale}/simplex`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    entries.push({
      url: `${baseUrl}/${locale}/graphical`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return entries;
}
