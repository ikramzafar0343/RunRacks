import Link from "next/link";
import type { Route } from "next";
import type { BlogCategory } from "../model/types";

type TopicNavProps = {
  categories: readonly BlogCategory[];
  activeSlug?: string;
};

export function TopicNav({ categories, activeSlug }: TopicNavProps) {
  return (
    <nav className="blogTopicNav" aria-label="Journal topics">
      <Link
        href={"/blog" as Route}
        aria-current={!activeSlug ? "page" : undefined}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/blog/category/${cat.slug}` as Route}
          aria-current={activeSlug === cat.slug ? "page" : undefined}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
