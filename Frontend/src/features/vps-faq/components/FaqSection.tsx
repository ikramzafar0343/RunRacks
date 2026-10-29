/**
 * VPS hosting FAQ accordion — Sage & Ink, native exclusive details.
 * Optional `content` lets product pages supply their own Q&A set.
 */
import { FaqAccordionItem } from "@/features/vps-faq/components/FaqAccordionItem";
import { VPS_FAQ, type FaqItem } from "@/features/vps-faq/model/faqContent";
import "@/features/vps-faq/components/faq.css";

export type FaqSectionContent = {
  heading: string;
  items: readonly FaqItem[];
};

export type FaqSectionProps = {
  content?: FaqSectionContent;
  /** Use on `/faq`, where this section is the page heading. */
  page?: boolean;
};

export function FaqSection({ content, page = false }: FaqSectionProps = {}) {
  const faq = content ?? VPS_FAQ;
  const Heading = page ? "h1" : "h2";

  return (
    <section
      className={page ? "vpsFaq vpsFaq--page" : "vpsFaq"}
      aria-labelledby="vps-faq-heading"
    >
      <div className="vpsFaqInner">
        <Heading id="vps-faq-heading" className="vpsFaqHeading">
          {faq.heading}
        </Heading>
        <ul className="vpsFaqList">
          {faq.items.map((item) => (
            <FaqAccordionItem key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
