"use client";

/**
 * Editorial section for Admin RDP story design with emerald-ui motion and Sage & Ink styling.
 */
import { ArdpStoryDesignCard } from "@/features/admin-rdp/components/ArdpStoryDesignCard";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-stories.css";

export function ArdpStoryDesign() {
  const { storyDesign } = ADMIN_RDP;

  return (
    <section
      className="ardpStory py-8 md:py-16"
      aria-labelledby="ardp-story-design"
    >
      <div className="ardpInner">
        <h2 id="ardp-story-design" className="sr-only">
          Access built for operators
        </h2>
        <ArdpStoryDesignCard
          position="left"
          eyebrow={storyDesign.eyebrow}
          titlePrefix="Hands-on"
          titleHighlight="Windows Control"
          imageUrl={storyDesign.image.src}
          primaryCopy={storyDesign.primary}
          secondaryCopy={storyDesign.secondary}
          ctaHref="#vps-plans"
          ctaAriaLabel="Explore Admin RDP hosting plans"
        />
      </div>
    </section>
  );
}
