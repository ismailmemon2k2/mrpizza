import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import type { ChartPoint } from "@/utils/analytics";

interface BarChartProps {
  data: ChartPoint[];
  formatValue?: (value: number) => string;
  barColor?: string;
}

const CHART_HEIGHT = 140;

export function BarChart({ data, formatValue, barColor }: BarChartProps) {
  const { colors } = useTheme();
  const color = barColor ?? colors.primary;
  const maxValue = Math.max(1, ...data.map((point) => point.value));

  return (
    <View style={styles.container}>
      <View style={styles.bars}>
        {data.map((point) => {
          const height = Math.max(4, (point.value / maxValue) * CHART_HEIGHT);
          return (
            <View key={point.label} style={styles.barColumn}>
              <Text style={[styles.valueLabel, { color: colors.textMuted }]}>
                {formatValue ? formatValue(point.value) : point.value}
              </Text>
              <View style={[styles.bar, { height, backgroundColor: color }]} />
              <Text style={[styles.axisLabel, { color: colors.textMuted }]}>{point.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: CHART_HEIGHT + 48,
    gap: Spacing.xs,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.xs,
  },
  bar: {
    width: "70%",
    borderRadius: Radius.sm,
    minHeight: 4,
  },
  valueLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  axisLabel: {
    fontSize: 11,
  },
});
