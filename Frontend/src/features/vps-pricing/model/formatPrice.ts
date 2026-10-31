/**
 * Currency formatting for VPS plan prices.
 */

export function formatMoneyMinor(
  amountMinor: number,
  currency: string,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function billingNoteForTerm(term: 1 | 3 | 6 | 12): string {
  if (term === 1) return "Billed monthly";
  if (term === 3) return "Billed every 3 months";
  if (term === 6) return "Billed every 6 months";
  return "Billed every 12 months";
}
