import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { formatBlogDate } from "../lib/formatBlogDate";

type ArticleHeaderProps = {
  title: string;
  excerpt?: string;
  categoryName: string;
  categorySlug: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  authorName: string;
  authorAvatarUrl?: string;
};

function isMeaningfullyUpdated(
  publishedAt: string,
  updatedAt?: string,
): boolean {
  if (!updatedAt) return false;
  const pub = new Date(publishedAt).getTime();
  const upd = new Date(updatedAt).getTime();
  if (Number.isNaN(pub) || Number.isNaN(upd)) return false;
  return upd - pub >= 24 * 60 * 60 * 1000;
}

export function ArticleHeader({
  title,
  excerpt,
  categoryName,
  categorySlug,
  publishedAt,
  updatedAt,
  readingMinutes,
  authorName,
  authorAvatarUrl,
}: ArticleHeaderProps) {
  const published = formatBlogDate(publishedAt);
  const showUpdated = isMeaningfullyUpdated(publishedAt, updatedAt);
  const updated = showUpdated && updatedAt ? formatBlogDate(updatedAt) : "";

  return (
    <header className="articleHeaderBand">
      <p className="articleHeaderCategory">
        <Link href={`/blog/category/${categorySlug}` as Route}>
          {categoryName}
        </Link>
      </p>
      <p className="articleHeaderMeta">
        {published ? <time dateTime={publishedAt}>{published}</time> : null}
        <span aria-hidden> · </span>
        <span>{readingMinutes} min read</span>
        {showUpdated && updated ? (
          <>
            <span aria-hidden> · </span>
            <span>
              Updated <time dateTime={updatedAt}>{updated}</time>
            </span>
          </>
        ) : null}
      </p>
      <h1 className="articleHeaderTitle">{title}</h1>
      {excerpt ? <p className="articleHeaderExcerpt">{excerpt}</p> : null}
      <p className="articleHeaderAuthor">
        {authorAvatarUrl ? (
          <Image
            className="articleHeaderAvatar"
            src={authorAvatarUrl}
            alt=""
            width={38}
            height={38}
          />
        ) : null}
        <span>{authorName}</span>
      </p>
    </header>
  );
}
