import React, { createContext, useContext, useMemo } from "react";
import { LayoutAnimation, Platform, UIManager, useColorScheme as useSystemColorScheme } from "react-native";

import { STORAGE_KEYS } from "@/constants/config";
import { darkColors, lightColors, type ThemeColors } from "@/constants/theme";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";

export type ColorScheme = "light" | "dark";

interface ThemeContextValue {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  isHydrated: boolean;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const { value: colorScheme, setValue: setStoredScheme, isHydrated } = useAsyncStorage<ColorScheme>(
    STORAGE_KEYS.theme,
    systemScheme === "dark" ? "dark" : "light",
  );

  const applyScheme = (scheme: ColorScheme) => {
    // Animates the color/layout changes that follow instead of a hard cut.
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStoredScheme(scheme);
  };

  const toggleTheme = () => applyScheme(colorScheme === "dark" ? "light" : "dark");

  const contextValue = useMemo<ThemeContextValue>(() => {
    const colors = colorScheme === "dark" ? darkColors : lightColors;
    return {
      colorScheme,
      colors,
      isDark: colorScheme === "dark",
      isHydrated,
      toggleTheme,
      setColorScheme: applyScheme,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorScheme, isHydrated]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
