/**
 * Left editorial quote card for the active customer story.
 */
import Image from "next/image";
import type { CustomerStory } from "@/features/customer-stories/model/types";

type TestimonialQuoteCardProps = {
  story: CustomerStory;
  animateKey: string;
};

export function TestimonialQuoteCard({
  story,
  animateKey,
}: TestimonialQuoteCardProps) {
  return (
    <article className="csQuote" data-key={animateKey}>
      {story.brandLogoUrl ? (
        <div className="csLogoWrap">
          <Image
            className="csLogo"
            src={story.brandLogoUrl}
            alt=""
            width={150}
            height={40}
          />
        </div>
      ) : null}

      <blockquote className="csQuoteText">
        <p>&ldquo;{story.quote}&rdquo;</p>
      </blockquote>

      <footer className="csAttribution">
        <cite className="csName">{story.customerName}</cite>
        {(story.role || story.companyName) && (
          <p className="csMeta">
            {[story.role, story.companyName].filter(Boolean).join(", ")}
          </p>
        )}
      </footer>
    </article>
  );
}
