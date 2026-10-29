/**
 * Global site header entry (Server Component shell).
 * Passes nav from the server so SSR HTML and client hydrate share one snapshot
 * (avoids stale Turbopack client chunks disagreeing on labels).
 */
import { headerActions, primaryNav } from "@/shared/config/navConfig";
import { SiteHeaderBar } from "@/shared/ui/SiteHeaderBar";

export function SiteHeader() {
  return (
    <SiteHeaderBar primaryNav={primaryNav} headerActions={headerActions} />
  );
}
