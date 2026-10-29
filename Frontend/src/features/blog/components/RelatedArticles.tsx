import Link from "next/link";
import type { Route } from "next";
import type { BlogArticleListItem } from "../model/types";
import { ArticleCard } from "./ArticleCard";

type RelatedArticlesProps = {
  articles: readonly BlogArticleListItem[];
};

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="articleRelated" aria-labelledby="related-heading">
      <div className="articleRelatedHead">
        <h2 id="related-heading">You may also like</h2>
        <Link href={"/blog" as Route}>View all articles</Link>
      </div>
      <div className="blogCardGrid blogCardGrid--3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
