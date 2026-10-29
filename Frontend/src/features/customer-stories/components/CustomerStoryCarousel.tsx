/**
 * Two-card customer story carousel — synced quote + media.
 */
"use client";

import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import { CarouselArrow } from "@/features/customer-stories/components/CarouselArrow";
import { CustomerStoryMedia } from "@/features/customer-stories/components/CustomerStoryMedia";
import { TestimonialQuoteCard } from "@/features/customer-stories/components/TestimonialQuoteCard";
import type { CustomerStory } from "@/features/customer-stories/model/types";

type CustomerStoryCarouselProps = {
  stories: CustomerStory[];
};

export function CustomerStoryCarousel({ stories }: CustomerStoryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const showNav = stories.length >= 2;
  const story = stories[activeIndex] ?? stories[0];

  const goTo = useCallback(
    (next: number) => {
      if (!showNav || animating || !stories.length) return;
      const length = stories.length;
      const index = ((next % length) + length) % length;
      if (index === activeIndex) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        setActiveIndex(index);
        return;
      }

      setAnimating(true);
      window.setTimeout(() => {
        setActiveIndex(index);
        setAnimating(false);
      }, 160);
    },
    [activeIndex, animating, showNav, stories.length],
  );

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!showNav) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  }

  function onTouchStart(event: TouchEvent) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent) {
    if (touchStartX.current == null || !showNav) return;
    const endX = event.changedTouches[0]?.clientX;
    if (endX == null) return;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    goTo(delta < 0 ? activeIndex + 1 : activeIndex - 1);
  }

  if (!story) return null;

  return (
    <div
      className="csStage"
      ref={stageRef}
      onKeyDown={onKeyDown}
      tabIndex={showNav ? 0 : undefined}
      aria-roledescription="carousel"
      aria-label="Customer stories"
    >
      {showNav ? (
        <CarouselArrow
          direction="prev"
          className="csArrowDesktop"
          onClick={() => goTo(activeIndex - 1)}
        />
      ) : null}

      <div
        className={`csCards${animating ? " csCards--exit" : " csCards--enter"}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <TestimonialQuoteCard story={story} animateKey={story.id} />
        <CustomerStoryMedia
          key={story.id}
          story={story}
          animateKey={story.id}
        />
      </div>

      {showNav ? (
        <CarouselArrow
          direction="next"
          className="csArrowDesktop"
          onClick={() => goTo(activeIndex + 1)}
        />
      ) : null}

      {showNav ? (
        <div className="csMobileNav">
          <CarouselArrow
            direction="prev"
            onClick={() => goTo(activeIndex - 1)}
          />
          <CarouselArrow
            direction="next"
            onClick={() => goTo(activeIndex + 1)}
          />
        </div>
      ) : null}

      <p className="csSrOnly" aria-live="polite" aria-atomic="true">
        {story.customerName}
        {story.companyName ? `, ${story.companyName}` : ""}
      </p>
    </div>
  );
}
