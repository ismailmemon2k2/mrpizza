import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FontSize, FontWeight, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  rightSlot?: React.ReactNode;
}

export function AppHeader({ title, subtitle, showLogo = true, rightSlot }: AppHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
        Shadows.sm,
      ]}
    >
      <View style={styles.leftGroup}>
        {showLogo ? <Logo /> : null}
        <View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightGroup}>
        {rightSlot}
        <ThemeToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flexShrink: 1,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
});
