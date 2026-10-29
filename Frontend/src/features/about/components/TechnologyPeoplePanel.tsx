import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ABOUT_TECH } from "../model/aboutContent";
import { Reveal } from "./Reveal";

export function TechnologyPeoplePanel() {
  return (
    <section
      className="aboutSection aboutSection--canvas"
      aria-labelledby="about-tech-heading"
    >
      <Reveal className="aboutInner">
        <div className="aboutTechPanel" data-reveal>
          <div className="aboutTechCopy">
            <p className="aboutEyebrow aboutEyebrow--onDark">
              {ABOUT_TECH.eyebrow}
            </p>
            <h2 id="about-tech-heading" className="aboutH2">
              {ABOUT_TECH.title}
            </h2>
            {ABOUT_TECH.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <Link href={ABOUT_TECH.link.href} className="aboutTechLink">
              {ABOUT_TECH.link.label}
              <ArrowRight size={16} strokeWidth={2} aria-hidden />
            </Link>
          </div>
          <div className="aboutTechMedia">
            <Image
              src={ABOUT_TECH.image.src}
              alt={ABOUT_TECH.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
