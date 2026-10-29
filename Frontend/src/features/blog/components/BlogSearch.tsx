"use client";

/**
 * Search form — submits to URL ?search= for SSR results.
 */
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

type BlogSearchProps = {
  initialQuery?: string;
  basePath?: string;
};

export function BlogSearch({
  initialQuery = "",
  basePath = "/blog",
}: BlogSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = value.trim();
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    const qs = params.toString();
    router.push((qs ? `${basePath}?${qs}` : basePath) as Route);
  }

  function clear() {
    setValue("");
    router.push(basePath as Route);
  }

  return (
    <form className="blogSearch" role="search" onSubmit={submit}>
      <HiMagnifyingGlass className="blogSearchIcon" size={18} aria-hidden />
      <label className="sr-only" htmlFor="blog-search">
        Search articles
      </label>
      <input
        id="blog-search"
        type="search"
        name="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search articles"
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          className="blogSearchClear"
          onClick={clear}
          aria-label="Clear search"
        >
          <HiXMark size={16} aria-hidden />
        </button>
      ) : null}
    </form>
  );
}
