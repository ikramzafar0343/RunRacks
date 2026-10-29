/**
 * Site footer copy + real App Router destinations only.
 * Social hrefs: replace with verified RunRacks profile URLs when published.
 */
import type { Route } from "next";

export type FooterLink = {
  label: string;
  href: Route;
};

export type FooterColumn = {
  id: string;
  title: string;
  blurb?: string;
  links: readonly FooterLink[];
};

export type FooterSocialId =
  "facebook" | "instagram" | "youtube" | "linkedin" | "behance";

export type FooterSocialLink = {
  id: FooterSocialId;
  label: string;
  /** Only set when a verified RunRacks profile URL exists. */
  href?: string;
};

export const FOOTER = {
  brand: "RunRacks",
  tagline: "hosting",
  watermark: "RUNRACKS",
  contactBlurb:
    "NVMe VPS hosting — clear plans, admin access, and engineers when you need them.",
  contactCta: {
    label: "View plans",
    href: "/pricing" as Route,
  },
  social: [
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
    { id: "youtube", label: "YouTube" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "behance", label: "Behance" },
  ] satisfies readonly FooterSocialLink[],
  columns: [
    {
      id: "overview",
      title: "Overview",
      links: [
        { label: "About Us", href: "/about" as Route },
        { label: "Pricing", href: "/pricing" as Route },
        { label: "Customize", href: "/customize" as Route },
        { label: "Blog", href: "/blog" as Route },
        { label: "FAQ", href: "/faq" as Route },
        { label: "View plans", href: "/pricing" as Route },
        { label: "Contact us", href: "/contact" as Route },
      ],
    },
    {
      id: "hosting",
      title: "Hosting products",
      links: [
        { label: "Linux VPS", href: "/products/vps" as Route },
        { label: "VPS in USA", href: "/products/vps-usa" as Route },
        { label: "Windows in USA", href: "/products/windows-usa" as Route },
        { label: "Windows VPS", href: "/products/windows" as Route },
        {
          label: "Windows Admin RDP",
          href: "/products/admin-rdp" as Route,
        },
        {
          label: "Admin RDP in USA",
          href: "/products/admin-rdp-usa" as Route,
        },
        { label: "Compare plans", href: "/pricing" as Route },
        { label: "RunRacks AI", href: "/ai" as Route },
        { label: "Customize", href: "/customize" as Route },
      ],
    },
    {
      id: "platform",
      title: "Platform & access",
      links: [
        { label: "RunRacks AI", href: "/ai" as Route },
        { label: "View plans", href: "/pricing" as Route },
        { label: "Profile", href: "/profile" as Route },
        { label: "Pricing", href: "/pricing" as Route },
        { label: "VPS hosting", href: "/products/vps" as Route },
        { label: "Windows hosting", href: "/products/windows" as Route },
        { label: "About", href: "/about" as Route },
      ],
    },
    {
      id: "resources",
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" as Route },
        { label: "FAQ", href: "/faq" as Route },
        { label: "About", href: "/about" as Route },
      ],
    },
  ] satisfies readonly FooterColumn[],
  legal: [
    { label: "Privacy Policy", href: "/privacy" as Route },
    { label: "Terms & Conditions", href: "/terms" as Route },
  ] satisfies readonly FooterLink[],
  copyright: "© 2026. RunRacks.",
} as const;
