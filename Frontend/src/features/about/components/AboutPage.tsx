/**
 * About Us — full editorial composition (sections 01–10).
 */
import { AboutHero } from "./AboutHero";
import { ClosingContactCta } from "./ClosingContactCta";
import { CompanyTimeline } from "./CompanyTimeline";
import { EditorialFeatures } from "./EditorialFeatures";
import { IntroStatement } from "./IntroStatement";
import { TeamGrid } from "./TeamGrid";
import { TeamStoriesCarousel } from "./TeamStoriesCarousel";
import { TechnologyPeoplePanel } from "./TechnologyPeoplePanel";
import { TrustCapabilityStrip } from "./TrustCapabilityStrip";
import { ValuesGrid } from "./ValuesGrid";
import "./about-page.css";
import "./about-sections.css";
import "./about-timeline-values.css";
import "./about-panels.css";
import "./about-cta.css";

export function AboutPage() {
  return (
    <div className="aboutPage">
      <AboutHero />
      <TrustCapabilityStrip />
      <IntroStatement />
      <EditorialFeatures />
      <CompanyTimeline />
      <ValuesGrid />
      <TechnologyPeoplePanel />
      <TeamGrid />
      <TeamStoriesCarousel />
      <ClosingContactCta />
    </div>
  );
}
