/**
 * Labeled demo customer stories — UI only, not verified testimonials.
 */
import type { Route } from "next";
import type { CustomerStoriesPayload } from "@/features/customer-stories/model/types";
import { getPublishedStories } from "@/features/customer-stories/model/validation";

export function getDemoCustomerStories(): CustomerStoriesPayload {
  const stories = getPublishedStories([
    {
      id: "demo-01",
      slug: "demo-northline",
      customerName: "Alex Rivera",
      role: "Engineering lead",
      companyName: "Northline Labs (demo)",
      quote:
        "We needed hosting that felt predictable under load. The deploy flow stayed simple while we scaled the stack.",
      brandLogoUrl: "/media/customer-stories/demo-01/logo.svg",
      portraitUrl: "/media/customer-stories/demo-01/portrait.jpg",
      portraitAlt:
        "Demo portrait of an engineer at a desk — not a verified customer photo",
      mediaFocalPoint: "center 32%",
      caseStudyHref: "/resources/case-studies" as Route,
      displayOrder: 1,
      published: true,
    },
    {
      id: "demo-02",
      slug: "demo-fieldstack",
      customerName: "Jordan Lee",
      role: "Product manager",
      companyName: "Fieldstack (demo)",
      quote:
        "Admin access and clear plan choices made it easier to move our Windows workloads without guesswork.",
      brandLogoUrl: "/media/customer-stories/demo-02/logo.svg",
      portraitUrl: "/media/customer-stories/demo-02/portrait.jpg",
      portraitAlt:
        "Demo portrait of a product manager in a workspace — not a verified customer photo",
      mediaFocalPoint: "center 35%",
      caseStudyHref: "/resources/case-studies" as Route,
      displayOrder: 2,
      published: true,
    },
  ]);

  return {
    source: "demo",
    notice: "Demo stories — not verified customer testimonials",
    stories,
  };
}
