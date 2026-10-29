"use client";

import Image from "next/image";
import { VPS_USA } from "@/features/vps-usa/model/vpsUsaContent";
import { UsaReveal } from "@/features/vps-usa/components/UsaReveal";

export function VpsUsaStory() {
  const { eyebrow, heading, body, image, imageSecondary } = VPS_USA.story;

  return (
    <section className="usaStory" aria-labelledby="usa-story-heading">
      <UsaReveal className="usaStoryBand usaStoryBand--wideMedia">
        <div className="usaStoryMedia" data-usa-reveal>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="usaStoryImg"
            sizes="(max-width: 900px) 100vw, 62vw"
          />
        </div>
        <div className="usaStoryCopy" data-usa-reveal>
          <p className="usaEyebrow">{eyebrow}</p>
          <h2 id="usa-story-heading" className="usaHeading">
            {heading}
          </h2>
          {body.map((para) => (
            <p key={para.slice(0, 32)} className="usaLead">
              {para}
            </p>
          ))}
        </div>
      </UsaReveal>
      <UsaReveal className="usaStoryBand usaStoryBand--wideCopy">
        <div className="usaStoryCopy usaStoryCopy--accent" data-usa-reveal>
          <p className="usaLead usaLead--tight">
            Same catalog honesty as the rest of RunRacks—United States is one
            verified location among peers, not a city collage.
          </p>
        </div>
        <div className="usaStoryMedia" data-usa-reveal>
          <Image
            src={imageSecondary.src}
            alt={imageSecondary.alt}
            width={imageSecondary.width}
            height={imageSecondary.height}
            className="usaStoryImg"
            sizes="(max-width: 900px) 100vw, 55vw"
          />
        </div>
      </UsaReveal>
    </section>
  );
}
