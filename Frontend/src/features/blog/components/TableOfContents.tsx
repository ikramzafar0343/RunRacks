"use client";

/**
 * TOC with native anchors; client enhances active section + mobile collapse.
 */
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import type { BlogTocItem } from "../model/types";

type TableOfContentsProps = {
  items: readonly BlogTocItem[];
  variant?: "rail" | "mobile";
};

export function TableOfContents({
  items,
  variant = "rail",
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (items.length < 2) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );
        const top = visible[0]?.target;
        if (top?.id) setActiveId(top.id);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 1],
      },
    );

    for (const el of headings) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  function onNavClick(event: MouseEvent<HTMLAnchorElement>) {
    if (variant !== "mobile") return;
    const details = detailsRef.current;
    if (details?.open) {
      // Defer close so hash navigation completes.
      window.requestAnimationFrame(() => {
        details.open = false;
      });
    }
    const href = event.currentTarget.getAttribute("href");
    if (href?.startsWith("#")) {
      const id = href.slice(1);
      setActiveId(id);
    }
  }

  if (items.length < 2) return null;

  const nav = (
    <nav className="articleTocNav" aria-label="Table of contents">
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={item.level === 3 ? "articleTocL3" : undefined}
              aria-current={activeId === item.id ? "location" : undefined}
              onClick={onNavClick}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );

  if (variant === "rail") {
    return (
      <div className="articleToc">
        <p className="articleTocSummary" id={panelId}>
          On this page
        </p>
        {nav}
      </div>
    );
  }

  return (
    <details ref={detailsRef} className="articleToc">
      <summary className="articleTocSummary">On this page</summary>
      {nav}
    </details>
  );
}
