import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = [
  { path: "/", priority: 1 },
  { path: "/who-am-i", priority: 0.9 },
  { path: "/spotlights", priority: 0.9 },
  { path: "/lets-talk", priority: 0.8 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority
  }));
}
