/**
 * Labeled demo infrastructure stats — UI development only, not live telemetry.
 */
import type {
  StatCardId,
  StatsPayload,
} from "@/features/statistics/model/types";

export function getDemoStats(): StatsPayload {
  return {
    source: "demo",
    notice: "Demo stats — not live",
    asOf: null,
    stats: {
      cpu: {
        usagePercent: { amount: 26.49, unit: "%", decimals: 2 },
        cores: 3480,
        averageTempC: { amount: 76.15, unit: "°C", decimals: 2 },
      },
      ram: {
        total: { amount: 20.53, unit: "TB", decimals: 2 },
        free: { amount: 7341.05, unit: "GB", decimals: 2 },
        type: "DDR5",
      },
      traffic: {
        inbound: { amount: 23.24, unit: "Gbps", decimals: 2 },
        outbound: { amount: 19.17, unit: "Gbps", decimals: 2 },
      },
      storage: {
        provisioned: { amount: 528.52, unit: "TB", decimals: 2 },
        used: { amount: 151.47, unit: "TB", decimals: 2 },
      },
      read: {
        throughput: { amount: 569.47, unit: "MB/s", decimals: 2 },
        iops: 20405.93,
      },
      write: {
        throughput: { amount: 2379.24, unit: "MB/s", decimals: 2 },
        iops: 164882.37,
      },
      power: {
        estimatedDraw: { amount: 23.81, unit: "kW", decimals: 2 },
        sustainabilityNote: "Power estimate",
      },
    },
  };
}

export const STAT_HELP: Record<StatCardId, string> = {
  cpu: "Average CPU utilization across hypervisors in the demo catalog. Not live platform telemetry.",
  ram: "Total hypervisor memory capacity in the demo catalog, with free capacity and memory type.",
  traffic:
    "Demo inbound and outbound network throughput across the platform edge.",
  storage: "Provisioned NVMe capacity and used space from the demo catalog.",
  read: "Demo sequential read throughput and IOPS for NVMe storage.",
  write: "Demo sequential write throughput and IOPS for NVMe storage.",
  power:
    "Estimated aggregate power draw for the demo fleet. Not a live meter reading.",
};
