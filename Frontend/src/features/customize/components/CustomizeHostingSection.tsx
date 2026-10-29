/**
 * Mid-page customize block — h2 intro + full demo configurator.
 * Used on /products/vps after pricing (and available for other hosts).
 */
import type { CSSProperties } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CustomizeConfigurator } from "@/features/customize/components/CustomizeConfigurator";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";
import type { CustomizeHostingTrust } from "@/features/customize/model/customizeTrust";
import type { VpsRegion } from "@/features/vps-pricing/model/types";
import "@/features/customize/components/customize.css";
import "@/features/customize/components/customize-summary.css";

const STAR_SLOTS = [1, 2, 3, 4, 5] as const;

export type CustomizeHostingSectionProps = {
  regions: readonly VpsRegion[];
  sectionId?: string;
  /** Summary CTA target; defaults to `/pricing` when omitted. */
  plansHref?: string;
  /** When set, replaces flag trust with customer avatars + demo rating. */
  trust?: CustomizeHostingTrust;
};

export function CustomizeHostingSection({
  regions,
  sectionId = "vps-customize",
  plansHref,
  trust,
}: CustomizeHostingSectionProps) {
  const defaultRegionId = regions[0]?.id ?? "us";
  const configId = `${sectionId}-config`;
  const { hero } = CUSTOMIZE;
  const avatars = trust?.avatars ?? hero.trust.avatars;
  const label = trust?.label ?? hero.trust.label;

  return (
    <section
      id={sectionId}
      className="czHostingSection scroll-mt-24"
      aria-labelledby={`${sectionId}-title`}
    >
      <div className="czHostingIntro">
        <h2 id={`${sectionId}-title`} className="czHostingTitle">
          {hero.title}
        </h2>
        <p className="czHostingLead">{hero.lead}</p>
        <Button asChild size="lg" variant="default" className="czHostingCta">
          <a href={`#${configId}`}>{hero.cta.label}</a>
        </Button>
        <div
          className="czHostingTrust"
          role="group"
          aria-label={
            trust
              ? `${trust.label}, ${trust.score} out of 5. ${trust.notice}`
              : label
          }
        >
          {trust ? (
            <p className="czHostingTrustNotice" role="note">
              {trust.notice}
            </p>
          ) : null}
          <span className="czHostingAvatars">
            {avatars.map((avatar) => (
              <Avatar
                key={avatar.src}
                className="size-11 border-2 border-surface bg-accent-soft shadow-sm"
              >
                <AvatarImage
                  src={avatar.src}
                  alt={avatar.alt}
                  className="object-cover"
                />
              </Avatar>
            ))}
          </span>
          <div className="czHostingTrustCopy">
            {trust ? (
              <span className="czHostingTrustStars" aria-hidden>
                {STAR_SLOTS.map((slot) => {
                  const fill = Math.min(1, Math.max(0, trust.score - (slot - 1)));
                  const style = { "--fill": String(fill) } as CSSProperties;
                  return (
                    <span key={slot} className="czHostingTrustStar" style={style}>
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M12 2.5l2.7 6.4 6.9.6-5.2 4.6 1.6 6.7L12 17.8 5.9 20.8l1.6-6.7L2.4 9.5l6.9-.6L12 2.5z" />
                      </svg>
                    </span>
                  );
                })}
              </span>
            ) : null}
            <p className="czHostingTrustLabel">{label}</p>
          </div>
        </div>
      </div>

      <div id={configId} className="czConfig scroll-mt-24">
        <CustomizeConfigurator
          regions={regions}
          defaultRegionId={defaultRegionId}
          {...(plansHref ? { plansHref } : {})}
        />
      </div>
    </section>
  );
}
