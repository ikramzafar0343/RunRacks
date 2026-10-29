/**
 * Blog landing — featured, topics, latest archive, search + pagination.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogLandingView } from "@/features/blog/components/BlogLandingView";
import { BLOG_LANDING } from "@/features/blog/model/blogLandingContent";
import {
  DEFAULT_PAGE_SIZE,
  getFeaturedArticle,
  getPublishedCategories,
  getTopicSections,
  listArticles,
} from "@/features/blog/server/blogRepository";

type BlogPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

export async function generateMetadata({
  searchParams,
}: BlogPageProps): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const base: Metadata = {
    title: "Insights & Resources | RunRacks",
    description: BLOG_LANDING.lead,
  };
  if (search) {
    return {
      ...base,
      title: `Search: ${search} | RunRacks Journal`,
      robots: { index: false, follow: true },
    };
  }
  return base;
}

async function BlogLandingContent({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const pageRaw = Number.parseInt(params.page ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const isSearch = search.length > 0;
  const showFeaturedAndTopics = !isSearch && page === 1;

  const featured = showFeaturedAndTopics ? getFeaturedArticle() : undefined;
  const categories = getPublishedCategories();
  const topics = showFeaturedAndTopics ? getTopicSections() : [];
  const excludeIds =
    showFeaturedAndTopics && featured ? [featured.id] : undefined;

  const latest = listArticles({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(isSearch ? { search } : {}),
    ...(excludeIds ? { excludeIds } : {}),
  });

  return (
    <BlogLandingView
      categories={categories}
      {...(featured ? { featured } : {})}
      topics={topics}
      latest={latest}
      search={search}
      showFeaturedAndTopics={showFeaturedAndTopics}
    />
  );
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <main className="flex flex-1 flex-col pt-16 md:pt-[4.8rem]">
      <Suspense
        fallback={
          <div
            className="blogPage min-h-[50vh]"
            aria-busy="true"
            aria-label="Loading journal"
          />
        }
      >
        <BlogLandingContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
