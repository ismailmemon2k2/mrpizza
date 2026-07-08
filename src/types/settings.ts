import { z } from "zod";

export interface RestaurantSettings {
  restaurantName: string;
  currency: string;
  taxRate: number; // decimal, e.g. 0.08 for 8%
  profitMarginPercent: number; // used as a fallback margin reference in reporting
}

export const settingsSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  currency: z.string().min(1, "Currency symbol is required").max(3),
  taxPercent: z.number().min(0).max(100),
  profitMarginPercent: z.number().min(0).max(100),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
