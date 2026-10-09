export const CURRENCIES = ["PLN", "EUR", "USD", "GBP", "CHF"] as const;
export type Currency = (typeof CURRENCIES)[number];
export const DEFAULT_CURRENCY: Currency = "PLN";

export function formatMoney(amount: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Accepts "12,50", "12.5", "1 200,00". Returns null when not a valid positive amount.
export function parseAmount(input: string): number | null {
  const normalized = input.replace(/\s/g, "").replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return value > 0 ? value : null;
}
