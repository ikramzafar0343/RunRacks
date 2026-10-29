/**
 * File-based published blog repository. Swap implementation for CMS later.
 */
import "server-only";
import { BLOG_POSTS } from "../../../../content/blog/posts";
import { estimateReadingMinutes } from "../lib/readingTime";
import {
  BLOG_CATEGORIES,
  getCategoryById,
  getCategoryBySlug,
} from "../model/categories";
import type {
  BlogArticle,
  BlogArticleListItem,
  BlogCategory,
  BlogListQuery,
  BlogListResult,
} from "../model/types";

const DEFAULT_PAGE_SIZE = 9;

function isPublished(article: BlogArticle): boolean {
  return article.status === "published";
}

function toListItem(article: BlogArticle): BlogArticleListItem {
  const category = getCategoryById(article.categoryId);
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    categoryId: article.categoryId,
    ...(article.tags ? { tags: article.tags } : {}),
    coverImageUrl: article.coverImageUrl,
    coverImageAlt: article.coverImageAlt,
    ...(article.coverImageFocus
      ? { coverImageFocus: article.coverImageFocus }
      : {}),
    ...(article.coverImageCaption
      ? { coverImageCaption: article.coverImageCaption }
      : {}),
    ...(article.coverImageCredit
      ? { coverImageCredit: article.coverImageCredit }
      : {}),
    authorName: article.authorName,
    ...(article.authorAvatarUrl
      ? { authorAvatarUrl: article.authorAvatarUrl }
      : {}),
    publishedAt: article.publishedAt,
    ...(article.updatedAt ? { updatedAt: article.updatedAt } : {}),
    featured: article.featured,
    status: article.status,
    ...(article.seoTitle ? { seoTitle: article.seoTitle } : {}),
    ...(article.seoDescription
      ? { seoDescription: article.seoDescription }
      : {}),
    categoryName: category?.name ?? "Journal",
    categorySlug: category?.slug ?? "journal",
    readingMinutes: estimateReadingMinutes(article.content),
  };
}

function sortArticles(
  items: BlogArticle[],
  sort: "newest" | "oldest" = "newest",
): BlogArticle[] {
  const copy = [...items];
  copy.sort((a, b) => {
    const ta = new Date(a.publishedAt).getTime();
    const tb = new Date(b.publishedAt).getTime();
    return sort === "oldest" ? ta - tb : tb - ta;
  });
  return copy;
}

function matchesSearch(article: BlogArticle, q: string): boolean {
  const hay = [
    article.title,
    article.excerpt,
    ...(article.tags ?? []),
    getCategoryById(article.categoryId)?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

export function getPublishedCategories(): readonly BlogCategory[] {
  return [...BLOG_CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublishedArticles(): readonly BlogArticle[] {
  return sortArticles(BLOG_POSTS.filter(isPublished));
}

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  const article = BLOG_POSTS.find((a) => a.slug === slug);
  if (!article || !isPublished(article)) return undefined;
  return article;
}

export function getFeaturedArticle(): BlogArticleListItem | undefined {
  const published = getPublishedArticles();
  const flagged = published.find((a) => a.featured && a.coverImageUrl);
  const withCover = flagged ?? published.find((a) => a.coverImageUrl);
  return withCover ? toListItem(withCover) : undefined;
}

export function listArticles(query: BlogListQuery = {}): BlogListResult {
  const pageSize = Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE);
  const page = Math.max(1, query.page ?? 1);
  const sort = query.sort ?? "newest";
  const search = query.search?.trim() ?? "";
  const exclude = new Set(query.excludeIds ?? []);

  let articles = BLOG_POSTS.filter(isPublished);

  if (query.categorySlug) {
    const cat = getCategoryBySlug(query.categorySlug);
    if (!cat) {
      return { items: [], page, pageSize, totalCount: 0, totalPages: 0 };
    }
    articles = articles.filter((a) => a.categoryId === cat.id);
  }

  if (search) {
    articles = articles.filter((a) => matchesSearch(a, search));
  }

  if (exclude.size > 0) {
    articles = articles.filter((a) => !exclude.has(a.id));
  }

  articles = sortArticles(articles, sort);
  const totalCount = articles.length;
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize);
  const start = (page - 1) * pageSize;
  const slice = articles.slice(start, start + pageSize);

  return {
    items: slice.map(toListItem),
    page,
    pageSize,
    totalCount,
    totalPages,
  };
}

export function getRelatedArticles(
  article: BlogArticle,
  limit = 4,
): readonly BlogArticleListItem[] {
  const published = sortArticles(
    BLOG_POSTS.filter((a) => isPublished(a) && a.id !== article.id),
  );
  const same = published.filter((a) => a.categoryId === article.categoryId);
  const others = published.filter((a) => a.categoryId !== article.categoryId);
  const merged = [...same, ...others].slice(0, limit);
  return merged.map(toListItem);
}

export function getTopicSections(
  minPosts = 3,
  cardsPerSection = 3,
): readonly {
  category: BlogCategory;
  articles: readonly BlogArticleListItem[];
}[] {
  const published = getPublishedArticles();
  const sections: {
    category: BlogCategory;
    articles: BlogArticleListItem[];
  }[] = [];

  for (const category of getPublishedCategories()) {
    const inCat = published.filter((a) => a.categoryId === category.id);
    if (inCat.length < minPosts) continue;
    sections.push({
      category,
      articles: inCat.slice(0, cardsPerSection).map(toListItem),
    });
  }
  return sections;
}

export function getArticleListItem(article: BlogArticle): BlogArticleListItem {
  return toListItem(article);
}

export { DEFAULT_PAGE_SIZE };
