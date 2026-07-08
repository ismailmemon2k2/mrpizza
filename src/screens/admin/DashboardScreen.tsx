import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { StatCard } from "@/components/admin/StatCard";
import { TopItemsList } from "@/components/admin/TopItemsList";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import { getOrders } from "@/services/orderService";
import type { Order } from "@/types/order";
import { computeDashboardStats, computeTopItems } from "@/utils/analytics";
import { formatPrice } from "@/utils/currency";
import { getOrderStatusColors, ORDER_STATUS_LABELS } from "@/utils/orderStatus";

export default function DashboardScreen() {
  const { session, logout } = useAuth();
  const { settings } = useSettings();
  const { colors } = useTheme();
  const statusColors = getOrderStatusColors(colors);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    setOrders(await getOrders());
  }, []);

  useEffect(() => {
    loadOrders().finally(() => setIsLoading(false));
  }, [loadOrders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOrders();
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const stats = computeDashboardStats(orders);
  const topItems = computeTopItems(orders, 5);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader
        title={settings.restaurantName}
        subtitle={`Welcome back, ${session?.name ?? ""}`}
        rightSlot={
          <Text style={[styles.logout, { color: colors.primary }]} onPress={handleLogout}>
            Log out
          </Text>
        }
      />

      {isLoading ? (
        <LoadingSpinner fullscreen label="Loading dashboard..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Orders</Text>
          <View style={styles.grid}>
            <StatCard label="Total Orders" value={String(stats.totalOrders)} />
            {(Object.keys(stats.statusCounts) as Array<keyof typeof stats.statusCounts>).map((status) => (
              <StatCard
                key={status}
                label={ORDER_STATUS_LABELS[status]}
                value={String(stats.statusCounts[status])}
                accentColor={statusColors[status]}
              />
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profit Breakdown</Text>
          <View style={styles.grid}>
            <StatCard label="Gross Revenue" value={formatPrice(stats.grossRevenue)} accentColor={colors.primary} />
            <StatCard label="Total Cost" value={formatPrice(stats.totalCost)} accentColor={colors.danger} />
            <StatCard label="Gross Profit" value={formatPrice(stats.grossProfit)} accentColor={colors.success} />
            <StatCard label="Total Revenue (incl. tax)" value={formatPrice(stats.totalRevenueWithTax)} />
            <StatCard label="Average Order Value" value={formatPrice(stats.averageOrderValue)} />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Best Selling Items</Text>
          <Card>
            <TopItemsList items={topItems} />
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
  logout: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
});
