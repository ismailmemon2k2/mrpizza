import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, FontWeight, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <StepButton label="-" onPress={onDecrement} />
      <Text style={[styles.quantity, { color: colors.text }]}>{quantity}</Text>
      <StepButton label="+" onPress={onIncrement} />
    </View>
  );
}

function StepButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.stepButton,
        {
          backgroundColor: pressed ? colors.surfaceAlt : colors.background,
          borderColor: colors.border,
        },
      ]}
      hitSlop={8}
    >
      <Text style={[styles.stepLabel, { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  quantity: {
    minWidth: 28,
    textAlign: "center",
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
