/**
 * Mid-page customize block — h2 intro + full demo configurator.
 * Used on /products/vps after pricing (and available for other hosts).
 */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CustomizeConfigurator } from "@/features/customize/components/CustomizeConfigurator";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";
import type { VpsRegion } from "@/features/vps-pricing/model/types";
import "@/features/customize/components/customize.css";
import "@/features/customize/components/customize-summary.css";

export type CustomizeHostingSectionProps = {
  regions: readonly VpsRegion[];
  sectionId?: string;
  /** Summary CTA target; defaults to `/pricing` when omitted. */
  plansHref?: string;
};

export function CustomizeHostingSection({
  regions,
  sectionId = "vps-customize",
  plansHref,
}: CustomizeHostingSectionProps) {
  const defaultRegionId = regions[0]?.id ?? "us";
  const configId = `${sectionId}-config`;
  const { hero } = CUSTOMIZE;

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
        <div className="czHostingTrust">
          <span className="czHostingAvatars">
            {hero.trust.avatars.map((avatar) => (
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
          <p className="czHostingTrustLabel">{hero.trust.label}</p>
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
