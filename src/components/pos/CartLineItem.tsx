import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { CartItem } from "@/types/order";
import { formatPrice } from "@/utils/currency";

interface CartLineItemProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartLineItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartLineItemProps) {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{item.menuItem.name}</Text>
        <Text style={[styles.lineTotal, { color: colors.textMuted }]}>
          {formatPrice(item.menuItem.price * item.quantity)}
        </Text>
      </View>
      <View style={styles.controls}>
        <QuantityStepper
          quantity={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
        <Pressable onPress={onRemove} hitSlop={8}>
          <Text style={[styles.remove, { color: colors.danger }]}>Remove</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.md,
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  lineTotal: {
    fontSize: FontSize.sm,
  },
  controls: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  remove: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
