/**
 * Journal article detail — editorial reading layout + JSON-LD.
 */
import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/features/blog/components/ArticleBody";
import { ArticleBreadcrumbs } from "@/features/blog/components/ArticleBreadcrumbs";
import { ArticleCover } from "@/features/blog/components/ArticleCover";
import { ArticleHeader } from "@/features/blog/components/ArticleHeader";
import { ArticleReadingLayout } from "@/features/blog/components/ArticleReadingLayout";
import { ArticleShare } from "@/features/blog/components/ArticleShare";
import { ArticleTags } from "@/features/blog/components/ArticleTags";
import { AuthorProfile } from "@/features/blog/components/AuthorProfile";
import { RelatedArticles } from "@/features/blog/components/RelatedArticles";
import "@/features/blog/components/blog.css";
import "@/features/blog/components/blog-cards.css";
import "@/features/blog/components/blog-article-layout.css";
import "@/features/blog/components/blog-article-type.css";
import { estimateReadingMinutes } from "@/features/blog/lib/readingTime";
import { buildToc, withUniqueHeadingIds } from "@/features/blog/lib/toc";
import { getCategoryById } from "@/features/blog/model/categories";
import {
  getArticleBySlug,
  getArticleListItem,
  getPublishedArticles,
  getRelatedArticles,
} from "@/features/blog/server/blogRepository";
import { getSiteUrl } from "@/shared/config/site";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const title = article.seoTitle ?? `${article.title} | RunRacks`;
  const description = article.seoDescription ?? article.excerpt;
  const url = `${getSiteUrl()}/blog/${article.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      images: article.coverImageUrl
        ? [{ url: article.coverImageUrl, alt: article.coverImageAlt }]
        : undefined,
    },
    alternates: { canonical: url },
  };
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  if (slug === "category") notFound();

  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategoryById(article.categoryId);
  const listItem = getArticleListItem(article);
  const content = withUniqueHeadingIds(article.content);
  const toc = buildToc(content);
  const related = getRelatedArticles(article, 3);
  const site = getSiteUrl();
  const url = `${site}/blog/${article.slug}`;
  const readingMinutes = estimateReadingMinutes(content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Organization",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "RunRacks",
      url: site,
    },
    image: article.coverImageUrl
      ? [`${site}${article.coverImageUrl}`]
      : undefined,
    mainEntityOfPage: url,
    articleSection: category?.name,
    inLanguage: "en",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: category?.name ?? "Topic",
        item: `${site}/blog/category/${category?.slug ?? ""}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: url,
      },
    ],
  };

  return (
    <main className="flex flex-1 flex-col pt-16 md:pt-[4.8rem]">
      <div className="articlePage">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <article className="articleInner">
          <ArticleBreadcrumbs
            items={[
              { label: "Home", href: "/" as Route },
              { label: "Blog", href: "/blog" as Route },
              {
                label: listItem.categoryName,
                href: `/blog/category/${listItem.categorySlug}` as Route,
              },
              { label: article.title },
            ]}
          />
          <ArticleHeader
            title={article.title}
            excerpt={article.excerpt}
            categoryName={listItem.categoryName}
            categorySlug={listItem.categorySlug}
            publishedAt={article.publishedAt}
            {...(article.updatedAt ? { updatedAt: article.updatedAt } : {})}
            readingMinutes={readingMinutes}
            authorName={article.authorName}
            {...(article.authorAvatarUrl
              ? { authorAvatarUrl: article.authorAvatarUrl }
              : {})}
          />
          <ArticleCover
            {...(article.coverImageUrl ? { src: article.coverImageUrl } : {})}
            alt={article.coverImageAlt}
            {...(article.coverImageCaption
              ? { caption: article.coverImageCaption }
              : {})}
            {...(article.coverImageCredit
              ? { credit: article.coverImageCredit }
              : {})}
          />
          <ArticleReadingLayout toc={toc}>
            <ArticleBody content={content} />
          </ArticleReadingLayout>
          <div className="articleEnd">
            {article.tags ? <ArticleTags tags={article.tags} /> : null}
            <ArticleShare title={article.title} url={url} />
            <AuthorProfile
              name={article.authorName}
              bio={article.authorBio}
              {...(article.authorAvatarUrl
                ? { avatarUrl: article.authorAvatarUrl }
                : {})}
            />
            <Link href={"/blog" as Route} className="articleBackLink">
              Back to all articles
            </Link>
          </div>
          <RelatedArticles articles={related} />
        </article>
      </div>
    </main>
  );
}
