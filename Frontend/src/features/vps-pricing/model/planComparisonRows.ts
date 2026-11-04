import type { FeatureRow } from "@/features/vps-pricing/model/planComparisonData";
import { COMPARISON_FLAG_ROWS } from "@/features/vps-pricing/model/planComparisonRowsFlags";
import { COMPARISON_METRIC_ROWS } from "@/features/vps-pricing/model/planComparisonRowsMetrics";

/** Display order: metrics, then flag rows interleaved as in the original matrix. */
export const COMPARISON_ROWS: FeatureRow[] = [
  ...COMPARISON_METRIC_ROWS.slice(0, 4),
  COMPARISON_FLAG_ROWS[0]!,
  COMPARISON_FLAG_ROWS[1]!,
  ...COMPARISON_METRIC_ROWS.slice(4, 6),
  COMPARISON_FLAG_ROWS[2]!,
  ...COMPARISON_METRIC_ROWS.slice(6, 7),
  COMPARISON_FLAG_ROWS[3]!,
  ...COMPARISON_METRIC_ROWS.slice(7),
];
