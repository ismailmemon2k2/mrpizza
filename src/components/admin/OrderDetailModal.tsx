import React from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { FilterChips } from "@/components/ui/FilterChips";
import { FontSize, FontWeight, Radius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { Order, OrderStatus } from "@/types/order";
import { formatDateTime } from "@/utils/date";
import { formatPrice } from "@/utils/currency";
import { getOrderStatusColors, ORDER_STATUS_LABELS } from "@/utils/orderStatus";

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  availableStatuses: OrderStatus[];
  onStatusChange: (order: Order, status: OrderStatus) => void;
  onDelete?: (order: Order) => void;
  onEdit?: (order: Order) => void;
}

export function OrderDetailModal({
  order,
  onClose,
  availableStatuses,
  onStatusChange,
  onDelete,
  onEdit,
}: OrderDetailModalProps) {
  const { colors } = useTheme();
  const statusColors = getOrderStatusColors(colors);

  return (
    <Modal visible={!!order} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }, Shadows.lg]}>
          {order ? (
            <ScrollView>
              <Text style={[styles.title, { color: colors.text }]}>Order #{order.id.slice(-6)}</Text>
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                {formatDateTime(order.createdAt)}
              </Text>
              <Text style={[styles.meta, { color: colors.textMuted }]}>
                Employee: {order.employeeName}
              </Text>

              <View style={[styles.customerBlock, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.customerName, { color: colors.text }]}>{order.customerName}</Text>
                <Text style={[styles.meta, { color: colors.textMuted }]}>{order.customerPhone}</Text>
                {order.tableNumber ? (
                  <Text style={[styles.meta, { color: colors.textMuted }]}>Table {order.tableNumber}</Text>
                ) : null}
              </View>

              <View style={styles.items}>
                {order.items.map((line) => (
                  <View key={line.menuItem.id} style={styles.itemRow}>
                    <Text style={[styles.itemName, { color: colors.text }]}>
                      {line.quantity} × {line.menuItem.name}
                    </Text>
                    <Text style={[styles.itemPrice, { color: colors.text }]}>
                      {formatPrice(line.menuItem.price * line.quantity)}
                    </Text>
                  </View>
                ))}
              </View>

              {order.customerNote ? (
                <Text style={[styles.note, { color: colors.textMuted }]}>Note: {order.customerNote}</Text>
              ) : null}

              <View style={[styles.totalsBlock, { borderTopColor: colors.border }]}>
                <TotalRow label="Subtotal" value={formatPrice(order.subtotal)} />
                <TotalRow label="Tax" value={formatPrice(order.tax)} />
                <TotalRow label="Total" value={formatPrice(order.total)} emphasize />
              </View>

              <View style={styles.statusBlock}>
                <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Status</Text>
                {availableStatuses.length > 0 ? (
                  <FilterChips
                    options={availableStatuses.map((status) => ({
                      value: status,
                      label: ORDER_STATUS_LABELS[status],
                    }))}
                    selected={order.status}
                    onSelect={(status) => onStatusChange(order, status)}
                  />
                ) : (
                  <Text style={[styles.statusValue, { color: statusColors[order.status] }]}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Text>
                )}
              </View>

              <View style={styles.actions}>
                {onEdit ? (
                  <Button label="Edit Order" variant="secondary" onPress={() => onEdit(order)} />
                ) : null}
                {onDelete ? (
                  <Button label="Delete Order" variant="danger" onPress={() => onDelete(order)} />
                ) : null}
                <Button label="Close" variant="secondary" onPress={onClose} />
              </View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function TotalRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  const { colors } = useTheme();
  const labelStyle = emphasize
    ? [styles.totalLabelStrong, { color: colors.text }]
    : [styles.totalLabel, { color: colors.textMuted }];
  const valueStyle = emphasize
    ? [styles.totalValueStrong, { color: colors.text }]
    : [styles.totalValue, { color: colors.text }];

  return (
    <View style={styles.totalRow}>
      <Text style={labelStyle}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.lg,
  },
  sheet: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    maxHeight: "85%",
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  meta: {
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
  },
  customerBlock: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
  },
  customerName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  items: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: FontSize.md,
  },
  itemPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  note: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    fontStyle: "italic",
  },
  totalsBlock: {
    marginTop: Spacing.lg,
    borderTopWidth: 1,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: FontSize.sm,
  },
  totalValue: {
    fontSize: FontSize.sm,
  },
  totalLabelStrong: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  totalValueStrong: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  statusBlock: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  statusLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  statusValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  actions: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
});
