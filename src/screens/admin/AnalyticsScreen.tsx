import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { BarChart } from "@/components/admin/BarChart";
import { TopItemsList } from "@/components/admin/TopItemsList";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FontSize, FontWeight, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { getCategories } from "@/services/menuService";
import { getOrders } from "@/services/orderService";
import type { Category } from "@/types/menu";
import type { Order } from "@/types/order";
import {
  computeCategorySales,
  computeOrdersByDay,
  computeRevenueByDay,
  computeTopItems,
} from "@/utils/analytics";
import { formatPrice } from "@/utils/currency";

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [loadedOrders, loadedCategories] = await Promise.all([
      getOrders(),
      getCategories(),
    ]);
    setOrders(loadedOrders);
    setCategories(loadedCategories);
  }, []);

  useEffect(() => {
    loadData().finally(() => setIsLoading(false));
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const revenueByDay = computeRevenueByDay(orders);
  const ordersByDay = computeOrdersByDay(orders);
  const categorySales = computeCategorySales(orders, categories);
  const topItems = computeTopItems(orders, 5);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Analytics" />

      {isLoading ? (
        <LoadingSpinner fullscreen label="Loading analytics..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        >
          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue (last 7 days)</Text>
            <BarChart data={revenueByDay} formatValue={(value) => formatPrice(value)} />
          </Card>

          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Orders per Day</Text>
            <BarChart data={ordersByDay} barColor={colors.success} />
          </Card>

          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Sales</Text>
            <View style={styles.list}>
              {categorySales.length === 0 ? (
                <Text style={[styles.empty, { color: colors.textMuted }]}>No sales data yet</Text>
              ) : (
                categorySales.map((category) => (
                  <View key={category.categoryId} style={styles.categoryRow}>
                    <View style={styles.categoryHeader}>
                      <Text style={[styles.categoryName, { color: colors.text }]}>
                        {category.categoryName}
                      </Text>
                      <Text style={[styles.categoryValue, { color: colors.textMuted }]}>
                        {formatPrice(category.revenue)}
                      </Text>
                    </View>
                    <View style={[styles.progressTrack, { backgroundColor: colors.background }]}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${category.percentage}%`, backgroundColor: colors.primary },
                        ]}
                      />
                    </View>
                  </View>
                ))
              )}
            </View>
          </Card>

          <Card>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Most Popular Items</Text>
            <View style={styles.list}>
              <TopItemsList items={topItems} />
            </View>
          </Card>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  list: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  empty: {
    fontSize: FontSize.sm,
  },
  categoryRow: {
    gap: Spacing.xs,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  categoryValue: {
    fontSize: FontSize.sm,
  },
  progressTrack: {
    height: 8,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.sm,
  },
});
