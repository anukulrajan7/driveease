import type { MetadataRoute } from "next";
import { tours } from "@/data/tours";
import { destinations, posts } from "@/data/content";
import { SERVICES } from "@/data/services";
import { SITE_URL as BASE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tours",
    "/car-rental",
    "/services",
    "/destinations",
    "/travel-info",
    "/blog",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticRoutes,
    ...SERVICES.filter((s) => !s.externalHref).map((s) => ({
      url: `${BASE}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...tours.map((t) => ({
      url: `${BASE}/tours/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...destinations.map((d) => ({
      url: `${BASE}/destinations/${d.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
