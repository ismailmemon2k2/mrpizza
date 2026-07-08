import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  accentColor?: string;
}

export function StatCard({ label, value, hint, accentColor }: StatCardProps) {
  const { colors } = useTheme();
  const accent = accentColor ?? colors.primary;

  return (
    <Card style={styles.card}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      {hint ? <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 160,
    gap: Spacing.xs,
    overflow: "hidden",
  },
  accent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    marginTop: Spacing.xs,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  hint: {
    fontSize: FontSize.sm,
  },
});
