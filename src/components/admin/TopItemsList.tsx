import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { TopItem } from "@/utils/analytics";
import { formatPrice } from "@/utils/currency";

interface TopItemsListProps {
  items: TopItem[];
  emptyMessage?: string;
}

export function TopItemsList({ items, emptyMessage = "No sales data yet" }: TopItemsListProps) {
  const { colors } = useTheme();

  if (items.length === 0) {
    return <Text style={[styles.empty, { color: colors.textMuted }]}>{emptyMessage}</Text>;
  }

  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <View key={item.itemId} style={styles.itemRow}>
          <Text style={[styles.itemRank, { color: colors.textMuted }]}>{index + 1}</Text>
          <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.itemQuantity, { color: colors.textMuted }]}>{item.quantity} sold</Text>
          <Text style={[styles.itemRevenue, { color: colors.text }]}>{formatPrice(item.revenue)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  empty: {
    fontSize: FontSize.sm,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  itemRank: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    width: 20,
  },
  itemName: {
    flex: 1,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  itemQuantity: {
    fontSize: FontSize.sm,
  },
  itemRevenue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
