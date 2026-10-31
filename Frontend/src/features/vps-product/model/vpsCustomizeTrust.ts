/**
 * VPS customize intro trust — demo customer face pile + demo rating.
 * Portraits are illustrative; score is not a verified review count.
 */
import type { CustomizeHostingTrust } from "@/features/customize/model/customizeTrust";
import { DEMO_CUSTOMER_AVATARS } from "@/shared/content/demoCustomerAvatars";

export const VPS_CUSTOMIZE_TRUST: CustomizeHostingTrust = {
  score: 4.5,
  label: "Excellent · demo reviews",
  notice: "Demo rating — not verified customer reviews",
  avatars: DEMO_CUSTOMER_AVATARS.slice(0, 5),
};
