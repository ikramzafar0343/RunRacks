import Link from "next/link";
import type { Route } from "next";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

type ArchivePaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
  search?: string;
};

function hrefFor(basePath: string, page: number, search?: string): Route {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return (qs ? `${basePath}?${qs}` : basePath) as Route;
}

export function ArchivePagination({
  basePath,
  page,
  totalPages,
  search,
}: ArchivePaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Archive pages">
      <ul className="blogPagination">
        <li>
          {page > 1 ? (
            <Link
              href={hrefFor(basePath, page - 1, search)}
              aria-label="Previous page"
            >
              <HiChevronLeft size={16} aria-hidden />
            </Link>
          ) : (
            <span aria-disabled="true" aria-label="Previous page">
              <HiChevronLeft size={16} aria-hidden />
            </span>
          )}
        </li>
        {pages.map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page">{n}</span>
            ) : (
              <Link href={hrefFor(basePath, n, search)}>{n}</Link>
            )}
          </li>
        ))}
        <li>
          {page < totalPages ? (
            <Link
              href={hrefFor(basePath, page + 1, search)}
              aria-label="Next page"
            >
              <HiChevronRight size={16} aria-hidden />
            </Link>
          ) : (
            <span aria-disabled="true" aria-label="Next page">
              <HiChevronRight size={16} aria-hidden />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
