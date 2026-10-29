import type { ReactNode } from "react";
import type { BlogTocItem } from "../model/types";
import { shouldShowToc } from "../lib/toc";
import { TableOfContents } from "./TableOfContents";

type ArticleReadingLayoutProps = {
  toc: readonly BlogTocItem[];
  children: ReactNode;
};

export function ArticleReadingLayout({
  toc,
  children,
}: ArticleReadingLayoutProps) {
  const showToc = shouldShowToc(toc);

  return (
    <div className="articleReadingGrid">
      {showToc ? (
        <aside className="articleTocAside" aria-label="On this page">
          <TableOfContents items={toc} variant="rail" />
        </aside>
      ) : null}
      <div className="articleMainColumn">
        {showToc ? (
          <div className="articleTocMobile">
            <TableOfContents items={toc} variant="mobile" />
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
