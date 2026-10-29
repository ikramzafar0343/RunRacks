import Image from "next/image";
import { ABOUT_VALUES, ABOUT_VALUES_INTRO } from "../model/aboutContent";
import { Reveal } from "./Reveal";

export function ValuesGrid() {
  return (
    <section
      className="aboutSection aboutSection--surface"
      aria-labelledby="about-values-heading"
    >
      <div className="aboutInner">
        <Reveal>
          <div data-reveal style={{ marginBottom: "2.5rem" }}>
            <p className="aboutEyebrow">{ABOUT_VALUES_INTRO.eyebrow}</p>
            <h2 id="about-values-heading" className="aboutH2">
              {ABOUT_VALUES_INTRO.title}
            </h2>
            <p className="aboutLeadNarrow">{ABOUT_VALUES_INTRO.description}</p>
          </div>
          <ul className="aboutValuesGrid">
            {ABOUT_VALUES.map((value) => (
              <li key={value.id} className="aboutValueCard" data-reveal>
                <div className="aboutValueMedia">
                  <Image
                    src={value.image.src}
                    alt={value.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="aboutValueBody">
                  <h3 className="aboutValueTitle">{value.title}</h3>
                  <p className="aboutValueText">{value.description}</p>
                  <span className="aboutValueAccent" aria-hidden />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
