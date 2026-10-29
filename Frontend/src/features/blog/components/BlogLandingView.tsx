import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import type {
  BlogArticleListItem,
  BlogCategory,
  BlogListResult,
} from "../model/types";
import { BLOG_LANDING } from "../model/blogLandingContent";
import { ArchivePagination } from "./ArchivePagination";
import { ArticleCard } from "./ArticleCard";
import { BlogEmptyState } from "./BlogEmptyState";
import { BlogIntro } from "./BlogIntro";
import { BlogSearch } from "./BlogSearch";
import { FeaturedStory } from "./FeaturedStory";
import { TopicNav } from "./TopicNav";
import { TopicSection } from "./TopicSection";
import "./blog.css";
import "./blog-cards.css";

type TopicBlock = {
  category: BlogCategory;
  articles: readonly BlogArticleListItem[];
};

type BlogLandingViewProps = {
  categories: readonly BlogCategory[];
  featured?: BlogArticleListItem;
  topics: readonly TopicBlock[];
  latest: BlogListResult;
  search: string;
  showFeaturedAndTopics: boolean;
};

export function BlogLandingView({
  categories,
  featured,
  topics,
  latest,
  search,
  showFeaturedAndTopics,
}: BlogLandingViewProps) {
  const isSearch = search.length > 0;
  const isEmpty = latest.totalCount === 0;

  return (
    <div className="blogPage">
      <div className="blogInner">
        <BlogIntro
          eyebrow={BLOG_LANDING.eyebrow}
          title={BLOG_LANDING.title}
          lead={BLOG_LANDING.lead}
        />
        <TopicNav categories={categories} />
        <div className="blogToolbar">
          <BlogSearch initialQuery={search} />
        </div>

        {isSearch ? (
          isEmpty ? (
            <BlogEmptyState variant="search" query={search} />
          ) : (
            <section className="blogLatest" aria-labelledby="search-results">
              <h2 id="search-results">
                {latest.totalCount} result{latest.totalCount === 1 ? "" : "s"}{" "}
                for “{search}”
              </h2>
              <div className="blogCardGrid blogCardGrid--3">
                {latest.items.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <ArchivePagination
                basePath="/blog"
                page={latest.page}
                totalPages={latest.totalPages}
                search={search}
              />
            </section>
          )
        ) : (
          <>
            {showFeaturedAndTopics && featured ? (
              <FeaturedStory article={featured} />
            ) : null}

            {showFeaturedAndTopics
              ? topics.map((block) => (
                  <TopicSection
                    key={block.category.id}
                    category={block.category}
                    articles={block.articles}
                  />
                ))
              : null}

            <section className="blogLatest" aria-labelledby="latest-heading">
              <h2 id="latest-heading">Latest</h2>
              {isEmpty ? (
                <BlogEmptyState variant="archive" />
              ) : (
                <>
                  <div className="blogCardGrid blogCardGrid--3">
                    {latest.items.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                  <ArchivePagination
                    basePath="/blog"
                    page={latest.page}
                    totalPages={latest.totalPages}
                  />
                </>
              )}
            </section>
          </>
        )}
      </div>
      <div className="blogSupportWrap blogInner">
        <SupportCtaSection />
      </div>
    </div>
  );
}
