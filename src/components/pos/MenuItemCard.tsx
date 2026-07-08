import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

import { FontSize, FontWeight, Radius, Shadows, Spacing, TouchTarget } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { MenuItem } from "@/types/menu";
import { formatPrice } from "@/utils/currency";

interface MenuItemCardProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onPress }: MenuItemCardProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={() => onPress(item)}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        style={({ pressed }) => [
          styles.card,
          Shadows.sm,
          {
            backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>{formatPrice(item.price)}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: TouchTarget.large,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
