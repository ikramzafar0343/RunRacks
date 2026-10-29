/**
 * Blog content contracts — file-based now; CMS can map into these later.
 */

export type BlogContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "ul"; items: readonly string[] };

export type BlogCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogArticleStatus =
  "draft" | "scheduled" | "published" | "archived";

export type BlogArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: readonly BlogContentBlock[];
  categoryId: string;
  tags?: readonly string[];
  coverImageUrl: string;
  coverImageAlt: string;
  coverImageFocus?: string;
  coverImageCaption?: string;
  coverImageCredit?: string;
  authorName: string;
  authorBio: string;
  authorAvatarUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  featured: boolean;
  status: BlogArticleStatus;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogArticleListItem = Omit<BlogArticle, "content" | "authorBio"> & {
  categoryName: string;
  categorySlug: string;
  readingMinutes: number;
};

export type BlogSort = "newest" | "oldest";

export type BlogListQuery = {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  search?: string;
  sort?: BlogSort;
  excludeIds?: readonly string[];
};

export type BlogListResult = {
  items: readonly BlogArticleListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type BlogTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};
