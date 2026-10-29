import Link from "next/link";
import type { Route } from "next";
import { Fragment } from "react";

type Crumb = {
  label: string;
  href?: Route;
};

type ArticleBreadcrumbsProps = {
  items: readonly Crumb[];
};

export function ArticleBreadcrumbs({ items }: ArticleBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb">
      <ol className="articleBreadcrumbs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li className="articleCrumbSep" aria-hidden>
                  /
                </li>
              ) : null}
              <li>
                {item.href && !isLast ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <span aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
