/**
 * Explore what’s possible — hosting feature accordion.
 */
"use client";

import { useEffect, useState } from "react";
import { ShowcaseHeading } from "@/features/feature-showcase/components/ShowcaseHeading";
import { ShowcaseCard } from "@/features/feature-showcase/components/ShowcaseCard";
import { FEATURE_CARDS } from "@/features/feature-showcase/model/showcaseData";
import type { FeatureCardId } from "@/features/feature-showcase/model/types";
import "@/features/feature-showcase/components/feature-showcase.css";
import "@/features/feature-showcase/components/showcase-cards.css";

export function FeatureShowcaseSection() {
  const [activeId, setActiveId] = useState<FeatureCardId>("offers");
  const [pinnedId, setPinnedId] = useState<FeatureCardId | null>(null);
  const [showFullCopy, setShowFullCopy] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1199px)");
    const sync = () => setShowFullCopy(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  function activate(id: FeatureCardId) {
    if (showFullCopy) return;
    setActiveId(id);
  }

  function pin(id: FeatureCardId) {
    setPinnedId(id);
    setActiveId(id);
  }

  function resetDeck() {
    if (showFullCopy) return;
    setActiveId(pinnedId ?? "offers");
  }

  return (
    <section
      className="featureShowcase"
      aria-labelledby="feature-showcase-title"
    >
      <div className="fsContainer">
        <ShowcaseHeading />

        <div
          className="fsDeck"
          role="region"
          aria-label="What we offer"
          onMouseLeave={resetDeck}
        >
          {FEATURE_CARDS.map((card) => (
            <ShowcaseCard
              key={card.id}
              card={card}
              active={activeId === card.id}
              showFullCopy={showFullCopy}
              onActivate={activate}
              onPin={pin}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
