/**
 * Suspense fallback skeleton for VpsPricingSection.
 */
import "@/features/vps-pricing/components/vps-pricing.css";
import "@/features/vps-pricing/components/vps-plan-cards.css";

type VpsPricingFallbackProps = {
  variant?: "page" | "embedded";
};

export function VpsPricingFallback({
  variant = "page",
}: VpsPricingFallbackProps) {
  const isEmbedded = variant === "embedded";

  return (
    <section
      className="vpsPricingSection"
      data-variant={variant}
      aria-busy="true"
      aria-label="Loading VPS plans"
    >
      <div className="vpsPricingContainer">
        {isEmbedded ? (
          <div className="vpsSkeletonStack">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="vpsSkeletonRow" />
            ))}
          </div>
        ) : (
          <div className="vpsSkeletonCardGrid">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="vpsSkeletonCard" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
