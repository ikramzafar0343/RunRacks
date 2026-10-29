/**
 * Post-FAQ dual CTA — support engineers + migration help.
 * Optional `content` lets product pages supply tailored copy.
 */
import { SupportCtaCard } from "@/features/support-cta/components/SupportCtaCard";
import {
  SUPPORT_CTA,
  type SupportCtaCard as SupportCtaCardModel,
} from "@/features/support-cta/model/supportCtaContent";
import "@/features/support-cta/components/support-cta.css";
import "@/features/support-cta/components/support-cta-slider.css";

export type SupportCtaContent = {
  cards: readonly SupportCtaCardModel[];
};

export type SupportCtaSectionProps = {
  content?: SupportCtaContent;
};

export function SupportCtaSection({ content }: SupportCtaSectionProps = {}) {
  const data = content ?? SUPPORT_CTA;

  return (
    <section
      className="supportCta"
      aria-label="Talk to RunRacks and migrate with help"
    >
      <div
        className="supportCtaInner"
        role="list"
        aria-label="Support and migration options"
      >
        {data.cards.map((card) => (
          <SupportCtaCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
