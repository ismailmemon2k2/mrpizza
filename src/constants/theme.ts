export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  onPrimary: string;
  primary: string;
  primaryPressed: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  overlay: string;
  shadow: string;
}

// Deep-red restaurant brand palette, tuned separately for light and dark
// surfaces so contrast/legibility hold up in both modes.
export const lightColors: ThemeColors = {
  background: "#F3EDEC",
  surface: "#FFFFFF",
  surfaceAlt: "#F8F1F0",
  border: "#E3D6D5",
  text: "#241414",
  textMuted: "#7A6B6A",
  onPrimary: "#FFFFFF",
  primary: "#C62828",
  primaryPressed: "#8E0000",
  secondary: "#8E0000",
  accent: "#FFFFFF",
  success: "#2E7D32",
  warning: "#F9A825",
  danger: "#D32F2F",
  overlay: "rgba(36, 20, 20, 0.5)",
  shadow: "#000000",
};

export const darkColors: ThemeColors = {
  background: "#151010",
  surface: "#211616",
  surfaceAlt: "#2B1C1C",
  border: "#3A2626",
  text: "#F5EDEC",
  textMuted: "#B8A6A5",
  onPrimary: "#FFFFFF",
  primary: "#E2453F",
  primaryPressed: "#B71C1C",
  secondary: "#B71C1C",
  accent: "#FFFFFF",
  success: "#4CAF50",
  warning: "#FFB300",
  danger: "#EF5350",
  overlay: "rgba(0, 0, 0, 0.65)",
  shadow: "#000000",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

// Minimum comfortable hit target for a fast-tapping counter employee.
export const TouchTarget = {
  min: 56,
  large: 72,
};

export const FontSize = {
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
};

export const FontWeight = {
  regular: "400" as const,
  medium: "600" as const,
  bold: "700" as const,
};

// Cross-platform elevation presets — spread onto a style object. `elevation`
// covers Android, the shadow* props cover iOS/web.
export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Tablet/web breakpoint used by screens that adapt column counts or max
// content width.
export const TABLET_BREAKPOINT = 768;
