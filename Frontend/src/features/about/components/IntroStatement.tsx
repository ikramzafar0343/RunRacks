import { ABOUT_INTRO } from "../model/aboutContent";
import { Reveal } from "./Reveal";

export function IntroStatement() {
  return (
    <section
      className="aboutSection aboutSection--canvas"
      aria-labelledby="about-intro-heading"
    >
      <Reveal className="aboutInner aboutIntroGrid">
        <div data-reveal>
          <p className="aboutEyebrow">{ABOUT_INTRO.eyebrow}</p>
          <h2 id="about-intro-heading" className="aboutH2">
            {ABOUT_INTRO.title}
          </h2>
        </div>
        <div className="aboutIntroCopy" data-reveal>
          <p>{ABOUT_INTRO.lead}</p>
          <p>{ABOUT_INTRO.secondary}</p>
          <p className="aboutIntroSig">{ABOUT_INTRO.signature}</p>
        </div>
      </Reveal>
    </section>
  );
}
