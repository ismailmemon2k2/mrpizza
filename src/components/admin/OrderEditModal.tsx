import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { FontSize, FontWeight, Radius, Shadows, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { checkoutSchema, type CheckoutFormValues } from "@/types/checkout";
import type { Order } from "@/types/order";

interface OrderEditModalProps {
  order: Order | null;
  onClose: () => void;
  onSave: (order: Order, values: CheckoutFormValues) => void;
}

export function OrderEditModal({ order, onClose, onSave }: OrderEditModalProps) {
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: order?.customerName ?? "",
      customerPhone: order?.customerPhone ?? "",
      tableNumber: order?.tableNumber ?? "",
      customerNote: order?.customerNote ?? "",
    },
  });

  useEffect(() => {
    reset({
      customerName: order?.customerName ?? "",
      customerPhone: order?.customerPhone ?? "",
      tableNumber: order?.tableNumber ?? "",
      customerNote: order?.customerNote ?? "",
    });
  }, [order, reset]);

  const onSubmit = (values: CheckoutFormValues) => {
    if (!order) return;
    onSave(order, values);
  };

  return (
    <Modal visible={!!order} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }, Shadows.lg]}>
          <Text style={[styles.title, { color: colors.text }]}>Edit Order</Text>

          <Controller
            control={control}
            name="customerName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Customer Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.customerName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="customerPhone"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Phone Number"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.customerPhone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="tableNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Table Number (optional)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.tableNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="customerNote"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Order Notes (optional)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.customerNote?.message}
              />
            )}
          />

          <View style={styles.actions}>
            <Button label="Cancel" variant="secondary" onPress={onClose} />
            <Button label="Save" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </View>
    </Modal>
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
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
