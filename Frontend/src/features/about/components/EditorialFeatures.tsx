import { ABOUT_FEATURES } from "../model/aboutContent";
import { FeatureRow } from "./FeatureRow";

export function EditorialFeatures() {
  return (
    <div className="aboutSection--surface">
      {ABOUT_FEATURES.map((feature) => (
        <FeatureRow key={feature.id} feature={feature} />
      ))}
    </div>
  );
}
