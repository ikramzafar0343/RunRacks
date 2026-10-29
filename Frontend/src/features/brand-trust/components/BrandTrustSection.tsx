/**
 * Brand promise reel + demo-labeled trust metrics (Sage & Ink).
 */
import { PromiseReel } from "@/features/brand-trust/components/PromiseReel";
import { TrustMetricsBand } from "@/features/brand-trust/components/TrustMetricsBand";
import { BRAND_TRUST } from "@/features/brand-trust/model/brandTrustContent";
import "@/features/brand-trust/components/brand-trust.css";
import "@/features/brand-trust/components/brand-trust-metrics.css";

function CurvedArrow() {
  return (
    <div className="brandArrow" aria-hidden="true">
      <svg viewBox="0 0 30 36" fill="none">
        <path
          d="M4 6c10 2 18 10 18 22"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M16 24l6 4-1.5-7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function BrandTrustSection() {
  const content = BRAND_TRUST;

  return (
    <section className="brandTrust" aria-label="Why customers choose RunRacks">
      <p className="brandTrustNotice" role="note">
        {content.notice}
      </p>

      <div className="promiseStage">
        <div className="promiseInner">
          <p className="brandWordmark">{content.brandName}</p>
          <CurvedArrow />
          <PromiseReel
            promises={content.promises}
            initialIndex={content.initialPromiseIndex}
          />
        </div>
      </div>

      <TrustMetricsBand metrics={content.metrics} avatars={content.avatars} />
    </section>
  );
}
