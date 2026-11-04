/**
 * Admin RDP power section — feature list + AMD/NVMe schematic.
 */
import {
  ArdpPowerSchematic,
  ardpPowerIcon,
} from "@/features/admin-rdp/components/ardpPowerIcons";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-power.css";

export function ArdpPowerSection() {
  const { title, items } = ADMIN_RDP.power;

  return (
    <section className="ardpPower" aria-labelledby="ardp-power-title">
      <div className="ardpPowerInner">
        <div className="ardpPowerCopy">
          <h2 id="ardp-power-title" className="ardpPowerTitle">
            {title}
          </h2>
          <ul className="ardpPowerList">
            {items.map((item) => (
              <li key={item.id} className="ardpPowerItem">
                <span className="ardpPowerIcon" aria-hidden>
                  {ardpPowerIcon(item.icon)}
                </span>
                <div>
                  <h3 className="ardpPowerItemTitle">{item.title}</h3>
                  <p className="ardpPowerItemBody">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="ardpPowerArt" aria-hidden>
          <ArdpPowerSchematic />
        </div>
      </div>
    </section>
  );
}
