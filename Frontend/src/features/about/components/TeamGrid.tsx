import Image from "next/image";
import { ABOUT_TEAM, ABOUT_TEAM_INTRO } from "../model/aboutContent";
import { Reveal } from "./Reveal";

export function TeamGrid() {
  return (
    <section
      className="aboutSection aboutSection--canvas"
      aria-labelledby="about-team-heading"
    >
      <div className="aboutInner">
        <Reveal>
          <div data-reveal style={{ marginBottom: "2.5rem" }}>
            <p className="aboutEyebrow">{ABOUT_TEAM_INTRO.eyebrow}</p>
            <h2 id="about-team-heading" className="aboutH2">
              {ABOUT_TEAM_INTRO.title}
            </h2>
            <p className="aboutLeadNarrow">{ABOUT_TEAM_INTRO.lead}</p>
          </div>
          <ul className="aboutTeamGrid">
            {ABOUT_TEAM.map((team) => (
              <li key={team.id} className="aboutTeamCard" data-reveal>
                <div className="aboutTeamMedia">
                  <Image
                    src={team.image.src}
                    alt={team.image.alt}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                  />
                </div>
                <div className="aboutTeamBody">
                  <p className="aboutTeamCat">{team.category}</p>
                  <h3 className="aboutTeamTitle">{team.title}</h3>
                  <p className="aboutTeamText">{team.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
