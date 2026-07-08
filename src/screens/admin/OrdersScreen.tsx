import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { DataTable, type DataTableColumn } from "@/components/admin/DataTable";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { OrderEditModal } from "@/components/admin/OrderEditModal";
import { AppHeader } from "@/components/ui/AppHeader";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FilterChips } from "@/components/ui/FilterChips";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SearchBar } from "@/components/ui/SearchBar";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { deleteOrder, getOrders, updateOrder, updateOrderStatus } from "@/services/orderService";
import type { CheckoutFormValues } from "@/types/checkout";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/types/order";
import { formatDateTime, isToday, isWithinLastDays } from "@/utils/date";
import { formatPrice } from "@/utils/currency";
import { getOrderStatusColors, ORDER_STATUS_LABELS } from "@/utils/orderStatus";

type DateFilter = "all" | "today" | "week";

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
];

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status] })),
];

export default function OrdersScreen() {
  const { colors } = useTheme();
  const statusColors = getOrderStatusColors(colors);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Order | null>(null);
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

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" && isToday(order.createdAt)) ||
        (dateFilter === "week" && isWithinLastDays(order.createdAt, 7));

      if (!matchesDate) return false;
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!query) return true;

      const haystack = [
        order.id,
        order.employeeName,
        order.customerName,
        order.customerPhone,
        ...order.items.map((item) => item.menuItem.name),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [orders, search, dateFilter, statusFilter]);

  const handleDelete = (order: Order) => {
    setSelectedOrder(null);
    setPendingDelete(order);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await deleteOrder(pendingDelete.id);
    setPendingDelete(null);
    await loadOrders();
  };

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    await updateOrderStatus(order.id, status);
    setSelectedOrder((current) => (current && current.id === order.id ? { ...current, status } : current));
    await loadOrders();
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(null);
    setEditingOrder(order);
  };

  const handleSaveEdit = async (order: Order, values: CheckoutFormValues) => {
    await updateOrder({ ...order, ...values });
    setEditingOrder(null);
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
      label: "Date",
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
      key: "employee",
      label: "Employee",
      flex: 0.9,
      render: (order) => <Text style={[styles.cell, { color: colors.text }]}>{order.employeeName}</Text>,
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
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Orders" />

      {isLoading ? (
        <LoadingSpinner fullscreen label="Loading orders..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        >
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Search by order, customer, employee, or item"
          />
          <FilterChips options={DATE_FILTERS} selected={dateFilter} onSelect={setDateFilter} />
          <FilterChips options={STATUS_FILTERS} selected={statusFilter} onSelect={setStatusFilter} />

          <DataTable
            columns={columns}
            rows={filteredOrders}
            keyExtractor={(order) => order.id}
            emptyMessage="No orders match your filters"
          />
        </ScrollView>
      )}

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        availableStatuses={ORDER_STATUSES}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <OrderEditModal order={editingOrder} onClose={() => setEditingOrder(null)} onSave={handleSaveEdit} />

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Delete order"
        message={`Delete order #${pendingDelete?.id.slice(-6)}? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
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
