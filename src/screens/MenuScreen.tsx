import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { MenuItemCard } from "@/components/pos/MenuItemCard";
import { CategoryTabs } from "@/components/pos/CategoryTabs";
import { OrderSummaryBar } from "@/components/pos/OrderSummaryBar";
import { AppHeader } from "@/components/ui/AppHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FontSize, FontWeight, Spacing, TABLET_BREAKPOINT } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/hooks/useTheme";
import { getCategories, getMenuItems } from "@/services/menuService";
import type { Category, MenuItem } from "@/types/menu";

export default function MenuScreen() {
  const { session, isHydrated, logout } = useAuth();
  const { colors } = useTheme();
  const { items: cartItems, totals, addItem } = useCart();
  const { width } = useWindowDimensions();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isHydrated && !session) {
      router.replace("/login");
    }
  }, [isHydrated, session]);

  useEffect(() => {
    Promise.all([getCategories(), getMenuItems()])
      .then(([loadedCategories, loadedItems]) => {
        setCategories(loadedCategories);
        setMenuItems(loadedItems);
        setSelectedCategoryId(loadedCategories[0]?.id ?? "");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const visibleItems = menuItems.filter(
    (item) => item.categoryId === selectedCategoryId,
  );
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const numColumns = width >= TABLET_BREAKPOINT ? 4 : 2;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title={`Hi, ${session?.name ?? ""}`}
        rightSlot={
          <View style={styles.headerActions}>
            <Text style={[styles.headerLink, { color: colors.text }]} onPress={() => router.push("/orders")}>
              My Orders
            </Text>
            <Text style={[styles.headerLink, { color: colors.primary }]} onPress={handleLogout}>
              Log out
            </Text>
          </View>
        }
      />

      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

      {isLoading ? (
        <LoadingSpinner fullscreen label="Loading menu..." />
      ) : (
        <FlatList
          key={numColumns}
          data={visibleItems}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <MenuItemCard item={item} onPress={addItem} />
          )}
        />
      )}

      <OrderSummaryBar
        totals={totals}
        itemCount={cartQuantity}
        actionLabel="View Cart"
        disabled={cartQuantity === 0}
        onPressAction={() => router.push("/cart")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  headerLink: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  grid: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  row: {
    gap: Spacing.md,
  },
});
