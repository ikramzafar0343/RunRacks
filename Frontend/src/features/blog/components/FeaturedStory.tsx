import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { HiArrowRight } from "react-icons/hi2";
import { formatBlogDate } from "../lib/formatBlogDate";
import type { BlogArticleListItem } from "../model/types";

type FeaturedStoryProps = {
  article: BlogArticleListItem;
};

export function FeaturedStory({ article }: FeaturedStoryProps) {
  const href = `/blog/${article.slug}` as Route;
  const date = formatBlogDate(article.publishedAt);

  return (
    <article className="blogFeatured" aria-labelledby="blog-featured-title">
      <div className="blogFeaturedMedia">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt}
            fill
            preload
            sizes="(max-width: 900px) 100vw, 55vw"
          />
        ) : (
          <div className="blogCardFallback" aria-hidden>
            RunRacks
          </div>
        )}
      </div>
      <div>
        <p className="blogFeaturedMeta">
          {article.categoryName}
          {date ? ` · ${date}` : ""}
          {` · ${article.readingMinutes} min read`}
        </p>
        <h2 id="blog-featured-title" className="blogFeaturedTitle">
          <Link href={href}>{article.title}</Link>
        </h2>
        <p className="blogFeaturedExcerpt">{article.excerpt}</p>
        <Link href={href} className="blogReadLink">
          Read article
          <HiArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
