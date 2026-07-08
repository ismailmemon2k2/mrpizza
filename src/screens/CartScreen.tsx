import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { CartLineItem } from "@/components/pos/CartLineItem";
import { OrderSummaryBar } from "@/components/pos/OrderSummaryBar";
import { FontSize, Spacing } from "@/constants/theme";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/hooks/useTheme";

export default function CartScreen() {
  const { colors } = useTheme();
  const { items, totals, updateQuantity, removeItem } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>Cart is empty</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.menuItem.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CartLineItem
              item={item}
              onIncrement={() =>
                updateQuantity(item.menuItem.id, item.quantity + 1)
              }
              onDecrement={() =>
                updateQuantity(item.menuItem.id, item.quantity - 1)
              }
              onRemove={() => removeItem(item.menuItem.id)}
            />
          )}
        />
      )}

      <OrderSummaryBar
        totals={totals}
        itemCount={itemCount}
        actionLabel="Checkout"
        disabled={itemCount === 0}
        onPressAction={() => router.push("/checkout")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: FontSize.lg,
  },
});
