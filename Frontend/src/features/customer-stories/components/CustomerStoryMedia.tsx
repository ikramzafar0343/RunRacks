/**
 * Portrait / optional video card — play only when a real videoUrl exists.
 * Client boundary is CustomerStoryCarousel (parent).
 */
import Image from "next/image";
import { useRef, useState } from "react";
import type { CustomerStory } from "@/features/customer-stories/model/types";

type CustomerStoryMediaProps = {
  story: CustomerStory;
  animateKey: string;
};

export function CustomerStoryMedia({
  story,
  animateKey,
}: CustomerStoryMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(story.videoUrl);
  const poster = story.posterUrl ?? story.portraitUrl;

  function startPlay() {
    const video = videoRef.current;
    if (!video || !story.videoUrl) return;
    setPlaying(true);
    void video.play().catch(() => setPlaying(false));
  }

  return (
    <article className="csMedia" data-key={animateKey}>
      {!playing || !hasVideo ? (
        <Image
          className="csMediaImage"
          src={poster}
          alt={story.portraitAlt}
          fill
          sizes="(max-width: 767px) 100vw, 342px"
          style={{ objectPosition: story.mediaFocalPoint ?? "center 35%" }}
        />
      ) : null}

      {hasVideo ? (
        <>
          <video
            ref={videoRef}
            className="csMediaVideo"
            src={story.videoUrl}
            poster={poster}
            controls={playing}
            playsInline
            preload="none"
            hidden={!playing}
          >
            {story.captionsUrl ? (
              <track
                kind="captions"
                src={story.captionsUrl}
                srcLang="en"
                label="Captions"
              />
            ) : null}
          </video>
          {!playing ? (
            <button
              type="button"
              className="csPlay"
              aria-label="Play customer story"
              onClick={startPlay}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5 3.5v11l10-5.5L5 3.5Z" />
              </svg>
            </button>
          ) : null}
        </>
      ) : null}
    </article>
  );
}
