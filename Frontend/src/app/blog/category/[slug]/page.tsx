/**
 * Category archive for the journal.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArchivePagination } from "@/features/blog/components/ArchivePagination";
import { ArticleCard } from "@/features/blog/components/ArticleCard";
import { BlogEmptyState } from "@/features/blog/components/BlogEmptyState";
import { BlogSearch } from "@/features/blog/components/BlogSearch";
import { TopicNav } from "@/features/blog/components/TopicNav";
import "@/features/blog/components/blog.css";
import "@/features/blog/components/blog-cards.css";
import type { BlogCategory } from "@/features/blog/model/types";
import { getCategoryBySlug } from "@/features/blog/model/categories";
import {
  DEFAULT_PAGE_SIZE,
  getPublishedCategories,
  listArticles,
} from "@/features/blog/server/blogRepository";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
};

export function generateStaticParams() {
  return getPublishedCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const sp = await searchParams;
  const search = sp.search?.trim() ?? "";
  const base: Metadata = {
    title: category.seoTitle ?? `${category.name} | RunRacks Journal`,
    description: category.seoDescription ?? category.description,
  };
  if (search) {
    return {
      ...base,
      title: `Search: ${search} · ${category.name} | RunRacks`,
      robots: { index: false, follow: true },
    };
  }
  return base;
}

async function CategoryArchive({
  category,
  searchParams,
}: {
  category: BlogCategory;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const search = sp.search?.trim() ?? "";
  const pageRaw = Number.parseInt(sp.page ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const basePath = `/blog/category/${category.slug}`;

  const result = listArticles({
    categorySlug: category.slug,
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(search ? { search } : {}),
  });

  const categories = getPublishedCategories();
  const isEmpty = result.totalCount === 0;

  return (
    <div className="blogPage">
      <div className="blogInner">
        <header className="blogCategoryHead">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </header>
        <TopicNav categories={categories} activeSlug={category.slug} />
        <div className="blogToolbar">
          <BlogSearch initialQuery={search} basePath={basePath} />
        </div>

        {isEmpty ? (
          search ? (
            <BlogEmptyState variant="search" query={search} />
          ) : (
            <BlogEmptyState variant="category" categoryName={category.name} />
          )
        ) : (
          <section className="blogLatest" aria-labelledby="cat-latest">
            <h2 id="cat-latest" className="sr-only">
              Articles in {category.name}
            </h2>
            <div className="blogCardGrid blogCardGrid--3">
              {result.items.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <ArchivePagination
              basePath={basePath}
              page={result.page}
              totalPages={result.totalPages}
              {...(search ? { search } : {})}
            />
          </section>
        )}
      </div>
      <div className="blogSupportWrap blogInner">
        <SupportCtaSection />
      </div>
    </div>
  );
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <main className="flex flex-1 flex-col pt-16 md:pt-[4.8rem]">
      <Suspense
        fallback={
          <div
            className="blogPage min-h-[50vh]"
            aria-busy="true"
            aria-label="Loading topic"
          />
        }
      >
        <CategoryArchive category={category} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
