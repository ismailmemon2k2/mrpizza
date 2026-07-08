import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FontSize, FontWeight, Radius, Shadows, Spacing, TouchTarget } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface NumberPadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "<-"];

export function NumberPad({ onDigitPress, onBackspace }: NumberPadProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.grid}>
      {DIGITS.map((digit, index) => {
        if (digit === "") {
          return <View key={`empty-${index}`} style={styles.key} />;
        }
        const isBackspace = digit === "<-";
        return (
          <Pressable
            key={digit}
            onPress={() => (isBackspace ? onBackspace() : onDigitPress(digit))}
            style={({ pressed }) => [
              styles.key,
              Shadows.sm,
              {
                backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.keyLabel, { color: colors.text }]}>{digit}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.sm,
    maxWidth: 3 * TouchTarget.large + 2 * Spacing.sm,
  },
  key: {
    width: TouchTarget.large,
    height: TouchTarget.large,
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  keyLabel: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.medium,
  },
});
