import Image from "next/image";

type ArticleCoverProps = {
  src?: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export function ArticleCover({ src, alt, caption, credit }: ArticleCoverProps) {
  if (!src) return null;

  const captionText = [caption, credit].filter(Boolean).join(" — ");

  return (
    <figure className="articleCoverBand">
      <div className="articleCover">
        <Image
          src={src}
          alt={alt}
          fill
          preload
          sizes="(max-width: 900px) 100vw, 1120px"
        />
      </div>
      {captionText ? (
        <figcaption className="articleCoverCaption">{captionText}</figcaption>
      ) : null}
    </figure>
  );
}
