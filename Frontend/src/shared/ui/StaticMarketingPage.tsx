/**
 * Minimal real page shell for nav destinations (no fake forms/APIs).
 */
import Link from "next/link";

type StaticMarketingPageProps = {
  title: string;
  description: string;
};

export function StaticMarketingPage({
  title,
  description,
}: StaticMarketingPageProps) {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col px-6 pb-16 pt-28 md:pt-32">
      <h1 className="font-sans text-3xl font-medium tracking-tight text-heading md:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-body md:text-lg">
        {description}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex w-fit items-center justify-center rounded-[11px] bg-brand px-5 py-3 text-sm font-semibold text-brand-contrast transition-colors hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        Back to home
      </Link>
    </main>
  );
}
