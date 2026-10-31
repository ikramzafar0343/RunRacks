/**
 * Canonical demo-pricing and catalog-region copy — import once, do not rephrase per page.
 */

export const DEMO_PRICING_ANSWER =
  "Catalog prices are demo labels for comparison until billing and checkout are connected. Use Pricing or Contact to continue with the current real flow.";

export const USA_REGION_ANSWER =
  "United States maps to the catalog region id `us`. Plans on this page default to that location. Exact facility cities are not marketed here—use plan filters and Pricing for the current options.";

export const OTHER_REGIONS_ANSWER =
  "Additional catalog regions appear in plan filters (for example United Kingdom, Canada, Netherlands, Germany, Singapore, Australia, and Japan). Select a region to see plans available there.";

export function catalogRegionsIntro(planAnchorLabel: string): string {
  return `Same catalog regions as pricing filters—select a row, then open ${planAnchorLabel} for that location.`;
}
