import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { FontSize, FontWeight, Spacing } from "@/constants/theme";
import { useSettings } from "@/hooks/useSettings";
import { useTheme } from "@/hooks/useTheme";
import { settingsSchema, type SettingsFormValues } from "@/types/settings";

export default function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const { colors } = useTheme();
  const [savedMessage, setSavedMessage] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      restaurantName: settings.restaurantName,
      currency: settings.currency,
      taxPercent: settings.taxRate * 100,
      profitMarginPercent: settings.profitMarginPercent,
    },
  });

  useEffect(() => {
    reset({
      restaurantName: settings.restaurantName,
      currency: settings.currency,
      taxPercent: settings.taxRate * 100,
      profitMarginPercent: settings.profitMarginPercent,
    });
  }, [settings, reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    await updateSettings({
      restaurantName: values.restaurantName,
      currency: values.currency,
      taxRate: values.taxPercent / 100,
      profitMarginPercent: values.profitMarginPercent,
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppHeader title="Settings" />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.form}>
          <Controller
            control={control}
            name="restaurantName"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Restaurant Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.restaurantName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="currency"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Currency Symbol"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.currency?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="taxPercent"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Tax Percentage"
                keyboardType="decimal-pad"
                value={String(value)}
                onChangeText={(text) => onChange(Number(text) || 0)}
                onBlur={onBlur}
                error={errors.taxPercent?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="profitMarginPercent"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormInput
                label="Profit Margin Percentage"
                keyboardType="decimal-pad"
                value={String(value)}
                onChangeText={(text) => onChange(Number(text) || 0)}
                onBlur={onBlur}
                error={errors.profitMarginPercent?.message}
              />
            )}
          />

          <View style={styles.footer}>
            {savedMessage ? (
              <Text style={[styles.saved, { color: colors.success }]}>Settings saved</Text>
            ) : (
              <View />
            )}
            <Button label="Save Settings" onPress={handleSubmit(onSubmit)} />
          </View>
        </Card>
      </ScrollView>
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
  form: {
    gap: Spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saved: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
});
