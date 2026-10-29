import Link from "next/link";
import type { Route } from "next";
import type { BlogArticleListItem, BlogCategory } from "../model/types";
import { ArticleCard } from "./ArticleCard";

type TopicSectionProps = {
  category: BlogCategory;
  articles: readonly BlogArticleListItem[];
};

export function TopicSection({ category, articles }: TopicSectionProps) {
  return (
    <section
      className="blogTopicSection"
      aria-labelledby={`topic-${category.slug}`}
    >
      <div className="blogTopicSectionHead">
        <div>
          <h2 id={`topic-${category.slug}`}>{category.name}</h2>
          <p>{category.description}</p>
        </div>
        <Link
          href={`/blog/category/${category.slug}` as Route}
          className="blogViewAll"
        >
          View all
        </Link>
      </div>
      <div className="blogCardGrid blogCardGrid--3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
