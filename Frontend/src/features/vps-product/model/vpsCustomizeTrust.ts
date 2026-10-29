/**
 * VPS customize intro trust — demo customer face pile + demo rating.
 * Portraits are illustrative; score is not a verified review count.
 */
import type { CustomizeHostingTrust } from "@/features/customize/model/customizeTrust";

export const VPS_CUSTOMIZE_TRUST: CustomizeHostingTrust = {
  score: 4.5,
  label: "Excellent · demo reviews",
  notice: "Demo rating — not verified customer reviews",
  avatars: [
    {
      src: "/media/customer-stories/demo-01/portrait.jpg",
      alt: "Demo customer portrait — not a verified photo",
    },
    {
      src: "/media/customer-stories/demo-02/portrait.jpg",
      alt: "Demo customer portrait — not a verified photo",
    },
    {
      src: "/home/hero-portrait.webp",
      alt: "Illustrative portrait for the demo trust strip",
    },
    {
      src: "/images/admin-rdp/story-portrait.jpg",
      alt: "Illustrative portrait for the demo trust strip",
    },
    {
      src: "/images/showcase/rail-photo-operator.jpg",
      alt: "Illustrative operator portrait for the demo trust strip",
    },
  ],
};
