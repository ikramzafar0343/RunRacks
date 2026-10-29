import Link from "next/link";
import type { Route } from "next";

type BlogEmptyStateProps = {
  variant: "search" | "category" | "archive";
  query?: string;
  categoryName?: string;
};

export function BlogEmptyState({
  variant,
  query,
  categoryName,
}: BlogEmptyStateProps) {
  if (variant === "search") {
    return (
      <div className="blogEmpty" role="status">
        <h2>No articles match your search</h2>
        <p>
          Nothing found for “{query ?? ""}”. Try a different term or browse all
          topics.
        </p>
        <Link href={"/blog" as Route}>Clear search</Link>
      </div>
    );
  }

  if (variant === "category") {
    return (
      <div className="blogEmpty" role="status">
        <h2>No articles in {categoryName ?? "this topic"} yet</h2>
        <p>Check back soon, or explore the full journal.</p>
        <Link href={"/blog" as Route}>Back to Insights</Link>
      </div>
    );
  }

  return (
    <div className="blogEmpty" role="status">
      <h2>No published articles yet</h2>
      <p>New journal posts will appear here when they are ready.</p>
    </div>
  );
}
