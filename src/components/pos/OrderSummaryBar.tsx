import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { FontSize, FontWeight, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { OrderTotals } from "@/utils/calculateTotals";
import { formatPrice } from "@/utils/currency";

interface OrderSummaryBarProps {
  totals: OrderTotals;
  itemCount: number;
  actionLabel: string;
  onPressAction: () => void;
  disabled?: boolean;
}

export function OrderSummaryBar({
  totals,
  itemCount,
  actionLabel,
  onPressAction,
  disabled = false,
}: OrderSummaryBarProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
        Shadows.md,
      ]}
    >
      <View style={styles.totalsColumn}>
        <Text style={[styles.itemCount, { color: colors.textMuted }]}>
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </Text>
        <Text style={[styles.total, { color: colors.text }]}>{formatPrice(totals.total)}</Text>
      </View>
      <Button
        label={actionLabel}
        onPress={onPressAction}
        disabled={disabled}
        style={styles.actionButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  totalsColumn: {
    gap: Spacing.xs,
  },
  itemCount: {
    fontSize: FontSize.sm,
  },
  total: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  actionButton: {
    minWidth: 160,
  },
});
