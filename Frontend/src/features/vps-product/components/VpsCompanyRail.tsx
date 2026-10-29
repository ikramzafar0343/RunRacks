"use client";

/**
 * Company card rail — seamless CSS marquee.
 */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  VPS_PRODUCT,
  type RailCard,
} from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-company-rail.css";

function RailCardView({
  card,
  decorative,
  loadPreview,
}: {
  card: RailCard;
  decorative?: boolean;
  loadPreview: boolean;
}) {
  if (card.type === "photo") {
    return (
      <article
        className="vpsRailCard"
        data-height={card.height}
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : (card.caption ?? card.image.alt)}
      >
        <div className="vpsRailCardMedia">
          <Image
            src={card.image.src}
            alt={decorative ? "" : card.image.alt}
            fill
            sizes="430px"
            style={{ objectPosition: card.image.objectPosition }}
          />
          {card.caption ? (
            <p className="vpsRailCardCaption">{card.caption}</p>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <article
      className="vpsRailCard"
      data-type="message"
      data-height={card.height}
      data-accent={card.accent ? "true" : "false"}
      aria-hidden={decorative ? true : undefined}
      tabIndex={decorative ? undefined : 0}
    >
      <div className="vpsRailCardBody">
        <h3 className="vpsRailCardTitle">{card.title}</h3>
        <p className="vpsRailCardText">{card.body}</p>
      </div>
      <div className="vpsRailCardPreview" aria-hidden="true">
        {loadPreview ? (
          <span className="vpsRailCardPreviewFrame">
            <Image
              src={card.preview.src}
              alt=""
              fill
              sizes="200px"
              loading="lazy"
              quality={75}
              style={{ objectPosition: card.preview.objectPosition }}
            />
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function VpsCompanyRail() {
  const { rail } = VPS_PRODUCT;
  const rootRef = useRef<HTMLElement>(null);
  const [offscreen, setOffscreen] = useState(true);
  const [loadPreviews, setLoadPreviews] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") {
      setOffscreen(false);
      setLoadPreviews(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setOffscreen(!visible);
        if (visible) setLoadPreviews(true);
      },
      { rootMargin: "120px 0px", threshold: 0 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="vpsCompanyRail"
      id="vps-company-rail"
      aria-label={rail.label}
    >
      <div
        className="vpsCompanyRailViewport"
        data-paused={offscreen ? "true" : "false"}
      >
        <div className="vpsCompanyRailTrack">
          {rail.cards.map((card) => (
            <RailCardView
              key={card.id}
              card={card}
              loadPreview={loadPreviews}
            />
          ))}
          {rail.cards.map((card) => (
            <RailCardView
              key={`clone-${card.id}`}
              card={card}
              decorative
              loadPreview={loadPreviews}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
