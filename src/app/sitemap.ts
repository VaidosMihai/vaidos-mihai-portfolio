import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date("2026-11-23T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
