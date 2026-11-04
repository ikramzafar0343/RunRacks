/**
 * Global site header entry (Server Component shell) — cart-free.
 * Prefer SiteHeaderWithCart from features/cart when the badge is needed.
 */
import { headerActions, primaryNav } from "@/shared/config/navConfig";
import { SiteHeaderBar } from "@/shared/ui/SiteHeaderBar";

export function SiteHeader() {
  return (
    <SiteHeaderBar primaryNav={primaryNav} headerActions={headerActions} />
  );
}
