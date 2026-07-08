import React from "react";
import { Image, useWindowDimensions, type ImageStyle, type StyleProp } from "react-native";

import { TABLET_BREAKPOINT } from "@/constants/theme";

let logoSource: number | null = null;
try {
  // Static require so Metro can resolve/bundle the asset; if the file is
  // ever removed, the branding simply falls back to nothing instead of the
  // whole app failing to render.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  logoSource = require("@/assets/logo.png");
} catch {
  logoSource = null;
}

interface LogoProps {
  size?: "small" | "large";
  style?: StyleProp<ImageStyle>;
}

export function Logo({ size = "small", style }: LogoProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;

  if (!logoSource) return null;

  const baseSize = size === "large" ? (isTablet ? 160 : 120) : isTablet ? 56 : 40;

  return (
    <Image
      source={logoSource}
      resizeMode="contain"
      style={[{ width: baseSize, height: baseSize }, style]}
    />
  );
}
