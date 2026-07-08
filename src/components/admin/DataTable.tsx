import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { FontSize, FontWeight, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  flex?: number;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  emptyMessage = "No records found",
}: DataTableProps<T>) {
  const { colors } = useTheme();

  return (
    <View style={[styles.table, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.row, { backgroundColor: colors.surfaceAlt, borderBottomColor: colors.border }]}>
        {columns.map((column) => (
          <Text
            key={column.key}
            style={[styles.headerCell, { flex: column.flex ?? 1, color: colors.textMuted }]}
          >
            {column.label}
          </Text>
        ))}
      </View>

      {rows.length === 0 ? (
        <View style={styles.emptyRow}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>{emptyMessage}</Text>
        </View>
      ) : (
        rows.map((row) => (
          <View key={keyExtractor(row)} style={[styles.row, { borderBottomColor: colors.border }]}>
            {columns.map((column) => (
              <View key={column.key} style={{ flex: column.flex ?? 1 }}>
                {column.render(row)}
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    gap: Spacing.sm,
  },
  headerCell: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textTransform: "uppercase",
  },
  emptyRow: {
    padding: Spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    fontSize: FontSize.md,
  },
});
