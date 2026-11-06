"use client";

import Link from "next/link";
import { useTransition, type KeyboardEvent } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { familyIcon } from "@/features/customize";
import {
  FAMILY_META,
  comparisonKeyForFamily,
  plansForFamily,
  type ComparisonFamilyKey,
} from "@/features/vps-pricing/model/planComparisonData";
import { COMPARISON_ROWS } from "@/features/vps-pricing/model/planComparisonRows";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import {
  buildVpsSearchParams,
  DEFAULT_LOCATION_ID,
  parseFamily,
  parseLocation,
  parseTerm,
} from "@/features/vps-pricing/lib/urlState";
import type { VpsFamily } from "@/features/vps-pricing/model/types";

const FAMILY_TABS: Array<{ id: VpsFamily; key: ComparisonFamilyKey }> = [
  { id: "linux", key: "linux" },
  { id: "windows", key: "windows" },
  { id: "windows-admin-rdp", key: "adminRdp" },
];

export function VpsPlanComparison() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const family = parseFamily(searchParams.get("family"));
  const locationId = parseLocation(
    searchParams.get("location"),
    getDemoVpsCatalog().regions.map((region) => region.id),
  );
  const term = parseTerm(searchParams.get("term"));
  const familyKey = comparisonKeyForFamily(family);
  const meta = FAMILY_META[familyKey];
  const firstRow = COMPARISON_ROWS[0]!;
  const planHeaders = plansForFamily(firstRow, family);

  function setFamily(nextFamily: VpsFamily) {
    const params = buildVpsSearchParams({
      family: nextFamily,
      locationId: locationId || DEFAULT_LOCATION_ID,
      term,
    });
    const qs = params.toString();
    const href = (qs ? `${pathname}?${qs}` : pathname) as Route;
    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = FAMILY_TABS.findIndex((t) => t.id === family);
    if (index < 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const next =
        FAMILY_TABS[(index + delta + FAMILY_TABS.length) % FAMILY_TABS.length];
      if (next) setFamily(next.id);
    }
  }

  return (
    <section
      id="compare-plans"
      className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="compare-plans-title"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
          <span>✦</span>
          <span>Plan comparison</span>
        </p>
        <h2
          id="compare-plans-title"
          className="mt-2 font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl"
        >
          Specs side by side
        </h2>
        <p className="mt-3 text-base text-body/80 sm:text-lg">
          Demo matrix of compute, NVMe, networking, and administrator access
          across the six {meta.label} sample tiers.
        </p>
      </div>

      <div
        className="mt-8 grid grid-cols-3 overflow-hidden rounded-t-xl border border-b-0 border-border bg-muted/10"
        role="tablist"
        aria-label="Hosting family"
        onKeyDown={onTabKeyDown}
      >
        {FAMILY_TABS.map((tab) => {
          const tabMeta = FAMILY_META[tab.key];
          const active = family === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              className={
                active
                  ? "flex items-center justify-center gap-1.5 border-r border-border bg-brand px-3 py-4 text-xs font-semibold uppercase tracking-wider text-brand-contrast last:border-r-0"
                  : "flex items-center justify-center gap-1.5 border-r border-border px-3 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors last:border-r-0 hover:bg-muted/30 hover:text-foreground"
              }
              onClick={() => setFamily(tab.id)}
            >
              <span className="inline-flex shrink-0 [&_svg]:size-4">
                {familyIcon(tab.id)}
              </span>
              <span>{tabMeta.label}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-b-xl border border-border bg-card/40 shadow-xs">
        <Table className="bg-background">
          <TableHeader>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="w-[200px] min-w-[170px] border-b border-border bg-muted/5 px-4 py-4" />
              {planHeaders.map((plan, i) => (
                <TableHead
                  key={`${plan.name}-${i}`}
                  className="h-auto min-w-[88px] px-3 py-4 text-center text-xs font-semibold text-foreground sm:min-w-[100px] sm:text-sm"
                >
                  {plan.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMPARISON_ROWS.map((item) => (
              <TableRow
                key={item.feature}
                className="*:border-border transition-colors hover:bg-muted/40 [&>:not(:last-child)]:border-r"
              >
                <TableHead className="w-[200px] min-w-[170px] whitespace-nowrap bg-muted/5 px-4 py-4 text-xs font-semibold text-foreground sm:text-sm">
                  {item.feature}
                </TableHead>
                {plansForFamily(item, family).map((plan, index) => (
                  <TableCell
                    key={`${plan.name}-${index}`}
                    className="min-w-[88px] px-3 py-4 text-center sm:min-w-[100px]"
                  >
                    <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap">
                      {item.showIcon ? (
                        plan.supported ? (
                          <Check
                            className="shrink-0 text-success"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        ) : (
                          <X
                            className="shrink-0 text-error"
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        )
                      ) : null}
                      {item.showIcon ? (
                        <span className="sr-only">
                          {plan.supported ? "Supported" : "Not supported"}
                        </span>
                      ) : null}
                      <span className="text-xs font-semibold text-muted-foreground">
                        {plan.version}
                      </span>
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row">
          <p className="text-center text-xs text-body/80 sm:text-left sm:text-sm">
            Need custom Windows Server images, dedicated BGP routing, or
            high-density Admin RDP clusters?
          </p>
          <Link
            href="/customize"
            className="inline-flex items-center gap-1.5 rounded-md border border-foreground/80 px-3 py-2 text-xs font-semibold text-brand transition-colors hover:border-brand hover:text-brand-hover sm:text-sm"
          >
            Request Enterprise Custom Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
