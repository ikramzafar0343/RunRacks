/**
 * Three benefit cards with decorative SVG art.
 */
import { PhBenefitArt } from "@/features/product-hosting/components/PhBenefitArt";
import type { BenefitCard } from "@/features/product-hosting/model/productHostingContent";

export function PhBenefits({ benefits }: { benefits: readonly BenefitCard[] }) {
  return (
    <section className="phSection phSection--sm" aria-label="Product benefits">
      <div className="phInner">
        <div className="phBenefitsGrid">
          {benefits.map((b) => (
            <article key={b.id} className="phBenefitCard">
              <PhBenefitArt kind={b.art} />
              <h2 className="phBenefitTitle">{b.title}</h2>
              <p className="phBenefitBody">{b.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
