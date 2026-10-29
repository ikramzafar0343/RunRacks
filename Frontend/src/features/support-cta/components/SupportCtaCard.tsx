/**
 * One support/migration CTA card — copy + media + lime-arrow button.
 */
import Image from "next/image";
import Link from "next/link";
import type { SupportCtaCard as SupportCtaCardType } from "@/features/support-cta/model/supportCtaContent";

type SupportCtaCardProps = {
  card: SupportCtaCardType;
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 12L12 4M12 4H6.5M12 4V9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmphasizedBody({
  body,
  emphasis,
}: {
  body: string;
  emphasis?: string | undefined;
}) {
  if (!emphasis) return body;

  const index = body.indexOf(emphasis);
  if (index === -1) return body;

  return (
    <>
      {body.slice(0, index)}
      <strong>{emphasis}</strong>
      {body.slice(index + emphasis.length)}
    </>
  );
}

export function SupportCtaCard({ card }: SupportCtaCardProps) {
  return (
    <article className="supportCtaCard" role="listitem">
      <div className="supportCtaCopy">
        <h3 className="supportCtaHeading">{card.heading}</h3>
        <p className="supportCtaBody">
          {card.emphasis ? (
            <EmphasizedBody body={card.body} emphasis={card.emphasis} />
          ) : (
            card.body
          )}
        </p>
        <Link href={card.href} className="supportCtaBtn">
          {card.ctaLabel}
          <span className="supportCtaBtnIcon">
            <ArrowIcon />
          </span>
        </Link>
      </div>
      <div className="supportCtaMedia">
        <Image
          className="supportCtaMediaImg"
          src={card.imageSrc}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 639px) 90vw, (max-width: 1023px) 280px, 240px"
        />
      </div>
    </article>
  );
}
