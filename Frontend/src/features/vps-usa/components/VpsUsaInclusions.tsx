"use client";

import { VPS_USA } from "@/features/vps-usa/model/vpsUsaContent";
import { UsaReveal } from "@/features/vps-usa/components/UsaReveal";

export function VpsUsaInclusions() {
  const { eyebrow, heading, items } = VPS_USA.inclusions;

  return (
    <section className="usaInclusions" aria-labelledby="usa-inclusions-heading">
      <UsaReveal className="usaInner usaInclusionsInner">
        <header className="usaSectionHead" data-usa-reveal>
          <p className="usaEyebrow">{eyebrow}</p>
          <h2 id="usa-inclusions-heading" className="usaHeading">
            {heading}
          </h2>
        </header>
        <ul className="usaCheckList">
          {items.map((item) => (
            <li key={item.id} className="usaCheckItem" data-usa-reveal>
              <span className="usaCheckMark" aria-hidden />
              <div>
                <h3 className="usaCheckTitle">{item.title}</h3>
                <p className="usaCheckBody">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </UsaReveal>
    </section>
  );
}
