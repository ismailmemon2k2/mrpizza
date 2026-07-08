import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/hooks/useTheme";
import { submitOrder } from "@/services/orderService";
import { checkoutSchema, type CheckoutFormValues } from "@/types/checkout";
import type { Order } from "@/types/order";
import { formatPrice } from "@/utils/currency";

export default function CheckoutScreen() {
  const { session } = useAuth();
  const { colors } = useTheme();
  const { items, totals, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: "", customerPhone: "", tableNumber: "", customerNote: "" },
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!session) return;

    setIsSubmitting(true);
    const order: Order = {
      id: `order-${Date.now()}`,
      employeeId: session.employeeId,
      employeeName: session.name,
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      status: "pending",
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      tableNumber: values.tableNumber,
      customerNote: values.customerNote,
      createdAt: new Date().toISOString(),
    };

    try {
      await submitOrder(order);
      clearCart();
      router.replace("/menu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total due</Text>
      <Text style={[styles.total, { color: colors.text }]}>{formatPrice(totals.total)}</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="customerName"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInput
              label="Customer Name"
              placeholder="e.g. Jane Doe"
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
              placeholder="e.g. 555-123-4567"
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
              placeholder="e.g. 12"
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
              placeholder="e.g. no onions"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.customerNote?.message}
            />
          )}
        />
      </View>

      <Button
        label={isSubmitting ? "Placing order..." : "Complete Order"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting || items.length === 0}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  summaryLabel: {
    fontSize: FontSize.md,
  },
  total: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  form: {
    gap: Spacing.md,
  },
});
