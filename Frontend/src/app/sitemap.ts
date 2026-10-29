/**
 * Indexable marketing/product routes + published journal entries.
 */
import type { MetadataRoute } from "next";
import {
  getPublishedArticles,
  getPublishedCategories,
} from "@/features/blog/server/blogRepository";
import { getSiteUrl } from "@/shared/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const paths = [
    "/",
    "/products/vps",
    "/products/vps-usa",
    "/products/windows",
    "/products/windows-usa",
    "/products/admin-rdp",
    "/products/admin-rdp-usa",
    "/pricing",
    "/contact",
    "/faq",
    "/about",
    "/customize",
    "/ai",
    "/privacy",
    "/terms",
    "/blog",
  ] as const;

  const staticEntries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/blog" ? "weekly" : "monthly",
    priority:
      path === "/" || path.startsWith("/products")
        ? 1
        : path === "/blog"
          ? 0.8
          : 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = getPublishedCategories().map(
    (cat) => ({
      url: `${base}/blog/category/${cat.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }),
  );

  const articleEntries: MetadataRoute.Sitemap = getPublishedArticles().map(
    (article) => ({
      url: `${base}/blog/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }),
  );

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}
