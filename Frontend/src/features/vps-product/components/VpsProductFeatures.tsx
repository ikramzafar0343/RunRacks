/**
 * Six-card VPS feature grid — placed after pricing on /products/vps.
 */
import { VPS_HERO_ICONS } from "@/features/vps-product/components/vpsHeroIcons";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-product-features.css";

export function VpsProductFeatures() {
  const { features } = VPS_PRODUCT.hero;

  return (
    <section
      id="vps-features"
      className="vpsProductFeatures"
      aria-label="VPS hosting features"
    >
      <ul className="vpsProductFeaturesGrid">
        {features.map((feature) => {
          const Icon = VPS_HERO_ICONS[feature.icon];
          return (
            <li key={feature.id} className="vpsProductFeaturesCard">
              <span className="vpsProductFeaturesIcon" aria-hidden>
                <Icon size={28} strokeWidth={1.6} />
              </span>
              <div className="vpsProductFeaturesCopy">
                <h3 className="vpsProductFeaturesTitle">{feature.title}</h3>
                <p className="vpsProductFeaturesBody">{feature.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
