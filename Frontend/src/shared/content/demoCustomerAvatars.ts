/**
 * Illustrative demo customer avatars — AI-generated faces for trust strips.
 * Not verified customers; do not pair with fabricated testimonials.
 */

export type DemoCustomerAvatar = {
  src: string;
  alt: string;
};

const ALT =
  "Illustrative demo avatar — not a verified customer photo";

export const DEMO_CUSTOMER_AVATARS: readonly DemoCustomerAvatar[] = [
  { src: "/images/customer-avatars/customer-avatar-01.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-02.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-03.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-04.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-05.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-06.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-07.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-08.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-09.webp", alt: ALT },
  { src: "/images/customer-avatars/customer-avatar-10.webp", alt: ALT },
] as const;
