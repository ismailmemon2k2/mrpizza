import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";

import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, { toValue: value, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onPress={toggleTheme}
        onPressIn={() => animateTo(0.88)}
        onPressOut={() => animateTo(1)}
        style={[
          styles.button,
          { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
        ]}
      >
        <Text style={styles.icon}>{isDark ? "☀️" : "🌙"}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  icon: {
    fontSize: 18,
  },
});
