"use client";

import Link from "next/link";
import { Check, Laptop, Monitor, Server, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { COMPARISON_ROWS } from "@/features/vps-pricing/model/planComparisonData";

export function VpsPlanComparison() {
  const firstRow = COMPARISON_ROWS[0]!;

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
          across Linux VPS, Windows VPS, and Admin RDP sample tiers.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card/40 shadow-xs">
        <Table className="bg-background">
          <TableHeader>
            <TableRow className="border-y-0 *:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="border-b border-border bg-muted/10" />
              <TableHead
                className="border-b border-border bg-muted/10 py-3 text-center"
                colSpan={4}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                  <Server
                    className="inline-flex stroke-emerald-600 dark:stroke-emerald-400"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>Linux VPS</span>
                </div>
              </TableHead>
              <TableHead
                className="border-b border-border bg-muted/10 py-3 text-center"
                colSpan={4}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                  <Monitor
                    className="inline-flex stroke-blue-600 dark:stroke-blue-400"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>Windows VPS</span>
                </div>
              </TableHead>
              <TableHead
                className="border-b border-border bg-muted/10 py-3 text-center"
                colSpan={4}
              >
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                  <Laptop
                    className="inline-flex stroke-purple-600 dark:stroke-purple-400"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>Admin RDP</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableHeader>
            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
              <TableCell className="w-[200px] min-w-[170px] border-b border-border bg-muted/5 p-3" />
              {[
                ...firstRow.linux,
                ...firstRow.windows,
                ...firstRow.adminRdp,
              ].map((plan, i) => (
                <TableHead
                  key={`${plan.name}-${i}`}
                  className="h-auto rotate-180 py-4 text-center text-xs font-semibold text-foreground [writing-mode:vertical-lr]"
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
                <TableHead className="w-[200px] min-w-[170px] whitespace-nowrap bg-muted/5 px-4 py-3 text-xs font-medium text-foreground sm:text-sm">
                  {item.feature}
                </TableHead>
                {[...item.linux, ...item.windows, ...item.adminRdp].map(
                  (plan, index) => (
                    <TableCell
                      key={`${plan.name}-${index}`}
                      className="min-w-[58px] sm:min-w-[64px] space-y-1 px-2 py-3 text-center"
                    >
                      {plan.supported ? (
                        <Check
                          className="inline-flex stroke-emerald-600 dark:stroke-emerald-400"
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      ) : (
                        <X
                          className="inline-flex stroke-red-600 dark:stroke-red-400"
                          size={16}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      )}
                      <span className="sr-only">
                        {plan.supported ? "Supported" : "Not supported"}
                      </span>
                      <div className="text-xs font-medium text-muted-foreground">
                        {plan.version}
                      </div>
                    </TableCell>
                  ),
                )}
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
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-brand-hover hover:underline sm:text-sm"
          >
            Request Enterprise Custom Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
