import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface LoadingSpinnerProps {
  label?: string;
  fullscreen?: boolean;
}

export function LoadingSpinner({ label, fullscreen }: LoadingSpinnerProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        fullscreen && { flex: 1, backgroundColor: colors.background },
      ]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
  },
});
