import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site-config";
import { getStoryGalleries, getStoryPosts } from "@/lib/story-content";

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/donate", changeFrequency: "monthly", priority: 0.9 },
  { path: "/programs", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/impact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/stories", changeFrequency: "weekly", priority: 0.7 },
  { path: "/get-involved", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, galleries] = await Promise.all([getStoryPosts(), getStoryGalleries()]);

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/stories/${post.slug}`),
      lastModified: post.publishedAtIso ?? undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...galleries.map((gallery) => ({
      url: absoluteUrl(`/stories/galleries/${gallery.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
