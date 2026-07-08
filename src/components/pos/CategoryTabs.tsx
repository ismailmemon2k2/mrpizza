import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { FontSize, FontWeight, Radius, Spacing, TouchTarget } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { Category } from "@/types/menu";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryTabsProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId;
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(category.id)}
            style={[
              styles.tab,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.label, { color: isSelected ? colors.onPrimary : colors.text }]}>
              {category.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  tab: {
    minHeight: TouchTarget.min,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
