/**
 * Platforms & Technologies roster — illustrative marks only.
 * Not partnership claims. Artwork from Hosting_Technology_Logo_Watermark_Pack
 * (Font Awesome Free Brands glyphs + non-official wordmark lockups; CC BY 4.0).
 */

export type BrandLogo = {
  id: string;
  name: string;
  src: string;
  /** Optical display width on large desktop (px) */
  displayWidth: number;
  intrinsicWidth: number;
  intrinsicHeight: number;
};

export const brandsEyebrow = "Platforms & Technologies";

export const brandsHeadingLine1 = "Tools that power modern hosting,";
export const brandsHeadingLine2 = "platforms we build around";

/** Visible disclosure — logos are illustrative, not partnership claims. */
export const brandsNotice =
  "Illustrative technology marks — not partnership or endorsement claims.";

/** First 14 pack brands; reading order = row1 then row2. */
export const approvedBrands: readonly BrandLogo[] = [
  {
    id: "cloudflare",
    name: "Cloudflare",
    src: "/images/brands/01_cloudflare.png",
    displayWidth: 168,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "aws",
    name: "Amazon Web Services",
    src: "/images/brands/02_amazon_web_services.png",
    displayWidth: 188,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "google",
    name: "Google",
    src: "/images/brands/03_google.png",
    displayWidth: 148,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    src: "/images/brands/04_microsoft.png",
    displayWidth: 176,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    src: "/images/brands/05_digitalocean.png",
    displayWidth: 186,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "akamai-linode",
    name: "Akamai Linode",
    src: "/images/brands/06_akamai_linode.png",
    displayWidth: 182,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "wordpress",
    name: "WordPress",
    src: "/images/brands/07_wordpress.png",
    displayWidth: 168,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "shopify",
    name: "Shopify",
    src: "/images/brands/08_shopify.png",
    displayWidth: 158,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "docker",
    name: "Docker",
    src: "/images/brands/09_docker.png",
    displayWidth: 156,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "github",
    name: "GitHub",
    src: "/images/brands/10_github.png",
    displayWidth: 148,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "gitlab",
    name: "GitLab",
    src: "/images/brands/11_gitlab.png",
    displayWidth: 148,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "stripe",
    name: "Stripe",
    src: "/images/brands/12_stripe.png",
    displayWidth: 140,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "paypal",
    name: "PayPal",
    src: "/images/brands/13_paypal.png",
    displayWidth: 148,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
  {
    id: "ubuntu",
    name: "Ubuntu",
    src: "/images/brands/14_ubuntu.png",
    displayWidth: 156,
    intrinsicWidth: 400,
    intrinsicHeight: 133,
  },
];

/** Marquee track A (scrolls left). */
export const brandsRowOne: readonly BrandLogo[] = approvedBrands.slice(0, 7);

/** Marquee track B (scrolls right). */
export const brandsRowTwo: readonly BrandLogo[] = approvedBrands.slice(7, 14);
