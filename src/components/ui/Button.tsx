import React, { useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { FontSize, FontWeight, Radius, Shadows, Spacing, TouchTarget } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  };

  const variantStyle = {
    primary: { backgroundColor: colors.primary },
    secondary: {
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    danger: { backgroundColor: colors.danger },
  }[variant];

  const labelColor = variant === "secondary" ? colors.text : colors.onPrimary;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => !disabled && animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        style={[styles.base, variantStyle, disabled && styles.disabled, variant !== "secondary" && Shadows.sm]}
      >
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: TouchTarget.min,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
});
