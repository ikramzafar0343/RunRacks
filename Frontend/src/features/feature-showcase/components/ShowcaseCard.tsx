/**
 * Single showcase tile — selection control + CTA stay separate.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(card.videoSrc);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !card.videoSrc) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maxSeconds = card.videoMaxSeconds;

    function syncPlayback() {
      if (!video) return;
      if (motion.matches) {
        video.pause();
        return;
      }
      video.muted = true;
      void video.play().catch(() => {
        /* Autoplay can be blocked; first decoded frame still shows. */
      });
    }

    function onReady() {
      if (!video) return;
      if (video.currentTime < 0.05) video.currentTime = 0.05;
      syncPlayback();
    }

    function onTimeUpdate() {
      if (maxSeconds == null || !video) return;
      if (video.currentTime >= maxSeconds) {
        video.currentTime = 0.05;
        void video.play().catch(() => {});
      }
    }

    video.addEventListener("loadeddata", onReady);
    if (maxSeconds != null) {
      video.loop = false;
      video.addEventListener("timeupdate", onTimeUpdate);
    }
    if (video.readyState >= 2) onReady();
    else syncPlayback();

    motion.addEventListener("change", syncPlayback);
    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("timeupdate", onTimeUpdate);
      motion.removeEventListener("change", syncPlayback);
    };
  }, [card.videoSrc, card.videoMaxSeconds]);

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
        {hasVideo ? (
          <video
            ref={videoRef}
            className="fsMedia fsMediaVideo"
            src={card.videoSrc}
            muted
            loop={card.videoMaxSeconds == null}
            playsInline
            autoPlay
            preload="auto"
            style={{ objectPosition: card.imagePosition }}
            aria-label={isDecorativeImage ? undefined : card.imageAlt}
          />
        ) : (
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
        )}
      </div>

      <div className="fsVignette" aria-hidden="true" />

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
