"use client";

import { UsaReveal } from "@/features/vps-usa/components/UsaReveal";
import { VpsUsaWhyCards } from "@/features/vps-usa/components/VpsUsaWhyCards";
import { VPS_USA } from "@/features/vps-usa/model/vpsUsaContent";

export function VpsUsaWhy() {
  const { eyebrow, heading, lead, reasons } = VPS_USA.why;

  return (
    <section className="usaWhy" aria-labelledby="usa-why-heading">
      <div className="usaInner usaWhyInner">
        <UsaReveal>
          <header className="usaSectionHead" data-usa-reveal>
            <p className="usaEyebrow">{eyebrow}</p>
            <h2 id="usa-why-heading" className="usaHeading">
              {heading}
            </h2>
            <p className="usaLead">{lead}</p>
          </header>
        </UsaReveal>
        <VpsUsaWhyCards reasons={reasons} />
      </div>
    </section>
  );
}
