/**
 * RunRacks infrastructure statistics — demo metrics, Sage/hero atmosphere.
 */
import { HiOutlineFire, HiOutlineChartBar } from "react-icons/hi2";
import { StatisticsCard } from "@/features/statistics/components/StatisticsCard";
import { getDemoStats, STAT_HELP } from "@/features/statistics/model/demoStats";
import {
  formatIntegerCount,
  formatIops,
  formatMetricValue,
} from "@/features/statistics/model/formatMetric";
import "@/features/statistics/components/statistics.css";
import "@/features/statistics/components/statistics-cards.css";

export function StatisticsSection() {
  const payload = getDemoStats();
  const { stats } = payload;

  return (
    <section className="statisticsSection" aria-labelledby="statistics-title">
      <div className="statsContainer">
        <header className="statsHeading">
          <h2 id="statistics-title" className="statsTitle">
            RUNRACKS STATISTICS
          </h2>
          <p className="statsSubtitle">
            A peek into our highly performing NVMe VPS platform
          </p>
          {payload.source === "demo" ? (
            <p className="statsDemoNotice" role="note">
              {payload.notice}
            </p>
          ) : null}
        </header>

        <div
          className="statsPrimary"
          role="region"
          aria-label="Primary statistics"
        >
          <StatisticsCard
            id="cpu"
            label="CPU"
            help={STAT_HELP.cpu}
            primary={{
              value: formatMetricValue(stats.cpu.usagePercent),
              description: "Average Hypervisor CPU Usage",
            }}
            footerLines={[
              `${formatIntegerCount(stats.cpu.cores)} total cores`,
              `${formatMetricValue(stats.cpu.averageTempC)} average temp`,
            ]}
            footerGlyph={<HiOutlineFire size={12} />}
            footerGlyphIndex={1}
          />
          <StatisticsCard
            id="ram"
            label="RAM"
            help={STAT_HELP.ram}
            primary={{
              value: formatMetricValue(stats.ram.total),
              description: "Hypervisor RAM",
            }}
            footerLines={[`${formatMetricValue(stats.ram.free)} free`]}
            badge={stats.ram.type}
          />
          <StatisticsCard
            id="traffic"
            label="TRAFFIC"
            help={STAT_HELP.traffic}
            primary={{
              value: formatMetricValue(stats.traffic.inbound),
              description: "Inbound Traffic",
            }}
            secondary={{
              value: formatMetricValue(stats.traffic.outbound),
              description: "Outbound Traffic",
            }}
          />
        </div>

        <div
          className="statsSecondary"
          role="region"
          aria-label="Secondary statistics"
        >
          <StatisticsCard
            id="storage"
            label="STORAGE"
            help={STAT_HELP.storage}
            primary={{
              value: formatMetricValue(stats.storage.provisioned),
              description: "Provisioned NVMe Disk Space",
            }}
            footerLines={[`${formatMetricValue(stats.storage.used)} used`]}
          />
          <StatisticsCard
            id="read"
            label="READ"
            help={STAT_HELP.read}
            primary={{
              value: formatMetricValue(stats.read.throughput),
              description: "Read Speed",
            }}
            footerLines={[formatIops(stats.read.iops)]}
            footerGlyph={<HiOutlineChartBar size={12} />}
          />
          <StatisticsCard
            id="write"
            label="WRITE"
            help={STAT_HELP.write}
            primary={{
              value: formatMetricValue(stats.write.throughput),
              description: "Write Speed",
            }}
            footerLines={[formatIops(stats.write.iops)]}
            footerGlyph={<HiOutlineChartBar size={12} />}
          />
          <StatisticsCard
            id="power"
            label="POWER"
            help={STAT_HELP.power}
            primary={{
              value: formatMetricValue(stats.power.estimatedDraw),
              description: "Estimated Power Draw",
            }}
            footerLines={
              stats.power.sustainabilityNote
                ? [stats.power.sustainabilityNote]
                : []
            }
          />
        </div>
      </div>
    </section>
  );
}
