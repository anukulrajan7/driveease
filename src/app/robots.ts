import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/book/", "/confirmation"],
    },
    sitemap: "https://driveease.example/sitemap.xml",
  };
}
