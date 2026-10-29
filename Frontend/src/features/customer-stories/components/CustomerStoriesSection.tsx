/**
 * Get to know our customers — demo-labeled testimonial carousel.
 */
import Link from "next/link";
import type { Route } from "next";
import { CustomerStoryCarousel } from "@/features/customer-stories/components/CustomerStoryCarousel";
import { getDemoCustomerStories } from "@/features/customer-stories/model/demoStories";
import "@/features/customer-stories/components/customer-stories.css";
import "@/features/customer-stories/components/customer-stories-cards.css";

const CASE_STUDIES_HREF = "/resources/case-studies" as Route;

export function CustomerStoriesSection() {
  const payload = getDemoCustomerStories();
  if (payload.stories.length === 0) return null;

  return (
    <section
      className="customerStories"
      aria-labelledby="customer-stories-heading"
    >
      <header className="csHeader">
        <h2 id="customer-stories-heading" className="csHeading">
          Get to know our customers
        </h2>
        <p className="csIntro">
          Discover the people behind the projects. Hear their experiences and
          see what we built together.
        </p>
        {payload.source === "demo" && payload.notice ? (
          <p className="csDemoNotice" role="note">
            {payload.notice}
          </p>
        ) : null}
      </header>

      <CustomerStoryCarousel stories={payload.stories} />

      <div className="csCtaWrap">
        <Link href={CASE_STUDIES_HREF} className="csCta">
          <span className="csCtaLabel">See all case studies</span>
          <span className="csCtaTile" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3.5 8h9M8.5 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
