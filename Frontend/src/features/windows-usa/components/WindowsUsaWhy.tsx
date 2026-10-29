/**
 * Why RunRacks Windows VPS in the USA — 3×2 feature grid after pricing.
 */
import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Headset,
  KeyRound,
  LayoutList,
  MapPin,
  SlidersHorizontal,
  Terminal,
} from "lucide-react";
import {
  WINDOWS_USA_WHY,
  type WindowsUsaWhyIconId,
} from "@/features/windows-usa/model/windowsUsaWhy";
import "@/features/windows-usa/components/windows-usa-why.css";

const ICONS: Record<WindowsUsaWhyIconId, LucideIcon> = {
  plans: LayoutList,
  access: KeyRound,
  region: MapPin,
  guest: Terminal,
  filters: SlidersHorizontal,
  support: Headset,
};

export function WindowsUsaWhy() {
  const { heading, lead, items, ctaLabel, ctaHref } = WINDOWS_USA_WHY;

  return (
    <section
      id="windows-usa-why"
      className="winWhy"
      aria-labelledby="windows-usa-why-heading"
    >
      <div className="winWhyDecor" aria-hidden />
      <div className="winWhyInner">
        <header className="winWhyHeader">
          <h2 id="windows-usa-why-heading" className="winWhyHeading">
            {heading}
          </h2>
          <p className="winWhyLead">{lead}</p>
        </header>

        <ul className="winWhyGrid" aria-label="Windows USA hosting benefits">
          {items.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <li key={item.id} className="winWhyItem">
                <span className="winWhyIcon" aria-hidden>
                  <Icon size={28} strokeWidth={1.75} />
                </span>
                <div className="winWhyCopy">
                  <h3 className="winWhyTitle">{item.title}</h3>
                  <p className="winWhyBody">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="winWhyCtaWrap">
          <Link href={ctaHref as Route} className="winWhyCta">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
