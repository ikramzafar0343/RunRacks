/**
 * Six-card feature grid for the VPS product hero.
 */
import { VPS_HERO_ICONS } from "@/features/vps-product/components/vpsHeroIcons";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";

export function VpsProductHeroFeatures() {
  const { features } = VPS_PRODUCT.hero;

  return (
    <ul className="vpsProductHeroFeatures" aria-label="VPS hosting features">
      {features.map((feature) => {
        const Icon = VPS_HERO_ICONS[feature.icon];
        return (
          <li key={feature.id} className="vpsProductHeroFeature" data-hero-card>
            <span className="vpsProductHeroFeatureIcon" aria-hidden>
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <div className="vpsProductHeroFeatureCopy">
              <h3 className="vpsProductHeroFeatureTitle">{feature.title}</h3>
              <p className="vpsProductHeroFeatureBody">{feature.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
