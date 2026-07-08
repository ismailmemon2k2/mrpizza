import * as settingsRepository from "@/services/storage/settingsRepository";
import type { RestaurantSettings } from "@/types/settings";

// Cached synchronously so presentational utils (formatPrice, calculateTotals
// defaults) can read the latest settings without every component needing to
// subscribe to SettingsContext. Populated as soon as getSettings() resolves.
let cachedSettings: RestaurantSettings = settingsRepository.DEFAULT_SETTINGS;

export async function getSettings(): Promise<RestaurantSettings> {
  const settings = await settingsRepository.getSettings();
  cachedSettings = settings;
  return settings;
}

export async function updateSettings(
  patch: Partial<RestaurantSettings>,
): Promise<RestaurantSettings> {
  const next = { ...cachedSettings, ...patch };
  await settingsRepository.saveSettings(next);
  cachedSettings = next;
  return next;
}

export function getCachedSettings(): RestaurantSettings {
  return cachedSettings;
}
