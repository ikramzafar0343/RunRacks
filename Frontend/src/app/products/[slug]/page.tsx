/**
 * Unknown product slugs 404. VPS and Windows use dedicated routes.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

/** Cache Components requires at least one static param. */
export function generateStaticParams() {
  return [{ slug: "_unavailable" }];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Product (${slug}) | RunRacks` };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await params;
  notFound();
}
