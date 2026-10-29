/**
 * About Us — editorial brand story.
 */
import type { Metadata } from "next";
import { AboutPage } from "@/features/about/components/AboutPage";
import { ABOUT_META } from "@/features/about/model/aboutContent";

export const metadata: Metadata = {
  title: ABOUT_META.title,
  description: ABOUT_META.description,
  alternates: { canonical: "/about" },
};

export default function AboutRoutePage() {
  return (
    <main className="flex flex-1 flex-col">
      <AboutPage />
    </main>
  );
}
