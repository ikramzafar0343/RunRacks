/**
 * Presentation formatting for infrastructure metric values.
 */
import type { MetricValue } from "@/features/statistics/model/types";

const NBSP = "\u00A0";

export function formatMetricValue(value: MetricValue): string {
  if (value.amount == null || !Number.isFinite(value.amount)) {
    return "—";
  }

  const decimals = value.decimals ?? (Number.isInteger(value.amount) ? 0 : 2);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value.amount);

  if (!value.unit) return formatted;
  if (value.unit === "%") return `${formatted}%`;
  return `${formatted}${NBSP}${value.unit}`;
}

export function formatIntegerCount(value: number | null, suffix = ""): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
  return suffix ? `${formatted}${NBSP}${suffix}` : formatted;
}

export function formatIops(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted}${NBSP}IOPS`;
}
