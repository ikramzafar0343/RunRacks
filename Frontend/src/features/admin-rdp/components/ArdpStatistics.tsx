/**
 * Admin RDP metrics strip.
 */
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-stats.css";

export function ArdpStatistics() {
  const { stats } = ADMIN_RDP;
  return (
    <section className="ardpStats" aria-labelledby="ardp-stats-heading">
      <div className="ardpInner">
        <p className="ardpEyebrow">{stats.eyebrow}</p>
        <h2 id="ardp-stats-heading" className="sr-only">
          Admin RDP at a glance
        </h2>
        <ul className="ardpStatsGrid">
          {stats.items.map((item) => (
            <li key={item.value + item.caption}>
              <span className="ardpStatValue">{item.value}</span>
              <span className="ardpStatCaption">{item.caption}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
