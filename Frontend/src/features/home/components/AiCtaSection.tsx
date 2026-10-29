/**
 * Home AI CTA — theme-aware gradient banner with real product routes.
 */
import Link from "next/link";
import { HiOutlineSparkles } from "react-icons/hi2";
import { AI_CTA } from "@/features/home/model/aiCtaContent";
import "@/features/home/components/ai-cta.css";

export function AiCtaSection() {
  return (
    <section className="homeAiCta" aria-labelledby="home-ai-cta-heading">
      <div className="homeAiCtaInner">
        <div className="homeAiCtaPanel">
          <div className="homeAiCtaCopy">
            <h2 id="home-ai-cta-heading" className="homeAiCtaHeading">
              {AI_CTA.heading}
            </h2>
            <p className="homeAiCtaSupporting">{AI_CTA.supporting}</p>
          </div>

          <div className="homeAiCtaActions">
            <Link href={AI_CTA.primary.href} className="homeAiCtaPrimary">
              {AI_CTA.primary.label}
            </Link>
            <Link href={AI_CTA.secondary.href} className="homeAiCtaSecondary">
              <HiOutlineSparkles
                size={18}
                className="homeAiCtaSecondaryIcon"
                aria-hidden
              />
              {AI_CTA.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
