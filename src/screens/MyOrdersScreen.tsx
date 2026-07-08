import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text } from "react-native";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { FilterChips } from "@/components/ui/FilterChips";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchBar } from "@/components/ui/SearchBar";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { getOrders, updateOrderStatus } from "@/services/orderService";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/types/order";
import { formatPrice } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { getAvailableNextStatuses, getOrderStatusColors, ORDER_STATUS_LABELS } from "@/utils/orderStatus";

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status] })),
];

export default function MyOrdersScreen() {
  const { session, isHydrated } = useAuth();
  const { colors } = useTheme();
  const statusColors = getOrderStatusColors(colors);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isHydrated && !session) {
      router.replace("/login");
    }
  }, [isHydrated, session]);

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

  const myOrders = useMemo(
    () => orders.filter((order) => order.employeeId === session?.employeeId),
    [orders, session?.employeeId],
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return myOrders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!query) return true;

      const haystack = [order.id, order.customerName, ...order.items.map((item) => item.menuItem.name)]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [myOrders, search, statusFilter]);

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    await updateOrderStatus(order.id, status);
    setSelectedOrder((current) => (current && current.id === order.id ? { ...current, status } : current));
    await loadOrders();
  };

  const columns: DataTableColumn<Order>[] = [
    {
      key: "id",
      label: "Order",
      flex: 1,
      render: (order) => <Text style={[styles.cell, { color: colors.text }]}>#{order.id.slice(-6)}</Text>,
    },
    {
      key: "date",
      label: "Time",
      flex: 1.2,
      render: (order) => (
        <Text style={[styles.cell, { color: colors.text }]}>{formatDateTime(order.createdAt)}</Text>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      flex: 1,
      render: (order) => <Text style={[styles.cell, { color: colors.text }]}>{order.customerName}</Text>,
    },
    {
      key: "total",
      label: "Total",
      flex: 0.7,
      render: (order) => (
        <Text style={[styles.cellStrong, { color: colors.text }]}>{formatPrice(order.total)}</Text>
      ),
    },
    {
      key: "status",
      label: "Status",
      flex: 0.8,
      render: (order) => (
        <Text style={[styles.statusValue, { color: statusColors[order.status] }]}>
          {ORDER_STATUS_LABELS[order.status]}
        </Text>
      ),
    },
    {
      key: "actions",
      label: "",
      flex: 0.6,
      render: (order) => (
        <Text style={[styles.viewLink, { color: colors.primary }]} onPress={() => setSelectedOrder(order)}>
          View
        </Text>
      ),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
    >
      <Text style={[styles.title, { color: colors.text }]}>My Orders</Text>
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search by order, customer, or item" />
      <FilterChips options={STATUS_FILTERS} selected={statusFilter} onSelect={setStatusFilter} />

      {isLoading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : (
        <DataTable
          columns={columns}
          rows={filteredOrders}
          keyExtractor={(order) => order.id}
          emptyMessage="No orders match your filters"
        />
      )}

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        availableStatuses={selectedOrder ? getAvailableNextStatuses(selectedOrder.status) : []}
        onStatusChange={handleStatusChange}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  cell: {
    fontSize: FontSize.sm,
  },
  cellStrong: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  statusValue: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  viewLink: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
