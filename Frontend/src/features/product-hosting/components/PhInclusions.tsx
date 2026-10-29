/**
 * Hostinger-style inclusions checklist — honest catalog features only.
 */
import { HiCheck } from "react-icons/hi2";

type PhInclusionsProps = {
  heading: string;
  accent: string;
  items: readonly string[];
  billingDisclosure: string;
};

export function PhInclusions({
  heading,
  accent,
  items,
  billingDisclosure,
}: PhInclusionsProps) {
  return (
    <section className="phSection" aria-labelledby="ph-inclusions-heading">
      <div className="phInner">
        <h2 id="ph-inclusions-heading" className="phInclusionsTitle">
          {heading} <span className="phInclusionsAccent">{accent}</span> and
          more
        </h2>

        <div className="phInclusionsPanel">
          <ul className="phInclusionsList">
            {items.map((item) => (
              <li key={item}>
                <HiCheck className="phInclusionsCheck" size={18} aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="phBillingNote">{billingDisclosure}</p>
      </div>
    </section>
  );
}
