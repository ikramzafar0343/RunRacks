import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { formatBlogDateShort } from "../lib/formatBlogDate";
import type { BlogArticleListItem } from "../model/types";

type ArticleCardProps = {
  article: BlogArticleListItem;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const href = `/blog/${article.slug}` as Route;
  const date = formatBlogDateShort(article.publishedAt);

  return (
    <Link href={href} className="blogCard">
      <div className="blogCardMedia">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.coverImageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="blogCardFallback" aria-hidden>
            RunRacks
          </div>
        )}
      </div>
      <p className="blogCardMeta">
        {article.categoryName}
        {date ? ` · ${date}` : ""}
        {` · ${article.readingMinutes} min`}
      </p>
      <h3 className="blogCardTitle">{article.title}</h3>
      <p className="blogCardExcerpt">{article.excerpt}</p>
    </Link>
  );
}
