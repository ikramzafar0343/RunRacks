/**
 * Public site origin for metadata, sitemap, and canonicals.
 * Override with NEXT_PUBLIC_SITE_URL in production.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://runracks.com";
}
