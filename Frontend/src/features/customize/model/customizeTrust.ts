/**
 * Optional trust strip for CustomizeHostingSection.
 * Prefer demo-labeled avatars/scores — do not invent verified review counts.
 */

export type CustomizeHostingTrustAvatar = {
  src: string;
  alt: string;
};

export type CustomizeHostingTrust = {
  avatars: readonly CustomizeHostingTrustAvatar[];
  /** 0–5, supports halves */
  score: number;
  label: string;
  notice: string;
};
