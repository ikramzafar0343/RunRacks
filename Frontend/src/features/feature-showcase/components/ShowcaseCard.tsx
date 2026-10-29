/**
 * Single showcase tile — selection control + CTA stay separate.
 */
import Image from "next/image";
import Link from "next/link";
import type { FeatureCard } from "@/features/feature-showcase/model/types";

type ShowcaseCardProps = {
  card: FeatureCard;
  active: boolean;
  showFullCopy: boolean;
  onActivate: (id: FeatureCard["id"]) => void;
  onPin: (id: FeatureCard["id"]) => void;
};

function ArrowIcon() {
  return (
    <svg
      className="fsArrow"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 11L11 3M11 3H5.5M11 3V8.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShowcaseCard({
  card,
  active,
  showFullCopy,
  onActivate,
  onPin,
}: ShowcaseCardProps) {
  const reveal = active || showFullCopy;
  const isDecorativeImage = card.imageAlt === "";

  return (
    <article
      className="fsCard"
      data-theme={card.theme}
      data-active={active ? "true" : "false"}
      data-reveal={reveal ? "true" : "false"}
      onMouseEnter={() => onActivate(card.id)}
      onFocusCapture={() => onActivate(card.id)}
    >
      <div className="fsCardBg" aria-hidden="true" />

      <div className="fsMediaWrap" aria-hidden={isDecorativeImage}>
        <Image
          className="fsMedia"
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
          loading={active ? "eager" : "lazy"}
          fetchPriority={active ? "auto" : "low"}
          style={{ objectPosition: card.imagePosition }}
        />
      </div>

      <div className="fsVignette" aria-hidden="true" />

      <span className="fsBadge">{card.label}</span>

      <button
        type="button"
        className="fsSelect"
        aria-pressed={active}
        aria-label={`Show ${card.label}`}
        onClick={() => onPin(card.id)}
      />

      <div className="fsContent">
        <h3 className="fsTitleSr">{card.title}</h3>
        {reveal ? (
          <Link href={card.href} className="fsCta">
            {card.ctaLabel}
            <ArrowIcon />
          </Link>
        ) : (
          <p className="fsTeaser">{card.teaser}</p>
        )}
      </div>
    </article>
  );
}
