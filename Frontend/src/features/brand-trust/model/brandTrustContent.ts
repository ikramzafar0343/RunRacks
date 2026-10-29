/**
 * Brand promise + trust metrics — demo-labeled marketing UI only.
 * Replace with verified claims before presenting as live social proof.
 */

export type PromiseItem = {
  id: string;
  text: string;
  order: number;
};

export type TrustAvatar = {
  id: string;
  kind: "image" | "initials";
  src?: string;
  alt: string;
  initials?: string;
};

export type TrustMetricId = "websites" | "reviews" | "experience" | "support";

export type TrustMetric = {
  id: TrustMetricId;
  displayValue: string;
  label: string;
  icon: "avatars" | "smile" | "star" | "headset";
};

export type BrandTrustContent = {
  brandName: string;
  source: "demo";
  notice: string;
  initialPromiseIndex: number;
  promises: readonly PromiseItem[];
  avatars: readonly TrustAvatar[];
  metrics: readonly TrustMetric[];
};

export const BRAND_TRUST: BrandTrustContent = {
  brandName: "RunRacks",
  source: "demo",
  notice: "Demo trust metrics — not verified",
  initialPromiseIndex: 2,
  promises: [
    { id: "p1", text: "Puts customers first.", order: 0 },
    { id: "p2", text: "Keeps pricing clear.", order: 1 },
    { id: "p3", text: "Runs on local NVMe.", order: 2 },
    { id: "p4", text: "Scales with your stack.", order: 3 },
    { id: "p5", text: "Answers with engineers.", order: 4 },
    { id: "p6", text: "Deploys without the wait.", order: 5 },
    { id: "p7", text: "Gives room to grow.", order: 6 },
    { id: "p8", text: "Stays honest about demos.", order: 7 },
  ],
  avatars: [
    {
      id: "a1",
      kind: "image",
      src: "/media/customer-stories/demo-01/portrait.jpg",
      alt: "Demo portrait — not a verified customer photo",
    },
    {
      id: "a2",
      kind: "image",
      src: "/media/customer-stories/demo-02/portrait.jpg",
      alt: "Demo portrait — not a verified customer photo",
    },
    {
      id: "a3",
      kind: "image",
      src: "/home/hero-portrait.webp",
      alt: "Demo portrait — not a verified customer photo",
    },
  ],
  metrics: [
    {
      id: "websites",
      displayValue: "2,700+",
      label: "Websites hosted",
      icon: "avatars",
    },
    {
      id: "reviews",
      displayValue: "4.5/5",
      label: "Average review score",
      icon: "smile",
    },
    {
      id: "experience",
      displayValue: "5+ years",
      label: "of experience",
      icon: "star",
    },
    {
      id: "support",
      displayValue: "Human",
      label: "Expert support",
      icon: "headset",
    },
  ],
};
