"use client";

import { VPS_USA } from "@/features/vps-usa/model/vpsUsaContent";
import { UsaReveal } from "@/features/vps-usa/components/UsaReveal";

export function VpsUsaAudience() {
  const { eyebrow, heading, columns } = VPS_USA.audience;

  return (
    <section className="usaAudience" aria-labelledby="usa-audience-heading">
      <UsaReveal className="usaInner">
        <header className="usaSectionHead" data-usa-reveal>
          <p className="usaEyebrow">{eyebrow}</p>
          <h2 id="usa-audience-heading" className="usaHeading">
            {heading}
          </h2>
        </header>
        <ul className="usaAudienceGrid">
          {columns.map((col) => (
            <li key={col.id} className="usaAudienceCol" data-usa-reveal>
              <h3 className="usaAudienceTitle">{col.title}</h3>
              <p className="usaAudienceBody">{col.body}</p>
            </li>
          ))}
        </ul>
      </UsaReveal>
    </section>
  );
}
