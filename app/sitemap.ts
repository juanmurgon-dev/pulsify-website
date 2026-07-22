import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/markdown";

const SITIO = "https://platify-website.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getBlogPosts();

  const fijas: MetadataRoute.Sitemap = [
    { url: `${SITIO}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITIO}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITIO}/checkout`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const blogs: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITIO}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...fijas, ...blogs];
}
