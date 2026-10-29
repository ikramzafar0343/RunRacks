import { ABOUT_CAPABILITIES } from "../model/aboutContent";
import { Reveal } from "./Reveal";

export function TrustCapabilityStrip() {
  const items = ABOUT_CAPABILITIES.filter((item) => item.verified);
  if (items.length === 0) return null;

  return (
    <section className="aboutStrip" aria-label="What RunRacks offers">
      <Reveal className="aboutInner">
        <ul className="aboutStripGrid">
          {items.map((item) => (
            <li key={item.id} className="aboutStripCell" data-reveal>
              <p className="aboutStripValue">{item.value}</p>
              <p className="aboutStripLabel">{item.label}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
