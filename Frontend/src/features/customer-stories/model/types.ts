/**
 * Customer stories — typed records for testimonial carousel.
 */
import type { Route } from "next";

export type CustomerStory = {
  id: string;
  slug: string;
  customerName: string;
  role?: string;
  companyName?: string;
  quote: string;
  brandLogoUrl?: string;
  portraitUrl: string;
  posterUrl?: string;
  videoUrl?: string;
  captionsUrl?: string;
  portraitAlt: string;
  mediaFocalPoint?: string;
  caseStudyHref?: Route;
  displayOrder: number;
  published: boolean;
};

export type CustomerStoriesPayload = {
  source: "demo" | "live";
  notice: string | null;
  stories: CustomerStory[];
};
