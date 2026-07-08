import { getCachedSettings } from "@/services/settingsService";

export function formatPrice(amount: number, currencySymbol?: string): string {
  const symbol = currencySymbol ?? getCachedSettings().currency;
  return `${symbol}${amount.toFixed(2)}`;
}
