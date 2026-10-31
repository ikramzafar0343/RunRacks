/**
 * Primary header navigation — labels and real App Router paths only.
 */
import type { Route } from "next";

export type NavLinkItem = {
  label: string;
  href: Route;
};

export type NavDropdownItem = {
  label: string;
  children: readonly NavLinkItem[];
};

export type PrimaryNavItem = NavLinkItem | NavDropdownItem;

export function isNavDropdown(item: PrimaryNavItem): item is NavDropdownItem {
  return Array.isArray((item as NavDropdownItem).children);
}

/** Keep server + client nav identical — avoid link↔dropdown hydration mismatches. */
export const primaryNav: readonly PrimaryNavItem[] = [
  { label: "VPS Hosting", href: "/products/vps" as Route },
  { label: "Windows", href: "/products/windows" as Route },
  { label: "Admin RDP", href: "/products/admin-rdp" as Route },
  { label: "Pricing", href: "/pricing" },
  { label: "Customize", href: "/customize" as Route },
  {
    label: "Resources",
    children: [
      { label: "Blog", href: "/blog" as Route },
      { label: "About", href: "/about" },
      { label: "VPS in USA", href: "/products/vps-usa" as Route },
      { label: "Windows in USA", href: "/products/windows-usa" as Route },
      {
        label: "Admin RDP in USA",
        href: "/products/admin-rdp-usa" as Route,
      },
    ],
  },
];

export const headerActions = {
  ai: { label: "RunRacks AI", href: "/ai" as Route },
  profile: { label: "Profile", href: "/profile" as Route },
  home: { label: "RunRacks", href: "/" as Route },
};

/** Hero CTA shared across home + product pages. */
export const TRY_AI_CTA = {
  label: "Try RunRacks AI",
  href: "/ai" as Route,
} as const;

export type HeaderActions = typeof headerActions;
