import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import * as settingsService from "@/services/settingsService";
import { DEFAULT_SETTINGS } from "@/services/storage/settingsRepository";
import type { RestaurantSettings } from "@/types/settings";

interface SettingsContextValue {
  settings: RestaurantSettings;
  isHydrated: boolean;
  updateSettings: (patch: Partial<RestaurantSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    settingsService.getSettings().then((loaded) => {
      if (isMounted) {
        setSettings(loaded);
        setIsHydrated(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const updateSettings = async (patch: Partial<RestaurantSettings>) => {
    const next = await settingsService.updateSettings(patch);
    setSettings(next);
  };

  const contextValue = useMemo(
    () => ({ settings, isHydrated, updateSettings }),
    [settings, isHydrated],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
}
