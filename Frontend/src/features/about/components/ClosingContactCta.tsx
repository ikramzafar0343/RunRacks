import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ABOUT_CTA } from "../model/aboutContent";
import { Reveal } from "./Reveal";

export function ClosingContactCta() {
  return (
    <section
      className="aboutSection aboutSection--canvas aboutPageBottom"
      aria-labelledby="about-cta-heading"
    >
      <Reveal className="aboutInner">
        <div className="aboutCtaPanel" data-reveal>
          <div>
            <p className="aboutEyebrow aboutEyebrow--onDark">
              {ABOUT_CTA.eyebrow}
            </p>
            <h2 id="about-cta-heading" className="aboutH2">
              {ABOUT_CTA.title}
            </h2>
            <p>{ABOUT_CTA.description}</p>
            <div className="aboutBtnRow">
              <Link
                href={ABOUT_CTA.primary.href}
                className="aboutBtnPrimary aboutBtnOnDark"
              >
                {ABOUT_CTA.primary.label}
                <ArrowRight size={16} strokeWidth={2} aria-hidden />
              </Link>
              <Link
                href={ABOUT_CTA.secondary.href}
                className="aboutBtnSecondary aboutBtnGhostOnDark"
              >
                {ABOUT_CTA.secondary.label}
                <ArrowRight size={16} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="aboutCtaMedia">
            <Image
              src={ABOUT_CTA.image.src}
              alt={ABOUT_CTA.image.alt}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
