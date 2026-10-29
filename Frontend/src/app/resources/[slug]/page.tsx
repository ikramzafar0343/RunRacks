import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CaseStudiesPage } from "@/features/customer-stories/components/CaseStudiesPage";

/** Blog permanently redirects to /blog via next.config. */
const resourcePages = {
  "case-studies": {
    title: "Case studies",
    description:
      "On-site demo stories already shown on RunRacks. Not verified customer testimonials.",
  },
} as const;

type ResourceSlug = keyof typeof resourcePages;

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(resourcePages).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = resourcePages[slug as ResourceSlug];
  if (!page) {
    return { title: "Resources | RunRacks" };
  }
  return { title: page.title, description: page.description };
}

async function ResourcePageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = resourcePages[slug as ResourceSlug];
  if (!page) {
    notFound();
  }
  if (slug === "case-studies") {
    return <CaseStudiesPage />;
  }

  notFound();
}

export default function ResourcePage({ params }: ResourcePageProps) {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-full w-full flex-1"
          aria-busy="true"
          aria-label="Loading resource"
        />
      }
    >
      <ResourcePageContent params={params} />
    </Suspense>
  );
}
