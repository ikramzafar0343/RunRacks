/**
 * VPS pricing hero — family/location/term filters over demo catalog.
 */
"use client";

import { useTransition } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { VpsFamilyTabs } from "@/features/vps-pricing/components/VpsFamilyTabs";
import { VpsFilters } from "@/features/vps-pricing/components/VpsFilters";
import { VpsPlanList } from "@/features/vps-pricing/components/VpsPlanList";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import {
  buildVpsSearchParams,
  DEFAULT_LOCATION_ID,
  lockedFamilyFromPath,
  parseFamily,
  parseLocation,
  parseTerm,
} from "@/features/vps-pricing/lib/urlState";
import type {
  BillingTermMonths,
  VpsCatalogPayload,
  VpsFamily,
} from "@/features/vps-pricing/model/types";
import "@/features/vps-pricing/components/vps-pricing.css";
import "@/features/vps-pricing/components/vps-filter-rails.css";
import "@/features/vps-pricing/components/vps-plan-rows.css";
import "@/features/vps-pricing/components/vps-plan-cards.css";

type VpsPricingSectionProps = {
  /** `page` = product hero; `embedded` = mid-page home section. */
  variant?: "page" | "embedded";
  /** Override plan presentation (default: cards on page, rows when embedded). */
  planLayout?: "rows" | "cards";
  /** Server-provided demo catalog (avoids client rebuild). */
  initialCatalog?: VpsCatalogPayload;
  /** Raw query values from the server for first paint. */
  initialFamily?: string | null;
  initialLocation?: string | null;
  initialTerm?: string | null;
};

function plansHeadingCopy(
  family: VpsFamily | null,
  embedded: boolean,
): { title: string; subtitle: string } {
  if (family === "windows") {
    return {
      title: "Windows Hosting Plans",
      subtitle:
        "Administrator Windows VPS on NVMe. Filter by region and billing term—demo prices stay labeled until checkout.",
    };
  }
  if (family === "windows-admin-rdp") {
    return {
      title: "Admin RDP Plans",
      subtitle:
        "Windows remote desktops with full administrator rights. Filter by region and billing term to compare tiers.",
    };
  }
  if (family === "linux") {
    return {
      title: "VPS Hosting Plans",
      subtitle:
        "Linux VPS with full root access on local NVMe. Filter by region and billing term to match your workload.",
    };
  }
  if (embedded) {
    return {
      title: "Our Plans",
      subtitle:
        "Filter Linux VPS, Windows VPS, and Admin RDP by region and billing cycle. Demo prices are labeled.",
    };
  }
  return {
    title: "Hosting Plans",
    subtitle:
      "Compare Linux VPS, Windows VPS, and Admin RDP. Use family, region, and term filters—catalog amounts are demo until checkout.",
  };
}

export function VpsPricingSection({
  variant = "page",
  planLayout,
  initialCatalog,
  initialFamily = null,
  initialLocation = null,
  initialTerm = null,
}: VpsPricingSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const TitleTag = "h2";
  const isEmbedded = variant === "embedded";

  const lockedFamily = lockedFamilyFromPath(pathname);
  // Product pages lock family; elsewhere prefer URL then server first paint.
  const family =
    lockedFamily ?? parseFamily(searchParams.get("family") ?? initialFamily);
  const { title: plansTitle, subtitle: plansSubtitle } = plansHeadingCopy(
    lockedFamily,
    isEmbedded,
  );
  const locationId = parseLocation(
    searchParams.get("location") ?? initialLocation,
  );
  const term = parseTerm(searchParams.get("term") ?? initialTerm);

  const catalog = initialCatalog ?? getDemoVpsCatalog();

  function syncUrl(next: {
    family: VpsFamily;
    locationId: string;
    term: BillingTermMonths;
  }) {
    const params = buildVpsSearchParams({
      ...next,
      family: lockedFamily ?? next.family,
      omitFamily: lockedFamily != null,
    });
    const qs = params.toString();
    const href = (qs ? `${pathname}?${qs}` : pathname) as Route;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  const resolvedLocationId = catalog.regions.some((r) => r.id === locationId)
    ? locationId
    : (catalog.regions[0]?.id ?? DEFAULT_LOCATION_ID);
  const filtered = catalog.plans.filter((plan) => {
    if (plan.family !== family) return false;
    return plan.availableRegionIds.includes(resolvedLocationId);
  });

  return (
    <section
      className="vpsPricingSection"
      data-variant={variant}
      aria-labelledby="vps-pricing-title"
    >
      <div className="vpsPricingContainer">
        <header className="vpsPricingHeader">
          <TitleTag id="vps-pricing-title" className="vpsTitle">
            {plansTitle}
          </TitleTag>
          <p className="vpsSubtitle">{plansSubtitle}</p>
          {catalog.source === "demo" ? (
            <p className="vpsDemoNotice" role="note">
              {catalog.notice}
            </p>
          ) : null}
        </header>

        {lockedFamily == null ? (
          <div className="vpsFilterTop">
            <VpsFamilyTabs
              value={family}
              onChange={(nextFamily) => {
                let nextLocation = resolvedLocationId;
                const has = catalog.plans.some(
                  (p) =>
                    p.family === nextFamily &&
                    p.availableRegionIds.includes(nextLocation),
                );
                if (!has) {
                  const fallback = catalog.plans.find(
                    (p) => p.family === nextFamily,
                  )?.availableRegionIds[0];
                  nextLocation = fallback ?? DEFAULT_LOCATION_ID;
                }
                syncUrl({
                  family: nextFamily,
                  locationId: nextLocation,
                  term,
                });
              }}
            />
          </div>
        ) : null}

        <VpsFilters
          regions={catalog.regions}
          locationId={resolvedLocationId}
          term={term}
          onLocationChange={(id) => syncUrl({ family, locationId: id, term })}
          onTermChange={(nextTerm) =>
            syncUrl({
              family,
              locationId: resolvedLocationId,
              term: nextTerm,
            })
          }
        />

        <VpsPlanList
          key={`${family}:${resolvedLocationId}:${term}`}
          plans={filtered}
          term={term}
          locationId={resolvedLocationId}
          checkoutConfigured={catalog.checkoutConfigured}
          layout={planLayout ?? (isEmbedded ? "rows" : "cards")}
        />
      </div>
    </section>
  );
}
