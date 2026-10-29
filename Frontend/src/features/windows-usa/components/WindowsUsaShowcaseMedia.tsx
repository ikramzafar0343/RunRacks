/**
 * Showcase media card — local asset + Sage wash (no brand chip).
 */
import Image from "next/image";

export type WindowsUsaShowcaseMediaProps = {
  mediaSrc: string;
  mediaAlt: string;
  preload?: boolean;
};

export function WindowsUsaShowcaseMedia({
  mediaSrc,
  mediaAlt,
  preload = false,
}: WindowsUsaShowcaseMediaProps) {
  return (
    <div className="winShowcaseMedia" data-win-media>
      <Image
        src={mediaSrc}
        alt={mediaAlt}
        fill
        sizes="(max-width: 767px) 90vw, 400px"
        className="winShowcaseMediaImg"
        {...(preload ? { preload: true } : { loading: "lazy" as const })}
      />
      <div className="winShowcaseMediaWash" aria-hidden />
    </div>
  );
}
