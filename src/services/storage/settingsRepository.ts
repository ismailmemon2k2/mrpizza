import {
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_PROFIT_MARGIN_PERCENT,
  DEFAULT_RESTAURANT_NAME,
  DEFAULT_TAX_RATE,
  STORAGE_KEYS,
} from "@/constants/config";
import { readJSON, writeJSON } from "@/services/storage/asyncStorage";
import type { RestaurantSettings } from "@/types/settings";

const DEFAULT_SETTINGS: RestaurantSettings = {
  restaurantName: DEFAULT_RESTAURANT_NAME,
  currency: DEFAULT_CURRENCY_SYMBOL,
  taxRate: DEFAULT_TAX_RATE,
  profitMarginPercent: DEFAULT_PROFIT_MARGIN_PERCENT,
};

export async function getSettings(): Promise<RestaurantSettings> {
  return readJSON<RestaurantSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}

export async function saveSettings(settings: RestaurantSettings): Promise<void> {
  await writeJSON(STORAGE_KEYS.settings, settings);
}

export { DEFAULT_SETTINGS };
