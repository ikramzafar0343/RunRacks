/**
 * Infrastructure statistics contracts (demo now; live later).
 */

export type MetricValue = {
  amount: number | null;
  unit: string;
  decimals?: number;
};

export type InfrastructureStats = {
  cpu: {
    usagePercent: MetricValue;
    cores: number | null;
    averageTempC: MetricValue;
  };
  ram: {
    total: MetricValue;
    free: MetricValue;
    type: string | null;
  };
  traffic: {
    inbound: MetricValue;
    outbound: MetricValue;
  };
  storage: {
    provisioned: MetricValue;
    used: MetricValue;
  };
  read: {
    throughput: MetricValue;
    iops: number | null;
  };
  write: {
    throughput: MetricValue;
    iops: number | null;
  };
  power: {
    estimatedDraw: MetricValue;
    sustainabilityNote: string | null;
  };
};

export type StatsPayload = {
  source: "demo" | "live";
  notice: string;
  asOf: string | null;
  stats: InfrastructureStats;
};

export type StatCardId =
  "cpu" | "ram" | "traffic" | "storage" | "read" | "write" | "power";
