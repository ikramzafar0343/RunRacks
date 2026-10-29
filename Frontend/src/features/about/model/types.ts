export type AboutImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type CapabilityItem = {
  id: string;
  label: string;
  value: string;
  verified: true;
};

export type FeatureItem = {
  id: "vision" | "mission" | "future" | "leadership";
  indexLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  body: string;
  mediaSide: "left" | "right";
  image: AboutImage;
};

export type TimelineItem = {
  id: string;
  phase: string;
  title: string;
  description: string;
  image: AboutImage;
};

export type ValueItem = {
  id: string;
  title: string;
  description: string;
  image: AboutImage;
};

export type TeamItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  image: AboutImage;
};

export type PrincipleItem = {
  id: string;
  statement: string;
  label: string;
};
