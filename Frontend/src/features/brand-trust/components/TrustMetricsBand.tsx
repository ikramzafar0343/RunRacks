/**
 * Full-width connector line + four trust metrics.
 */
import { TrustMetricItem } from "@/features/brand-trust/components/TrustMetricItem";
import type {
  TrustAvatar,
  TrustMetric,
} from "@/features/brand-trust/model/brandTrustContent";

type TrustMetricsBandProps = {
  metrics: readonly TrustMetric[];
  avatars: readonly TrustAvatar[];
};

export function TrustMetricsBand({ metrics, avatars }: TrustMetricsBandProps) {
  return (
    <div className="trustTimeline">
      <div className="trustDots" aria-hidden="true">
        <span className="trustDot" />
        <span className="trustDot" />
        <span className="trustDot" />
      </div>
      <div className="trustMetricsGrid">
        {metrics.map((metric) => (
          <TrustMetricItem key={metric.id} metric={metric} avatars={avatars} />
        ))}
      </div>
    </div>
  );
}
