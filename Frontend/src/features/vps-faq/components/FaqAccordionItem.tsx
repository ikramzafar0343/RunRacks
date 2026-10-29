/**
 * Single FAQ row — native details/summary (exclusive via name).
 */
import type { FaqItem } from "@/features/vps-faq/model/faqContent";

type FaqAccordionItemProps = {
  item: FaqItem;
};

export function FaqAccordionItem({ item }: FaqAccordionItemProps) {
  return (
    <li className="vpsFaqItem">
      <details className="vpsFaqDetails" name="vps-faq">
        <summary className="vpsFaqTrigger">
          <span className="vpsFaqQuestion">{item.question}</span>
          <svg
            className="vpsFaqIcon"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 4v12M4 10h12"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </summary>
        <div className="vpsFaqPanelInner">
          <p className="vpsFaqAnswer">{item.answer}</p>
        </div>
      </details>
    </li>
  );
}
